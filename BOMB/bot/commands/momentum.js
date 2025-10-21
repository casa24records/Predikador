const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { loadLatestData, loadHistoricalData } = require('../utils/dataLoader');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('momentum')
        .setDescription('🎯 Detect growth momentum and acceleration patterns to identify breakout moments')
        .addStringOption(option =>
            option.setName('artist')
                .setDescription('Specific artist to analyze (default: all artists)')
                .setAutocomplete(true))
        .addIntegerOption(option =>
            option.setName('period')
                .setDescription('Analysis period in days')
                .addChoices(
                    { name: '7 days', value: 7 },
                    { name: '14 days', value: 14 },
                    { name: '30 days', value: 30 },
                    { name: '60 days', value: 60 }
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
        const period = interaction.options.getInteger('period') || 30;

        const data = await loadLatestData();
        const historicalData = await loadHistoricalData(period);

        if (!data || !historicalData || historicalData.length < 3) {
            return interaction.editReply('❌ Not enough historical data for momentum analysis. Need at least 3 days of data.');
        }

        // Analyze momentum for selected artist or all
        const artists = artistName && artistName !== 'All Artists'
            ? data.artists.filter(a => a.name === artistName)
            : data.artists;

        if (artists.length === 0) {
            return interaction.editReply('❌ Artist not found.');
        }

        let momentumReports = [];

        for (const artist of artists) {
            const momentum = analyzeArtistMomentum(artist, historicalData);
            if (momentum) {
                momentumReports.push(momentum);
            }
        }

        // Sort by momentum score
        momentumReports.sort((a, b) => b.score - a.score);

        // Build embed
        const embed = new EmbedBuilder()
            .setTitle(`🎯 MOMENTUM ANALYSIS`)
            .setDescription(`${artistName && artistName !== 'All Artists' ? artistName : 'All Artists'} - Last ${period} Days`)
            .setColor(momentumReports[0]?.score > 70 ? 0x00FF00 : momentumReports[0]?.score > 40 ? 0xFFFF00 : 0xFF0000)
            .setTimestamp();

        for (const report of momentumReports.slice(0, 5)) { // Top 5 artists
            const velocityEmojis = {
                accelerating: '🔥 ACCELERATING',
                steady: '➡️ STEADY',
                decelerating: '📉 DECELERATING',
                volatile: '⚡ VOLATILE'
            };

            let fieldValue = `**Momentum Score:** ${report.score}/100 ${getScoreEmoji(report.score)}\n\n`;

            // Platform velocities
            if (report.spotify.current !== null) {
                fieldValue += `**Spotify Monthly Listeners**\n`;
                fieldValue += `Current: ${report.spotify.current.toLocaleString()} (${report.spotify.percentChange > 0 ? '+' : ''}${report.spotify.percentChange.toFixed(1)}%)\n`;
                fieldValue += `Velocity: ${velocityEmojis[report.spotify.velocity]}\n\n`;
            }

            if (report.youtube.current !== null) {
                fieldValue += `**YouTube Subscribers**\n`;
                fieldValue += `Current: ${report.youtube.current.toLocaleString()} (${report.youtube.percentChange > 0 ? '+' : ''}${report.youtube.percentChange.toFixed(1)}%)\n`;
                fieldValue += `Velocity: ${velocityEmojis[report.youtube.velocity]}\n\n`;
            }

            if (report.instagram.current !== null) {
                fieldValue += `**Instagram Followers**\n`;
                fieldValue += `Current: ${report.instagram.current.toLocaleString()} (${report.instagram.percentChange > 0 ? '+' : ''}${report.instagram.percentChange.toFixed(1)}%)\n`;
                fieldValue += `Velocity: ${velocityEmojis[report.instagram.velocity]}\n\n`;
            }

            if (report.breakouts.length > 0) {
                fieldValue += `**🚀 Breakout Detected!**\n`;
                fieldValue += report.breakouts.join('\n') + '\n\n';
            }

            fieldValue += `💡 ${report.recommendation}`;

            embed.addFields({
                name: `${report.artistName}`,
                value: fieldValue,
                inline: false
            });
        }

        await interaction.editReply({ embeds: [embed] });
    },
};

function analyzeArtistMomentum(artist, historicalData) {
    const result = {
        artistName: artist.name,
        score: 0,
        spotify: { current: null, percentChange: 0, velocity: 'steady' },
        youtube: { current: null, percentChange: 0, velocity: 'steady' },
        instagram: { current: null, percentChange: 0, velocity: 'steady' },
        breakouts: [],
        recommendation: ''
    };

    // Get data points
    const currentData = historicalData[0];
    const midData = historicalData[Math.floor(historicalData.length / 2)];
    const oldData = historicalData[historicalData.length - 1];

    const currentArtist = currentData.artists?.find(a => a.name === artist.name);
    const midArtist = midData.artists?.find(a => a.name === artist.name);
    const oldArtist = oldData.artists?.find(a => a.name === artist.name);

    if (!currentArtist || !oldArtist) return null;

    // Analyze Spotify momentum
    const spotifyListeners = parseInt(currentArtist.spotify?.monthly_listeners) || 0;
    const spotifyListenersOld = parseInt(oldArtist.spotify?.monthly_listeners) || 0;
    const spotifyListenersMid = parseInt(midArtist?.spotify?.monthly_listeners) || 0;

    if (spotifyListeners > 0 && spotifyListenersOld > 0) {
        result.spotify.current = spotifyListeners;
        result.spotify.percentChange = ((spotifyListeners - spotifyListenersOld) / spotifyListenersOld * 100);

        // Calculate velocity (acceleration)
        const firstHalfGrowth = spotifyListenersMid > 0 ? ((spotifyListenersMid - spotifyListenersOld) / spotifyListenersOld * 100) : 0;
        const secondHalfGrowth = spotifyListenersMid > 0 ? ((spotifyListeners - spotifyListenersMid) / spotifyListenersMid * 100) : 0;

        if (secondHalfGrowth > firstHalfGrowth * 1.5) {
            result.spotify.velocity = 'accelerating';
            result.score += 30;
        } else if (secondHalfGrowth < firstHalfGrowth * 0.5) {
            result.spotify.velocity = 'decelerating';
            result.score += 10;
        } else if (Math.abs(secondHalfGrowth - firstHalfGrowth) < 2) {
            result.spotify.velocity = 'steady';
            result.score += 20;
        } else {
            result.spotify.velocity = 'volatile';
            result.score += 15;
        }

        // Check for breakouts (>3x normal growth)
        if (result.spotify.percentChange > 50) {
            result.breakouts.push(`Spotify listeners +${result.spotify.percentChange.toFixed(0)}% (3x normal growth!)`);
            result.score += 20;
        }
    }

    // Analyze YouTube momentum
    const youtubeSubs = currentArtist.youtube?.subscribers || 0;
    const youtubeSubsOld = oldArtist.youtube?.subscribers || 0;
    const youtubeSubsMid = midArtist?.youtube?.subscribers || 0;

    if (youtubeSubs > 0 && youtubeSubsOld > 0) {
        result.youtube.current = youtubeSubs;
        result.youtube.percentChange = ((youtubeSubs - youtubeSubsOld) / youtubeSubsOld * 100);

        const firstHalfGrowth = youtubeSubsMid > 0 ? ((youtubeSubsMid - youtubeSubsOld) / youtubeSubsOld * 100) : 0;
        const secondHalfGrowth = youtubeSubsMid > 0 ? ((youtubeSubs - youtubeSubsMid) / youtubeSubsMid * 100) : 0;

        if (secondHalfGrowth > firstHalfGrowth * 1.5) {
            result.youtube.velocity = 'accelerating';
            result.score += 20;
        } else if (secondHalfGrowth < firstHalfGrowth * 0.5) {
            result.youtube.velocity = 'decelerating';
            result.score += 5;
        } else {
            result.youtube.velocity = 'steady';
            result.score += 10;
        }
    }

    // Analyze Instagram momentum
    const instagramFollowers = currentArtist.instagram?.followers || 0;
    const instagramFollowersOld = oldArtist.instagram?.followers || 0;
    const instagramFollowersMid = midArtist?.instagram?.followers || 0;

    if (instagramFollowers > 0 && instagramFollowersOld > 0) {
        result.instagram.current = instagramFollowers;
        result.instagram.percentChange = ((instagramFollowers - instagramFollowersOld) / instagramFollowersOld * 100);

        const firstHalfGrowth = instagramFollowersMid > 0 ? ((instagramFollowersMid - instagramFollowersOld) / instagramFollowersOld * 100) : 0;
        const secondHalfGrowth = instagramFollowersMid > 0 ? ((instagramFollowers - instagramFollowersMid) / instagramFollowersMid * 100) : 0;

        if (secondHalfGrowth > firstHalfGrowth * 1.5) {
            result.instagram.velocity = 'accelerating';
            result.score += 20;
        } else if (secondHalfGrowth < firstHalfGrowth * 0.5) {
            result.instagram.velocity = 'decelerating';
            result.score += 5;
        } else {
            result.instagram.velocity = 'steady';
            result.score += 10;
        }
    }

    // Cap score at 100
    result.score = Math.min(100, result.score);

    // Generate recommendation
    if (result.score >= 70) {
        result.recommendation = 'Capitalize on current momentum with consistent content releases!';
    } else if (result.score >= 40) {
        result.recommendation = 'Maintain consistency and consider strategic promotion.';
    } else {
        result.recommendation = 'Focus on re-engaging audience with fresh content.';
    }

    return result;
}

function getScoreEmoji(score) {
    if (score >= 80) return '🔥🔥🔥';
    if (score >= 60) return '🔥🔥';
    if (score >= 40) return '🔥';
    if (score >= 20) return '📊';
    return '💤';
}