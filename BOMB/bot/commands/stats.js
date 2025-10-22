const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { loadLatestData } = require('../utils/dataLoader');
const { formatNumber } = require('../utils/analytics');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Show current Casa 24 Records analytics'),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const data = await loadLatestData();

      // Calculate collective totals
      let totalSpotifyFollowers = 0;
      let totalSpotifyListeners = 0;
      let totalYouTubeSubscribers = 0;
      let totalYouTubeViews = 0;
      let totalInstagramFollowers = 0;

      data.artists?.forEach(artist => {
        if (artist.spotify) {
          totalSpotifyFollowers += artist.spotify.followers || 0;
          const listeners = parseInt(artist.spotify.monthly_listeners) || 0;
          totalSpotifyListeners += listeners;
        }
        if (artist.youtube) {
          totalYouTubeSubscribers += artist.youtube.subscribers || 0;
          totalYouTubeViews += artist.youtube.total_views || 0;
        }
        if (artist.instagram) {
          totalInstagramFollowers += artist.instagram.followers || 0;
        }
      });

      const embed = new EmbedBuilder()
        .setColor(0x00a651) // Casa 24 green
        .setTitle('📊 Casa 24 Records - Live Stats')
        .setDescription(`Data as of ${data.date}`)
        .addFields(
          {
            name: '🎵 Spotify',
            value: `**${formatNumber(totalSpotifyFollowers)}** followers\n**${formatNumber(totalSpotifyListeners)}** monthly listeners`,
            inline: true
          },
          {
            name: '📺 YouTube',
            value: `**${formatNumber(totalYouTubeSubscribers)}** subscribers\n**${formatNumber(totalYouTubeViews)}** total views`,
            inline: true
          },
          {
            name: '📸 Instagram',
            value: `**${formatNumber(totalInstagramFollowers)}** followers\n**${data.artists?.length || 0}** artists tracked`,
            inline: true
          }
        );

      // Add Discord info if available
      if (data.discord) {
        embed.addFields({
          name: '💬 Discord',
          value: `**${formatNumber(data.discord.member_count)}** members\n**${formatNumber(data.discord.online_count)}** online now`,
          inline: true
        });
      }

      // Add warning if using fallback data
      if (data._fallback) {
        embed.addFields({
          name: '⚠️ Using Historical Data',
          value: `Latest data was corrupted. Using data from **${data._fallback.fallbackDate}** instead.\n*Fix the data collection script to prevent this issue.*`,
          inline: false
        });
      }

      // Add top artists
      const topArtists = data.artists
        ?.sort((a, b) => {
          const aListeners = parseInt(a.spotify?.monthly_listeners) || 0;
          const bListeners = parseInt(b.spotify?.monthly_listeners) || 0;
          return bListeners - aListeners;
        })
        .slice(0, 3)
        .map((artist, i) => {
          const listeners = parseInt(artist.spotify?.monthly_listeners) || 0;
          const medals = ['🥇', '🥈', '🥉'];
          return `${medals[i]} **${artist.name}** - ${formatNumber(listeners)} listeners`;
        })
        .join('\n');

      if (topArtists) {
        embed.addFields({
          name: '🔥 Top Artists (Monthly Listeners)',
          value: topArtists,
          inline: false
        });
      }

      embed.setFooter({
        text: 'Casa 24 Records - We Out Here'
      })
      .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in /stats command:', error);
      await interaction.editReply({
        content: '❌ Failed to load analytics data. Please try again later.',
        ephemeral: true
      });
    }
  },
};
