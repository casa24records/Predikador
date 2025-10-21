const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { loadLatestData, loadHistoricalData } = require('../utils/dataLoader');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('viral')
        .setDescription('🔥 Detect and track viral content moments with real-time alerts')
        .addStringOption(option =>
            option.setName('timeframe')
                .setDescription('Time period to analyze')
                .addChoices(
                    { name: 'Last 24 hours', value: '24h' },
                    { name: 'Last 7 days', value: '7d' },
                    { name: 'Last 30 days', value: '30d' },
                    { name: 'All time', value: 'all' }
                )),

    async execute(interaction) {
        await interaction.deferReply();

        const timeframe = interaction.options.getString('timeframe') || '7d';

        // Load data based on timeframe
        let days = 7;
        if (timeframe === '24h') days = 1;
        else if (timeframe === '7d') days = 7;
        else if (timeframe === '30d') days = 30;
        else if (timeframe === 'all') days = 168; // All available data

        const data = await loadLatestData();
        const historicalData = await loadHistoricalData(days);

        if (!data || !historicalData || historicalData.length < 2) {
            return interaction.editReply('❌ Not enough data to detect viral moments.');
        }

        // Detect viral moments
        const viralMoments = [];
        const cooldowns = [];
        const watchList = [];

        for (const artist of data.artists) {
            const viralData = detectViralContent(artist, historicalData);

            if (viralData.viral.length > 0) {
                viralMoments.push(...viralData.viral);
            }
            if (viralData.cooling.length > 0) {
                cooldowns.push(...viralData.cooling);
            }
            if (viralData.watch.length > 0) {
                watchList.push(...viralData.watch);
            }
        }

        // Sort by virality score
        viralMoments.sort((a, b) => b.score - a.score);
        cooldowns.sort((a, b) => b.peakVelocity - a.peakVelocity);

        // Build embed
        const embed = new EmbedBuilder()
            .setTitle('🔥 VIRAL CONTENT TRACKER')
            .setDescription(`Analysis for ${timeframe === '24h' ? 'Last 24 Hours' : timeframe === '7d' ? 'Last 7 Days' : timeframe === '30d' ? 'Last 30 Days' : 'All Time'}`)
            .setColor(viralMoments.length > 0 ? 0xFF0000 : 0xFFFF00)
            .setTimestamp();

        // Add active viral moments
        if (viralMoments.length > 0) {
            let viralText = '';
            for (const moment of viralMoments.slice(0, 3)) {
                const fireEmojis = moment.score > 80 ? '🔥🔥🔥' : moment.score > 60 ? '🔥🔥' : '🔥';

                viralText += `**${moment.artist}** - ${moment.platform}\n`;
                viralText += `${fireEmojis} Virality Score: ${moment.score}/100\n`;

                if (moment.metric === 'Monthly Listeners') {
                    viralText += `📈 ${moment.currentValue.toLocaleString()} listeners (${moment.growthRate > 0 ? '+' : ''}${moment.growthRate.toFixed(0)}% in ${days} days)\n`;
                    viralText += `⚡ Velocity: ${moment.velocity.toFixed(1)} listeners/day\n`;
                } else if (moment.metric === 'YouTube Views') {
                    viralText += `👁️ ${moment.growth.toLocaleString()} new views in ${days} days\n`;
                    viralText += `⚡ Velocity: ${moment.velocity.toFixed(0)} views/day\n`;
                } else {
                    viralText += `📈 ${moment.currentValue.toLocaleString()} ${moment.metric.toLowerCase()} (${moment.growthRate > 0 ? '+' : ''}${moment.growthRate.toFixed(0)}%)\n`;
                    viralText += `⚡ Velocity: ${moment.velocity.toFixed(1)}/day\n`;
                }

                viralText += `🎯 ${moment.multiplier.toFixed(1)}x normal growth rate\n`;

                if (moment.trigger) {
                    viralText += `💡 Trigger: ${moment.trigger}\n`;
                }

                viralText += '\n';
            }
            embed.addFields({ name: '🚨 ACTIVE VIRAL MOMENTS', value: viralText, inline: false });
        }

        // Add cooling down section
        if (cooldowns.length > 0) {
            let cooldownText = '';
            for (const cooldown of cooldowns.slice(0, 2)) {
                cooldownText += `**${cooldown.artist}** - ${cooldown.platform} ${cooldown.metric}\n`;
                cooldownText += `📉 Peak: ${cooldown.peakVelocity.toFixed(0)}/day → Current: ${cooldown.currentVelocity.toFixed(0)}/day\n`;
                cooldownText += `Total gained: ${cooldown.totalGained.toLocaleString()}\n\n`;
            }
            embed.addFields({ name: '💤 COOLING DOWN', value: cooldownText, inline: false });
        }

        // Add watch list
        if (watchList.length > 0) {
            let watchText = '';
            for (const watch of watchList.slice(0, 3)) {
                watchText += `**${watch.artist}** - ${watch.platform} ${watch.metric}\n`;
                watchText += `📊 ${watch.currentValue.toLocaleString()} (${watch.growthRate > 0 ? '+' : ''}${watch.growthRate.toFixed(1)}%)\n`;
                watchText += `⚡ ${watch.multiplier.toFixed(1)}x average velocity\n`;
                watchText += `Status: ${watch.status}\n\n`;
            }
            embed.addFields({ name: '👀 VIRAL WATCH', value: watchText, inline: false });
        }

        // Add insights
        let insights = '💡 **Tip:** Content typically goes viral in the first 72 hours. ';
        if (viralMoments.length > 0) {
            insights += 'Keep promoting the viral content across all platforms!';
        } else if (watchList.length > 0) {
            insights += 'Some content is showing potential - boost it with cross-promotion!';
        } else {
            insights += 'No viral activity detected. Consider releasing new content or running promotions.';
        }

        embed.addFields({ name: 'Insights', value: insights, inline: false });

        // Add momentum indicator
        const totalViralScore = viralMoments.reduce((sum, m) => sum + m.score, 0);
        const momentumLevel = totalViralScore > 200 ? '🔥 EXPLOSIVE' : totalViralScore > 100 ? '📈 HOT' : totalViralScore > 50 ? '⚡ WARMING' : '💤 QUIET';

        embed.setFooter({
            text: `Collective Momentum: ${momentumLevel} | ${viralMoments.length} viral moments detected`
        });

        await interaction.editReply({ embeds: [embed] });
    },
};

function detectViralContent(artist, historicalData) {
    const result = {
        viral: [],
        cooling: [],
        watch: []
    };

    const current = historicalData[0].artists?.find(a => a.name === artist.name);
    const previous = historicalData[Math.min(7, historicalData.length - 1)].artists?.find(a => a.name === artist.name);
    const oldest = historicalData[historicalData.length - 1].artists?.find(a => a.name === artist.name);

    if (!current || !oldest) return result;

    // Calculate average growth rates from historical data
    let avgGrowthRates = {
        spotifyListeners: 0,
        spotifyFollowers: 0,
        youtubeSubs: 0,
        youtubeViews: 0,
        instagram: 0
    };

    // Calculate baseline averages
    for (let i = 1; i < Math.min(historicalData.length, 30); i++) {
        const dayData = historicalData[i].artists?.find(a => a.name === artist.name);
        const prevDayData = historicalData[i - 1].artists?.find(a => a.name === artist.name);

        if (dayData && prevDayData) {
            const spotifyListeners = parseInt(dayData.spotify?.monthly_listeners) || 0;
            const prevSpotifyListeners = parseInt(prevDayData.spotify?.monthly_listeners) || 0;
            if (prevSpotifyListeners > 0) {
                avgGrowthRates.spotifyListeners += (spotifyListeners - prevSpotifyListeners) / prevSpotifyListeners;
            }
        }
    }

    // Normalize averages
    const dataPoints = Math.min(historicalData.length - 1, 29);
    if (dataPoints > 0) {
        Object.keys(avgGrowthRates).forEach(key => {
            avgGrowthRates[key] = avgGrowthRates[key] / dataPoints * 100;
        });
    }

    // Check Spotify monthly listeners
    const listeners = parseInt(current.spotify?.monthly_listeners) || 0;
    const oldListeners = parseInt(oldest.spotify?.monthly_listeners) || 0;

    if (listeners > 0 && oldListeners > 0) {
        const growth = listeners - oldListeners;
        const growthRate = (growth / oldListeners) * 100;
        const dailyVelocity = growth / historicalData.length;
        const avgDailyGrowth = (avgGrowthRates.spotifyListeners / 100 * oldListeners) / 30;
        const multiplier = avgDailyGrowth > 0 ? dailyVelocity / avgDailyGrowth : 1;

        if (multiplier > 3 && growthRate > 20) {
            // Viral!
            const score = Math.min(100, multiplier * 10 + growthRate);
            result.viral.push({
                artist: artist.name,
                platform: '🎵 Spotify',
                metric: 'Monthly Listeners',
                currentValue: listeners,
                growth: growth,
                growthRate: growthRate,
                velocity: dailyVelocity,
                multiplier: multiplier,
                score: Math.round(score),
                trigger: growthRate > 100 ? 'Possible playlist placement or viral track' : 'Organic growth acceleration'
            });
        } else if (multiplier > 2 && growthRate > 10) {
            // Watch list
            result.watch.push({
                artist: artist.name,
                platform: '🎵 Spotify',
                metric: 'Monthly Listeners',
                currentValue: listeners,
                growthRate: growthRate,
                multiplier: multiplier,
                status: '🔍 Monitoring for viral potential'
            });
        }
    }

    // Check YouTube views
    const views = current.youtube?.total_views || 0;
    const oldViews = oldest.youtube?.total_views || 0;

    if (views > oldViews && oldViews > 0) {
        const growth = views - oldViews;
        const growthRate = (growth / oldViews) * 100;
        const dailyVelocity = growth / historicalData.length;

        // Check if there's been a significant spike recently
        if (previous) {
            const prevViews = previous.youtube?.total_views || 0;
            const recentGrowth = views - prevViews;
            const recentVelocity = recentGrowth / Math.min(7, historicalData.length);

            if (recentVelocity > dailyVelocity * 2 && recentGrowth > 100) {
                // Recent acceleration detected
                const score = Math.min(100, (recentVelocity / dailyVelocity) * 20 + growthRate);
                result.viral.push({
                    artist: artist.name,
                    platform: '📺 YouTube',
                    metric: 'Views',
                    currentValue: views,
                    growth: recentGrowth,
                    growthRate: (recentGrowth / prevViews * 100),
                    velocity: recentVelocity,
                    multiplier: recentVelocity / (dailyVelocity || 1),
                    score: Math.round(score),
                    trigger: 'Recent video gaining traction'
                });
            }
        }
    }

    // Check Instagram
    const instagram = current.instagram?.followers || 0;
    const oldInstagram = oldest.instagram?.followers || 0;

    if (instagram > 0 && oldInstagram > 0) {
        const growth = instagram - oldInstagram;
        const growthRate = (growth / oldInstagram) * 100;
        const dailyVelocity = growth / historicalData.length;

        if (growthRate > 30 && growth > 50) {
            const score = Math.min(100, growthRate + (growth / 10));
            result.viral.push({
                artist: artist.name,
                platform: '📸 Instagram',
                metric: 'Followers',
                currentValue: instagram,
                growth: growth,
                growthRate: growthRate,
                velocity: dailyVelocity,
                multiplier: 3, // Estimate
                score: Math.round(score),
                trigger: growthRate > 50 ? 'Possible viral post or feature' : 'Strong organic growth'
            });
        }
    }

    // Check for cooling down content (was viral but slowing)
    if (previous) {
        const prevListeners = parseInt(previous.spotify?.monthly_listeners) || 0;
        const veryOldListeners = parseInt(oldest.spotify?.monthly_listeners) || 0;

        if (prevListeners > veryOldListeners) {
            const oldVelocity = (prevListeners - veryOldListeners) / (historicalData.length - 7);
            const currentVelocity = (listeners - prevListeners) / 7;

            if (oldVelocity > 0 && currentVelocity < oldVelocity * 0.5 && oldVelocity > 10) {
                result.cooling.push({
                    artist: artist.name,
                    platform: '🎵 Spotify',
                    metric: 'Monthly Listeners',
                    peakVelocity: oldVelocity,
                    currentVelocity: currentVelocity,
                    totalGained: listeners - veryOldListeners
                });
            }
        }
    }

    return result;
}