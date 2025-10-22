const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { loadLatestData, loadHistoricalData } = require('../utils/dataLoader');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spotlight')
        .setDescription('✨ Random artist showcase with fun presentation and call-to-action'),

    async execute(interaction) {
        await interaction.deferReply();

        const data = await loadLatestData();
        const historicalData = await loadHistoricalData(7);

        if (!data || !data.artists) {
            return interaction.editReply('❌ Error loading artist data.');
        }

        // Weight random selection by recent growth
        const artistWeights = [];

        for (const artist of data.artists) {
            let weight = 10; // Base weight

            if (historicalData && historicalData.length > 1) {
                const oldData = historicalData[historicalData.length - 1];
                const oldArtist = oldData.artists?.find(a => a.name === artist.name);

                if (oldArtist) {
                    // Calculate 7-day growth
                    const currentFollowers = (artist.spotify?.followers || 0) +
                                           (artist.youtube?.subscribers || 0) +
                                           (artist.instagram?.followers || 0);
                    const oldFollowers = (oldArtist.spotify?.followers || 0) +
                                        (oldArtist.youtube?.subscribers || 0) +
                                        (oldArtist.instagram?.followers || 0);

                    if (oldFollowers > 0) {
                        const growthRate = ((currentFollowers - oldFollowers) / oldFollowers * 100);
                        // Artists with positive growth get higher weight
                        if (growthRate > 10) weight += 30;
                        else if (growthRate > 5) weight += 20;
                        else if (growthRate > 0) weight += 10;
                    }
                }
            }

            // Add artist with weight
            for (let i = 0; i < weight; i++) {
                artistWeights.push(artist);
            }
        }

        // Select random artist (weighted)
        const featured = artistWeights[Math.floor(Math.random() * artistWeights.length)];

        if (!featured) {
            return interaction.editReply('❌ Could not select an artist.');
        }

        // Calculate growth metrics
        let growthText = '';
        let growthEmoji = '';

        if (historicalData && historicalData.length > 1) {
            const oldData = historicalData[historicalData.length - 1];
            const oldArtist = oldData.artists?.find(a => a.name === featured.name);

            if (oldArtist) {
                const spotifyGrowth = ((featured.spotify?.followers || 0) - (oldArtist.spotify?.followers || 0));
                const listenersGrowth = (parseInt(featured.spotify?.monthly_listeners) || 0) - (parseInt(oldArtist.spotify?.monthly_listeners) || 0);

                if (spotifyGrowth > 0 || listenersGrowth > 0) {
                    growthEmoji = '🔥';
                    if (spotifyGrowth > 0) {
                        const growthPercent = oldArtist.spotify?.followers > 0
                            ? ((spotifyGrowth / oldArtist.spotify.followers) * 100).toFixed(0)
                            : 'New';
                        growthText = `+${growthPercent}% growth this week!`;
                    } else if (listenersGrowth > 0) {
                        growthText = `+${listenersGrowth} new listeners this week!`;
                    }
                } else {
                    growthEmoji = '➡️';
                    growthText = 'Steady performance';
                }
            }
        }

        // Get artist tagline based on their stats
        const tagline = getArtistTagline(featured);

        // Build statistics text
        let statsText = '';

        if (featured.spotify?.followers || featured.spotify?.monthly_listeners) {
            statsText += '**🎵 Spotify**\n';
            if (featured.spotify.followers) {
                statsText += `${featured.spotify.followers.toLocaleString()} followers\n`;
            }
            if (featured.spotify.monthly_listeners && featured.spotify.monthly_listeners !== 'N/A') {
                statsText += `${featured.spotify.monthly_listeners} monthly listeners\n`;
            }
            statsText += '\n';
        }

        if (featured.youtube?.subscribers) {
            statsText += '**📺 YouTube**\n';
            statsText += `${featured.youtube.subscribers.toLocaleString()} subscribers\n`;
            if (featured.youtube.total_views) {
                statsText += `${featured.youtube.total_views.toLocaleString()} total views\n`;
            }
            statsText += '\n';
        }

        if (featured.instagram?.followers) {
            statsText += '**📸 Instagram**\n';
            statsText += `${featured.instagram.followers.toLocaleString()} followers\n`;
            if (featured.instagram.media_count) {
                statsText += `${featured.instagram.media_count} posts\n`;
            }
            statsText += '\n';
        }

        // Get top tracks
        let topTracksText = '';
        if (featured.spotify?.top_tracks && featured.spotify.top_tracks.length > 0) {
            const topTracks = featured.spotify.top_tracks.slice(0, 3);
            topTracksText = topTracks.map((track, i) =>
                `${i + 1}. ${track.name} (Popularity: ${track.popularity}/100)`
            ).join('\n');
        }

        // Get top videos
        let topVideosText = '';
        if (featured.youtube?.top_videos && featured.youtube.top_videos.length > 0) {
            const topVideo = featured.youtube.top_videos[0];
            topVideosText = `"${topVideo.title}" - ${topVideo.views.toLocaleString()} views`;
        }

        // Create embed
        const embed = new EmbedBuilder()
            .setTitle('✨ ARTIST SPOTLIGHT ✨')
            .setDescription(`Today's featured artist is...\n\n# 🎤 ${featured.name} 🎤\n\n*"${tagline}"*`)
            .setColor(Math.floor(Math.random() * 16777215)) // Random color
            .addFields(
                {
                    name: `${growthEmoji} Rising Star Alert`,
                    value: growthText || 'Keep an eye on this artist!',
                    inline: false
                }
            );

        if (statsText) {
            embed.addFields({
                name: '📊 Quick Stats',
                value: statsText,
                inline: true
            });
        }

        if (topTracksText) {
            embed.addFields({
                name: '🎵 Top Tracks',
                value: topTracksText,
                inline: true
            });
        }

        if (topVideosText) {
            embed.addFields({
                name: '📺 Latest Hit Video',
                value: topVideosText,
                inline: false
            });
        }

        // Add engagement section
        let supportText = '💡 **Support ' + featured.name + ':**\n';

        if (featured.spotify?.followers) {
            supportText += '🎵 Stream on Spotify\n';
        }
        if (featured.youtube?.subscribers !== undefined && featured.youtube.subscribers >= 0) {
            supportText += '📺 Subscribe on YouTube\n';
        }
        if (featured.instagram?.username) {
            supportText += `📸 Follow @${featured.instagram.username} on Instagram\n`;
        }

        embed.addFields({
            name: 'How to Support',
            value: supportText + '\nReact with 🔥 if you\'re already a fan!\nReact with 👀 if you\'ll check them out!',
            inline: false
        });

        embed.setTimestamp()
            .setFooter({ text: 'Spotlight changes hourly • Use /artist for detailed stats' });

        // Create action buttons (optional - if you want to add links)
        const buttons = new ActionRowBuilder();

        // Add Spotify button if available
        if (featured.spotify?.followers) {
            buttons.addComponents(
                new ButtonBuilder()
                    .setLabel('Listen on Spotify')
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://open.spotify.com/artist/${getSpotifyId(featured.name)}`)
                    .setEmoji('🎵')
            );
        }

        // Add Instagram button if available
        if (featured.instagram?.username) {
            buttons.addComponents(
                new ButtonBuilder()
                    .setLabel('Follow on Instagram')
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://instagram.com/${featured.instagram.username}`)
                    .setEmoji('📸')
            );
        }

        // Send message with reactions
        const message = await interaction.editReply({
            embeds: [embed]
            // components: buttons.components.length > 0 ? [buttons] : [] // Add buttons if available
        });

        // Add reactions for engagement
        try {
            await message.react('🔥');
            await message.react('👀');
        } catch (error) {
            console.error('Error adding reactions:', error);
        }
    },
};

function getArtistTagline(artist) {
    const taglines = [
        'The Rising Star',
        'The Creative Force',
        'The Sonic Innovator',
        'The Rhythm Master',
        'The Melody Maker',
        'The Beat Architect',
        'The Sound Sculptor',
        'The Musical Visionary'
    ];

    // Choose tagline based on artist stats
    const listeners = parseInt(artist.spotify?.monthly_listeners) || 0;
    const followers = artist.spotify?.followers || 0;
    const youtubeViews = artist.youtube?.total_views || 0;

    if (listeners > 500) return 'The Chart Climber';
    if (followers > 300) return 'The Fan Favorite';
    if (youtubeViews > 10000) return 'The Visual Storyteller';
    if (artist.instagram?.followers > 1000) return 'The Social Media Star';

    // Return random tagline
    return taglines[Math.floor(Math.random() * taglines.length)];
}

/**
 * Load artist data from JSON file
 * @returns {Object} Artist data with Spotify IDs
 */
function loadArtistData() {
    try {
        // Try multiple possible paths for the artist data file
        const possiblePaths = [
            path.join(__dirname, '../../data/artist-data.json'),
            path.join(__dirname, '../data/artist-data.json'),
            path.join(process.cwd(), 'data/artist-data.json'),
            path.join(process.cwd(), 'BOMB/data/artist-data.json')
        ];

        for (const filePath of possiblePaths) {
            if (fs.existsSync(filePath)) {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                return JSON.parse(fileContent);
            }
        }

        console.warn('Artist data file not found, using fallback empty data');
        return { artists: [] };
    } catch (error) {
        console.error('Error loading artist data:', error);
        return { artists: [] };
    }
}

/**
 * Get Spotify ID for an artist by name
 * @param {string} artistName - Name of the artist
 * @returns {string} Spotify artist ID or empty string
 */
function getSpotifyId(artistName) {
    const artistData = loadArtistData();
    const artist = artistData.artists.find(a => a.name === artistName);
    return artist?.spotifyId || '';
}