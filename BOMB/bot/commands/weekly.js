const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { loadLatestData, loadHistoricalData } = require('../utils/dataLoader');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weekly')
        .setDescription('📊 Comprehensive weekly performance report with trends, predictions, and highlights')
        .addIntegerOption(option =>
            option.setName('week_offset')
                .setDescription('Which week to view (0 = current week, 1 = last week, etc.)')
                .setMinValue(0)
                .setMaxValue(4)),

    async execute(interaction) {
        await interaction.deferReply();

        const weekOffset = interaction.options.getInteger('week_offset') || 0;
        const daysToLoad = (weekOffset + 1) * 7 + 1;

        const data = await loadLatestData();
        const historicalData = await loadHistoricalData(daysToLoad);

        if (!data || !historicalData || historicalData.length < 8) {
            return interaction.editReply('❌ Not enough data for weekly analysis. Need at least 8 days of data.');
        }

        // Get start and end data for the week
        const weekStartIndex = weekOffset * 7;
        const weekEndIndex = weekStartIndex + 7;

        const currentWeekData = historicalData[weekStartIndex];
        const previousWeekData = historicalData[Math.min(weekEndIndex, historicalData.length - 1)];

        if (!currentWeekData || !previousWeekData) {
            return interaction.editReply('❌ Could not load data for the selected week.');
        }

        // Calculate week dates
        const weekEndDate = new Date(currentWeekData.date);
        const weekStartDate = new Date(previousWeekData.date);

        // Calculate label-wide statistics
        let totalStats = {
            spotify: { followers: 0, listeners: 0, prevFollowers: 0, prevListeners: 0 },
            youtube: { subscribers: 0, views: 0, prevSubscribers: 0, prevViews: 0 },
            instagram: { followers: 0, prevFollowers: 0 },
            discord: { members: 0, prevMembers: 0 }
        };

        let artistPerformance = [];
        let topContent = [];
        let achievements = [];

        // Process each artist
        for (const artist of currentWeekData.artists) {
            const prevArtist = previousWeekData.artists?.find(a => a.name === artist.name);

            if (!prevArtist) continue;

            // Accumulate totals
            totalStats.spotify.followers += artist.spotify?.followers || 0;
            totalStats.spotify.listeners += parseInt(artist.spotify?.monthly_listeners) || 0;
            totalStats.spotify.prevFollowers += prevArtist.spotify?.followers || 0;
            totalStats.spotify.prevListeners += parseInt(prevArtist.spotify?.monthly_listeners) || 0;

            totalStats.youtube.subscribers += artist.youtube?.subscribers || 0;
            totalStats.youtube.views += artist.youtube?.total_views || 0;
            totalStats.youtube.prevSubscribers += prevArtist.youtube?.subscribers || 0;
            totalStats.youtube.prevViews += prevArtist.youtube?.total_views || 0;

            totalStats.instagram.followers += artist.instagram?.followers || 0;
            totalStats.instagram.prevFollowers += prevArtist.instagram?.followers || 0;

            // Calculate artist performance
            const spotifyGrowth = ((artist.spotify?.followers || 0) - (prevArtist.spotify?.followers || 0));
            const listenersGrowth = (parseInt(artist.spotify?.monthly_listeners) || 0) - (parseInt(prevArtist.spotify?.monthly_listeners) || 0);
            const youtubeGrowth = ((artist.youtube?.subscribers || 0) - (prevArtist.youtube?.subscribers || 0));
            const instagramGrowth = ((artist.instagram?.followers || 0) - (prevArtist.instagram?.followers || 0));

            const totalGrowth = spotifyGrowth + youtubeGrowth + instagramGrowth;
            const growthPercent = prevArtist.spotify?.followers > 0
                ? ((spotifyGrowth / prevArtist.spotify.followers) * 100)
                : 0;

            artistPerformance.push({
                name: artist.name,
                totalGrowth: totalGrowth,
                spotifyGrowth: spotifyGrowth,
                listenersGrowth: listenersGrowth,
                youtubeGrowth: youtubeGrowth,
                instagramGrowth: instagramGrowth,
                growthPercent: growthPercent,
                rating: calculateRating(totalGrowth, growthPercent)
            });

            // Check for significant achievements
            if (growthPercent > 20) {
                achievements.push(`⚡ ${artist.name}: Lightning growth! +${growthPercent.toFixed(0)}% Spotify followers`);
            }
            if (listenersGrowth > 100) {
                achievements.push(`🔥 ${artist.name}: +${listenersGrowth} monthly listeners!`);
            }
            if (youtubeGrowth > 10) {
                achievements.push(`📺 ${artist.name}: Strong YouTube growth! +${youtubeGrowth} subscribers`);
            }

            // Track top content
            if (artist.youtube?.top_videos && artist.youtube.top_videos.length > 0) {
                const topVideo = artist.youtube.top_videos[0];
                if (topVideo.views > 100) {
                    topContent.push({
                        artist: artist.name,
                        type: 'video',
                        title: topVideo.title,
                        views: topVideo.views
                    });
                }
            }
        }

        // Add Discord stats
        totalStats.discord.members = currentWeekData.discord?.member_count || 0;
        totalStats.discord.prevMembers = previousWeekData.discord?.member_count || 0;

        // Sort artist performance
        artistPerformance.sort((a, b) => b.totalGrowth - a.totalGrowth);

        // Calculate week-over-week changes
        const spotifyFollowerChange = totalStats.spotify.followers - totalStats.spotify.prevFollowers;
        const spotifyListenerChange = totalStats.spotify.listeners - totalStats.spotify.prevListeners;
        const youtubeSubChange = totalStats.youtube.subscribers - totalStats.youtube.prevSubscribers;
        const youtubeViewChange = totalStats.youtube.views - totalStats.youtube.prevViews;
        const instagramChange = totalStats.instagram.followers - totalStats.instagram.prevFollowers;
        const discordChange = totalStats.discord.members - totalStats.discord.prevMembers;

        const totalGrowth = spotifyFollowerChange + youtubeSubChange + instagramChange;

        // Build embed
        const embed = new EmbedBuilder()
            .setTitle('📊 WEEKLY PERFORMANCE REPORT')
            .setDescription(`Week of ${weekStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`)
            .setColor(totalGrowth > 0 ? 0x00FF00 : 0xFFFF00)
            .setTimestamp();

        // Label overview
        let overviewText = '';
        overviewText += `**Total Growth This Week**\n`;
        overviewText += `├─ 🎵 Spotify: ${spotifyFollowerChange >= 0 ? '+' : ''}${spotifyFollowerChange} followers (${((spotifyFollowerChange / (totalStats.spotify.prevFollowers || 1)) * 100).toFixed(1)}%) ${spotifyFollowerChange > 0 ? '📈' : '📉'}\n`;
        overviewText += `├─ 🎧 Listeners: ${spotifyListenerChange >= 0 ? '+' : ''}${spotifyListenerChange.toLocaleString()} (${((spotifyListenerChange / (totalStats.spotify.prevListeners || 1)) * 100).toFixed(1)}%) ${spotifyListenerChange > 0 ? '📈' : '📉'}\n`;
        overviewText += `├─ 📺 YouTube: ${youtubeSubChange >= 0 ? '+' : ''}${youtubeSubChange} subs (${((youtubeSubChange / (totalStats.youtube.prevSubscribers || 1)) * 100).toFixed(1)}%) ${youtubeSubChange > 0 ? '📈' : '➡️'}\n`;
        overviewText += `├─ 👁️ Views: ${youtubeViewChange >= 0 ? '+' : ''}${youtubeViewChange.toLocaleString()} views\n`;
        overviewText += `├─ 📸 Instagram: ${instagramChange >= 0 ? '+' : ''}${instagramChange} followers (${((instagramChange / (totalStats.instagram.prevFollowers || 1)) * 100).toFixed(1)}%) ${instagramChange > 0 ? '📈' : '➡️'}\n`;
        overviewText += `└─ 💬 Discord: ${discordChange >= 0 ? '+' : ''}${discordChange} members\n\n`;

        // Week comparison
        if (weekOffset === 0) {
            overviewText += `**Week-over-Week**: ${totalGrowth > 0 ? '✅ Positive growth!' : '⚠️ Growth slowing'}`;
        }

        embed.addFields({ name: '🎯 LABEL OVERVIEW', value: overviewText, inline: false });

        // Artist highlights
        let artistText = '';
        for (let i = 0; i < Math.min(5, artistPerformance.length); i++) {
            const artist = artistPerformance[i];
            const stars = '⭐'.repeat(artist.rating);
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;

            artistText += `${medal} **${artist.name}** ${stars}\n`;

            if (artist.spotifyGrowth !== 0) {
                artistText += `├─ Spotify: ${artist.spotifyGrowth >= 0 ? '+' : ''}${artist.spotifyGrowth} followers`;
                if (artist.listenersGrowth !== 0) {
                    artistText += ` | ${artist.listenersGrowth >= 0 ? '+' : ''}${artist.listenersGrowth} listeners`;
                }
                artistText += '\n';
            }

            if (artist.youtubeGrowth !== 0) {
                artistText += `├─ YouTube: ${artist.youtubeGrowth >= 0 ? '+' : ''}${artist.youtubeGrowth} subs\n`;
            }

            if (artist.instagramGrowth !== 0) {
                artistText += `├─ Instagram: ${artist.instagramGrowth >= 0 ? '+' : ''}${artist.instagramGrowth} followers\n`;
            }

            if (artist.growthPercent > 10) {
                artistText += `└─ 🔥 ${artist.growthPercent.toFixed(0)}% growth!\n`;
            }

            artistText += '\n';
        }

        if (artistText) {
            embed.addFields({ name: '🌟 ARTIST HIGHLIGHTS', value: artistText, inline: false });
        }

        // Achievements
        if (achievements.length > 0) {
            embed.addFields({
                name: '🏆 WINS THIS WEEK',
                value: achievements.slice(0, 5).join('\n'),
                inline: false
            });
        }

        // Top content
        if (topContent.length > 0) {
            let contentText = '';
            topContent.slice(0, 3).forEach((content, i) => {
                contentText += `${i + 1}. 🔥 **${content.artist}** - "${content.title}"\n`;
                contentText += `   └─ ${content.views.toLocaleString()} views\n\n`;
            });
            embed.addFields({ name: '🎵 TOP CONTENT', value: contentText, inline: false });
        }

        // Velocity analysis
        const momentum = totalGrowth > 100 ? 'Accelerating' :
                        totalGrowth > 50 ? 'Steady' :
                        totalGrowth > 0 ? 'Stable' : 'Decelerating';

        embed.addFields({
            name: '📈 VELOCITY ANALYSIS',
            value: `**Momentum**: ${momentum} ${momentum === 'Accelerating' ? '🚀' : momentum === 'Steady' ? '➡️' : '📉'}\n` +
                   `**Best Platform**: ${spotifyFollowerChange > youtubeSubChange && spotifyFollowerChange > instagramChange ? 'Spotify' :
                                        youtubeSubChange > instagramChange ? 'YouTube' : 'Instagram'}\n` +
                   `**Artists Trending**: ${artistPerformance.filter(a => a.growthPercent > 5).length}/${artistPerformance.length}`,
            inline: false
        });

        // Action items
        let actionItems = '💡 **ACTION ITEMS**\n';
        if (artistPerformance[0]) {
            actionItems += `1. Support ${artistPerformance[0].name}'s momentum with promotion\n`;
        }
        if (artistPerformance.find(a => a.youtubeGrowth < 0)) {
            const needsYT = artistPerformance.find(a => a.youtubeGrowth < 0);
            actionItems += `2. ${needsYT.name} needs YouTube content boost\n`;
        }
        if (spotifyListenerChange < 100) {
            actionItems += `3. Focus on Spotify playlist placements for listener growth\n`;
        }
        actionItems += `4. Maintain consistent release schedule across all artists`;

        embed.addFields({ name: 'Next Steps', value: actionItems, inline: false });

        // Footer with overall performance
        const weekRating = totalGrowth > 500 ? 'EXCELLENT' :
                          totalGrowth > 200 ? 'GREAT' :
                          totalGrowth > 100 ? 'GOOD' :
                          totalGrowth > 0 ? 'AVERAGE' : 'NEEDS IMPROVEMENT';

        embed.setFooter({
            text: `Week Performance: ${weekRating} | Total Growth: +${totalGrowth} followers | Next Report: Monday 10 AM`
        });

        await interaction.editReply({ embeds: [embed] });
    },
};

function calculateRating(totalGrowth, growthPercent) {
    let rating = 0;

    if (totalGrowth > 100) rating += 2;
    else if (totalGrowth > 50) rating += 1.5;
    else if (totalGrowth > 20) rating += 1;
    else if (totalGrowth > 0) rating += 0.5;

    if (growthPercent > 20) rating += 2;
    else if (growthPercent > 10) rating += 1.5;
    else if (growthPercent > 5) rating += 1;
    else if (growthPercent > 0) rating += 0.5;

    return Math.min(5, Math.ceil(rating));
}