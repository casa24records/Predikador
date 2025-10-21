const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { loadLatestData, loadHistoricalData } = require('../utils/dataLoader');
const { predictMetric } = require('../utils/analytics');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('milestones')
        .setDescription('🎯 Track progress toward milestones, predict achievement dates, and celebrate wins!')
        .addStringOption(option =>
            option.setName('artist')
                .setDescription('Specific artist to track')
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Type of milestones to show')
                .addChoices(
                    { name: 'Upcoming Milestones', value: 'upcoming' },
                    { name: 'Recently Achieved', value: 'achieved' },
                    { name: 'All Milestones', value: 'all' }
                )),

    async autocomplete(interaction) {
        const data = await loadLatestData();
        if (!data || !data.artists) return;

        const focusedValue = interaction.options.getFocused().toLowerCase();
        const choices = ['All Artists', ...data.artists.map(a => a.name)];

        const filtered = choices
            .filter(name => name.toLowerCase().includes(focusedValue))
            .slice(0, 25);

        await interaction.respond(
            filtered.map(name => ({ name: name, value: name }))
        );
    },

    async execute(interaction) {
        await interaction.deferReply();

        const artistName = interaction.options.getString('artist');
        const type = interaction.options.getString('type') || 'upcoming';

        const data = await loadLatestData();
        const historicalData = await loadHistoricalData(30);

        if (!data) {
            return interaction.editReply('❌ Error loading data. Please try again later.');
        }

        // Define milestone thresholds
        const milestones = [100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000];

        // Get artists to analyze
        const artists = artistName && artistName !== 'All Artists'
            ? data.artists.filter(a => a.name === artistName)
            : data.artists;

        let upcomingMilestones = [];
        let achievedMilestones = [];

        for (const artist of artists) {
            // Check each platform for milestones
            const metrics = [
                { platform: 'spotify', metric: 'followers', current: artist.spotify?.followers || 0, emoji: '🎵', name: 'Spotify Followers' },
                { platform: 'spotify', metric: 'monthly_listeners', current: parseInt(artist.spotify?.monthly_listeners) || 0, emoji: '🎧', name: 'Monthly Listeners' },
                { platform: 'youtube', metric: 'subscribers', current: artist.youtube?.subscribers || 0, emoji: '📺', name: 'YouTube Subscribers' },
                { platform: 'instagram', metric: 'followers', current: artist.instagram?.followers || 0, emoji: '📸', name: 'Instagram Followers' }
            ];

            for (const metricData of metrics) {
                if (metricData.current === 0) continue;

                // Find next milestone
                const nextMilestone = milestones.find(m => m > metricData.current);
                const prevMilestone = milestones.reverse().find(m => m <= metricData.current);
                milestones.reverse(); // Restore original order

                if (nextMilestone) {
                    const progress = (metricData.current / nextMilestone) * 100;
                    const needed = nextMilestone - metricData.current;

                    // Predict when milestone will be achieved
                    let prediction = null;
                    if (historicalData && historicalData.length >= 7) {
                        prediction = predictMetric(
                            historicalData,
                            artist.name,
                            metricData.platform,
                            metricData.metric,
                            90 // Look ahead 90 days
                        );
                    }

                    let eta = 'Unknown';
                    let confidence = 0;

                    if (prediction && prediction.predicted > metricData.current) {
                        const dailyGrowth = (prediction.predicted - metricData.current) / 90;
                        if (dailyGrowth > 0) {
                            const daysToMilestone = Math.ceil(needed / dailyGrowth);
                            const etaDate = new Date();
                            etaDate.setDate(etaDate.getDate() + daysToMilestone);
                            eta = etaDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                            confidence = prediction.confidence || 0;
                        }
                    }

                    upcomingMilestones.push({
                        artist: artist.name,
                        platform: metricData.name,
                        emoji: metricData.emoji,
                        current: metricData.current,
                        target: nextMilestone,
                        progress: progress,
                        needed: needed,
                        eta: eta,
                        confidence: confidence
                    });
                }

                // Check recently achieved milestones (within last 30 days)
                if (prevMilestone && historicalData && historicalData.length > 0) {
                    const oldData = historicalData[historicalData.length - 1];
                    const oldArtist = oldData.artists?.find(a => a.name === artist.name);

                    if (oldArtist) {
                        let oldValue = 0;
                        if (metricData.metric === 'followers' && metricData.platform === 'spotify') {
                            oldValue = oldArtist.spotify?.followers || 0;
                        } else if (metricData.metric === 'monthly_listeners') {
                            oldValue = parseInt(oldArtist.spotify?.monthly_listeners) || 0;
                        } else if (metricData.platform === 'youtube') {
                            oldValue = oldArtist.youtube?.subscribers || 0;
                        } else if (metricData.platform === 'instagram') {
                            oldValue = oldArtist.instagram?.followers || 0;
                        }

                        // Check if milestone was crossed in the period
                        if (oldValue < prevMilestone && metricData.current >= prevMilestone) {
                            achievedMilestones.push({
                                artist: artist.name,
                                platform: metricData.name,
                                emoji: metricData.emoji,
                                milestone: prevMilestone,
                                current: metricData.current,
                                achievedRecently: true
                            });
                        }
                    }
                }
            }
        }

        // Sort milestones
        upcomingMilestones.sort((a, b) => b.progress - a.progress);
        achievedMilestones.sort((a, b) => b.milestone - a.milestone);

        // Build embed
        const embed = new EmbedBuilder()
            .setTitle('🎯 MILESTONE TRACKER')
            .setColor(0x00FF00)
            .setTimestamp();

        if (artistName && artistName !== 'All Artists') {
            embed.setDescription(`Tracking milestones for **${artistName}**`);
        } else {
            embed.setDescription('Tracking milestones for all artists');
        }

        // Add recently achieved section
        if ((type === 'achieved' || type === 'all') && achievedMilestones.length > 0) {
            let achievedText = '';
            for (const achievement of achievedMilestones.slice(0, 5)) {
                achievedText += `✅ **${achievement.artist}** - ${achievement.emoji} ${achievement.platform}\n`;
                achievedText += `   Achieved: ${achievement.milestone.toLocaleString()} (now at ${achievement.current.toLocaleString()})\n\n`;
            }
            embed.addFields({ name: '🏆 Recently Achieved (Last 30 Days)', value: achievedText || 'None', inline: false });
        }

        // Add upcoming milestones section
        if ((type === 'upcoming' || type === 'all') && upcomingMilestones.length > 0) {
            let upcomingText = '';
            for (const milestone of upcomingMilestones.slice(0, 5)) {
                const progressBar = '█'.repeat(Math.floor(milestone.progress / 5)) + '░'.repeat(20 - Math.floor(milestone.progress / 5));

                upcomingText += `**${milestone.artist}** → ${milestone.emoji} ${milestone.platform}: ${milestone.target.toLocaleString()}\n`;
                upcomingText += `Current: ${milestone.current.toLocaleString()}/${milestone.target.toLocaleString()} (${milestone.progress.toFixed(1)}%)\n`;
                upcomingText += `${progressBar}\n`;
                upcomingText += `Need: ${milestone.needed.toLocaleString()} more`;

                if (milestone.eta !== 'Unknown') {
                    upcomingText += ` | ETA: ${milestone.eta}`;
                    if (milestone.confidence > 0) {
                        const confidenceBars = '█'.repeat(Math.floor(milestone.confidence / 10)) + '░'.repeat(10 - Math.floor(milestone.confidence / 10));
                        upcomingText += `\nConfidence: ${confidenceBars} ${milestone.confidence.toFixed(0)}%`;
                    }
                }

                // Add status emoji
                if (milestone.progress > 90) {
                    upcomingText += '\n🔥 **Almost there!**';
                } else if (milestone.progress > 75) {
                    upcomingText += '\n📈 **On track!**';
                } else if (milestone.progress > 50) {
                    upcomingText += '\n⏳ **Halfway there!**';
                }

                upcomingText += '\n\n';
            }

            embed.addFields({ name: '🎯 Upcoming Milestones', value: upcomingText || 'None in range', inline: false });
        }

        // Add motivational footer
        const nearestMilestone = upcomingMilestones.find(m => m.progress > 80);
        if (nearestMilestone) {
            embed.setFooter({
                text: `🔥 ${nearestMilestone.artist} is ${nearestMilestone.progress.toFixed(0)}% to ${nearestMilestone.target.toLocaleString()} ${nearestMilestone.platform}! Keep pushing!`
            });
        }

        await interaction.editReply({ embeds: [embed] });
    },
};