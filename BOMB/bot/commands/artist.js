const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { loadLatestData, getArtistByName, getAllArtistNames } = require('../utils/dataLoader');
const { formatNumber } = require('../utils/analytics');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('artist')
    .setDescription('Show detailed stats for a specific artist')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Artist name')
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async autocomplete(interaction) {
    try {
      const data = await loadLatestData();
      const focusedValue = interaction.options.getFocused().toLowerCase();
      const artistNames = getAllArtistNames(data);

      const filtered = artistNames
        .filter(name => name.toLowerCase().includes(focusedValue))
        .slice(0, 25);

      await interaction.respond(
        filtered.map(name => ({ name, value: name }))
      );
    } catch (error) {
      console.error('Autocomplete error:', error);
      await interaction.respond([]);
    }
  },

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const data = await loadLatestData();
      const artistName = interaction.options.getString('name');

      const artist = getArtistByName(data, artistName);

      if (!artist) {
        const artistList = getAllArtistNames(data);
        await interaction.editReply({
          content: `❌ Artist "${artistName}" not found.\n\nAvailable artists: ${artistList.join(', ')}`,
          ephemeral: true
        });
        return;
      }

      const embed = new EmbedBuilder()
        .setColor(0x00a651)
        .setTitle(`🎤 ${artist.name}`)
        .setDescription(`Detailed analytics for ${artist.name}`)
        .setTimestamp();

      // Spotify section
      if (artist.spotify) {
        let spotifyText = '';

        if (artist.spotify.followers) {
          spotifyText += `**Followers:** ${formatNumber(artist.spotify.followers)}\n`;
        }

        if (artist.spotify.monthly_listeners) {
          const listeners = parseInt(artist.spotify.monthly_listeners) || 0;
          spotifyText += `**Monthly Listeners:** ${formatNumber(listeners)}\n`;
        }

        if (artist.spotify.popularity_score !== undefined) {
          spotifyText += `**Popularity:** ${artist.spotify.popularity_score}/100\n`;
        }

        if (artist.spotify.genres && artist.spotify.genres.length > 0) {
          spotifyText += `**Genres:** ${artist.spotify.genres.join(', ')}\n`;
        }

        if (spotifyText) {
          embed.addFields({
            name: '🎵 Spotify',
            value: spotifyText.trim(),
            inline: false
          });
        }

        // Top tracks
        if (artist.spotify.top_tracks && artist.spotify.top_tracks.length > 0) {
          const topTracks = artist.spotify.top_tracks.slice(0, 5).map((track, i) => {
            return `${i + 1}. **${track.name}** (${track.popularity}/100)`;
          }).join('\n');

          embed.addFields({
            name: '🔥 Top Tracks',
            value: topTracks,
            inline: false
          });
        }
      }

      // YouTube section
      if (artist.youtube) {
        let youtubeText = '';

        if (artist.youtube.subscribers !== undefined) {
          youtubeText += `**Subscribers:** ${formatNumber(artist.youtube.subscribers)}\n`;
        }

        if (artist.youtube.total_views) {
          youtubeText += `**Total Views:** ${formatNumber(artist.youtube.total_views)}\n`;
        }

        if (artist.youtube.video_count) {
          youtubeText += `**Videos:** ${formatNumber(artist.youtube.video_count)}\n`;
        }

        if (youtubeText) {
          embed.addFields({
            name: '📺 YouTube',
            value: youtubeText.trim(),
            inline: true
          });
        }

        // Top videos
        if (artist.youtube.top_videos && artist.youtube.top_videos.length > 0) {
          const topVideos = artist.youtube.top_videos.slice(0, 3).map((video, i) => {
            return `${i + 1}. [${video.title}](https://youtube.com/watch?v=${video.video_id}) - ${formatNumber(video.views)} views`;
          }).join('\n');

          embed.addFields({
            name: '📹 Top Videos',
            value: topVideos,
            inline: false
          });
        }
      }

      // Instagram section
      if (artist.instagram && artist.instagram.followers) {
        let instagramText = '';

        instagramText += `**Followers:** ${formatNumber(artist.instagram.followers)}\n`;

        if (artist.instagram.media_count) {
          instagramText += `**Posts:** ${formatNumber(artist.instagram.media_count)}\n`;
        }

        if (artist.instagram.username) {
          instagramText += `**Username:** @${artist.instagram.username}\n`;
        }

        embed.addFields({
          name: '📸 Instagram',
          value: instagramText.trim(),
          inline: true
        });
      }

      embed.setFooter({
        text: `Casa 24 Records - Data as of ${data.date}`,
        iconURL: 'https://i.imgur.com/placeholder.png'
      });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in /artist command:', error);
      await interaction.editReply({
        content: '❌ Failed to load artist data. Please try again later.',
        ephemeral: true
      });
    }
  },
};
