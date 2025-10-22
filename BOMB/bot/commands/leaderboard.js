const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { loadLatestData, loadHistoricalData } = require('../utils/dataLoader');
const { calculateGrowth } = require('../utils/calculations');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('🏆 View artist rankings across different metrics with podium display')
        .addStringOption(option =>
            option.setName('metric')
                .setDescription('What to rank by')
                .setRequired(true)
                .addChoices(
                    { name: 'Spotify Monthly Listeners', value: 'spotify-listeners' },
                    { name: 'Spotify Followers', value: 'spotify-followers' },
                    { name: 'YouTube Subscribers', value: 'youtube-subs' },
                    { name: 'YouTube Total Views', value: 'youtube-views' },
                    { name: 'Instagram Followers', value: 'instagram-followers' },
                    { name: 'Total Reach (All Platforms)', value: 'total-reach' },
                    { name: 'Weekly Momentum (7-day growth)', value: 'momentum' },
                    { name: 'Engagement Score', value: 'engagement' }
                )),

    async execute(interaction) {
        await interaction.deferReply();

        const metric = interaction.options.getString('metric');
        const data = await loadLatestData();

        if (!data) {
            return interaction.editReply('❌ Error loading data. Please try again later.');
        }

        let historicalData = null;
        if (metric === 'momentum') {
            historicalData = await loadHistoricalData(7);
            if (!historicalData || historicalData.length < 2) {
                return interaction.editReply('❌ Not enough historical data for momentum calculation.');
            }
        }

        // Calculate rankings
        let rankings = [];

        for (const artist of data.artists) {
            let value = 0;
            let displayValue = '';
            let growth = null;

            switch (metric) {
                case 'spotify-listeners':
                    value = parseInt(artist.spotify?.monthly_listeners) || 0;
                    displayValue = value === 0 ? 'N/A' : `${value.toLocaleString()} listeners`;
                    break;

                case 'spotify-followers':
                    value = artist.spotify?.followers || 0;
                    displayValue = `${value.toLocaleString()} followers`;
                    break;

                case 'youtube-subs':
                    value = artist.youtube?.subscribers || 0;
                    displayValue = `${value.toLocaleString()} subscribers`;
                    break;

                case 'youtube-views':
                    value = artist.youtube?.total_views || 0;
                    displayValue = `${value.toLocaleString()} views`;
                    break;

                case 'instagram-followers':
                    value = artist.instagram?.followers || 0;
                    displayValue = `${value.toLocaleString()} followers`;
                    break;

                case 'total-reach':
                    const spotifyFollowers = artist.spotify?.followers || 0;
                    const youtubeSubscribers = artist.youtube?.subscribers || 0;
                    const instagramFollowers = artist.instagram?.followers || 0;
                    value = spotifyFollowers + youtubeSubscribers + instagramFollowers;
                    displayValue = `${value.toLocaleString()} total followers`;
                    break;

                case 'momentum':
                    if (historicalData) {
                        const oldData = historicalData[historicalData.length - 1];
                        const oldArtist = oldData.artists?.find(a => a.name === artist.name);

                        if (oldArtist) {
                            const currentTotal = (artist.spotify?.followers || 0) +
                                               (artist.youtube?.subscribers || 0) +
                                               (artist.instagram?.followers || 0);
                            const oldTotal = (oldArtist.spotify?.followers || 0) +
                                           (oldArtist.youtube?.subscribers || 0) +
                                           (oldArtist.instagram?.followers || 0);

                            if (oldTotal > 0) {
                                growth = ((currentTotal - oldTotal) / oldTotal * 100);
                                value = growth;
                                displayValue = growth > 0 ? `+${growth.toFixed(1)}%` : `${growth.toFixed(1)}%`;
                            } else {
                                value = 0;
                                displayValue = 'New artist';
                            }
                        }
                    }
                    break;

                case 'engagement':
                    // Calculate engagement score based on listener-to-follower ratio
                    const listeners = parseInt(artist.spotify?.monthly_listeners) || 0;
                    const followers = artist.spotify?.followers || 1;
                    const ratio = listeners / followers;
                    const ytViews = artist.youtube?.total_views || 0;
                    const ytSubs = artist.youtube?.subscribers || 1;
                    const ytRatio = ytViews / ytSubs;

                    // Weighted engagement score
                    value = (ratio * 50) + (ytRatio * 0.5);
                    displayValue = `${value.toFixed(1)} points`;
                    break;
            }

            // Calculate 7-day growth for all metrics using shared function
            if (metric !== 'momentum' && historicalData) {
                const oldData = historicalData[historicalData.length - 1];
                const oldArtist = oldData.artists?.find(a => a.name === artist.name);

                if (oldArtist) {
                    growth = calculateGrowth(artist, oldArtist, metric);
                }
            }

            rankings.push({
                name: artist.name,
                value: value,
                displayValue: displayValue,
                growth: growth
            });
        }

        // Sort rankings
        rankings.sort((a, b) => b.value - a.value);

        // Create progress bars
        const maxValue = Math.max(...rankings.map(r => r.value));

        // Build leaderboard display
        let leaderboardText = '';

        for (let i = 0; i < rankings.length; i++) {
            const rank = rankings[i];
            let medal = '';
            let growthEmoji = '';

            if (i === 0) medal = '🥇';
            else if (i === 1) medal = '🥈';
            else if (i === 2) medal = '🥉';

            if (rank.growth !== null) {
                if (rank.growth > 10) growthEmoji = ' 🔥';
                else if (rank.growth > 0) growthEmoji = ' 📈';
                else if (rank.growth < -10) growthEmoji = ' 📉';
                else if (rank.growth < 0) growthEmoji = ' ⬇️';
                else growthEmoji = ' ➡️';
            }

            const progressBar = rank.value > 0 && maxValue > 0
                ? '█'.repeat(Math.floor((rank.value / maxValue) * 20)) + '░'.repeat(20 - Math.floor((rank.value / maxValue) * 20))
                : '░'.repeat(20);

            if (i < 3) {
                // Top 3 with detailed display
                leaderboardText += `${medal} **${i + 1}. ${rank.name}**\n`;
                leaderboardText += `   ${progressBar} ${rank.displayValue}`;
                if (rank.growth !== null) {
                    const growthText = rank.growth > 0 ? `+${rank.growth.toFixed(1)}%` : `${rank.growth.toFixed(1)}%`;
                    leaderboardText += `\n   ${growthText} this week${growthEmoji}`;
                }
                leaderboardText += '\n\n';
            } else {
                // Rest of the rankings
                leaderboardText += `**${i + 1}.** ${rank.name} - ${rank.displayValue}`;
                if (rank.growth !== null) {
                    const growthText = rank.growth > 0 ? `+${rank.growth.toFixed(1)}%` : `${rank.growth.toFixed(1)}%`;
                    leaderboardText += ` (${growthText})${growthEmoji}`;
                }
                leaderboardText += '\n';
            }
        }

        // Create metric-specific insights
        let insights = '';
        if (metric === 'momentum') {
            const topGainer = rankings[0];
            if (topGainer.value > 0) {
                insights = `🚀 **${topGainer.name}** is on fire with ${topGainer.displayValue} growth this week!`;
            }
        } else if (metric === 'engagement') {
            insights = '💡 Higher scores mean more engaged audiences (listeners > followers)';
        } else if (metric === 'total-reach') {
            const totalReach = rankings.reduce((sum, r) => sum + r.value, 0);
            insights = `📊 **Collective Reach:** ${totalReach.toLocaleString()} total followers across all artists`;
        }

        const metricTitles = {
            'spotify-listeners': '🎵 Spotify Monthly Listeners',
            'spotify-followers': '🎵 Spotify Followers',
            'youtube-subs': '📺 YouTube Subscribers',
            'youtube-views': '👁️ YouTube Total Views',
            'instagram-followers': '📸 Instagram Followers',
            'total-reach': '🌐 Total Platform Reach',
            'momentum': '🚀 Weekly Momentum (7-day growth)',
            'engagement': '⚡ Engagement Score'
        };

        const embed = new EmbedBuilder()
            .setTitle('🏆 CASA 24 LEADERBOARD')
            .setDescription(`**Category:** ${metricTitles[metric]}\n**Updated:** ${new Date().toLocaleString()}`)
            .setColor(0xFFD700)
            .addFields(
                { name: 'Rankings', value: leaderboardText || 'No data available', inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'Use /battle to compare any two artists directly!' });

        if (insights) {
            embed.addFields({ name: 'Insights', value: insights, inline: false });
        }

        await interaction.editReply({ embeds: [embed] });
    },
};