const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { loadLatestData, loadHistoricalData } = require('../utils/dataLoader');
const { calculatePlatformGrowth, formatNumber, formatPercent } = require('../utils/analytics');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('growth')
    .setDescription('Show growth trends for Casa 24 Records')
    .addStringOption(option =>
      option.setName('period')
        .setDescription('Time period to analyze')
        .setRequired(false)
        .addChoices(
          { name: '7 days', value: '7' },
          { name: '14 days', value: '14' },
          { name: '30 days', value: '30' },
          { name: '60 days', value: '60' },
          { name: '90 days', value: '90' }
        )
    ),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const period = parseInt(interaction.options.getString('period') || '30');
      const latestData = await loadLatestData();
      const historicalData = await loadHistoricalData(period);

      if (historicalData.length < 2) {
        await interaction.editReply({
          content: '❌ Not enough historical data available. Need at least 2 days of data.',
          ephemeral: true
        });
        return;
      }

      const embed = new EmbedBuilder()
        .setColor(0x00a651)
        .setTitle('📈 Casa 24 Records - Growth Analysis')
        .setDescription(`Analyzing ${historicalData.length} days of data (${period}-day period)`)
        .setTimestamp();

      // Add warning if using fallback data
      if (latestData._fallback) {
        embed.addFields({
          name: '⚠️ Using Historical Data',
          value: `Latest data was corrupted. Using data from **${latestData._fallback.fallbackDate}** instead.\n*Fix the data collection script to prevent this issue.*`,
          inline: false
        });
      }

      // Analyze growth for Casa 24 (main collective)
      const casa24Artist = latestData.artists?.find(a => a.name === 'Casa 24');
      if (casa24Artist) {
        const spotifyGrowth = calculatePlatformGrowth(historicalData, 'Casa 24', 'spotify', 'followers');
        const listenersGrowth = calculatePlatformGrowth(historicalData, 'Casa 24', 'spotify', 'monthly_listeners');
        const youtubeGrowth = calculatePlatformGrowth(historicalData, 'Casa 24', 'youtube', 'subscribers');
        const instagramGrowth = calculatePlatformGrowth(historicalData, 'Casa 24', 'instagram', 'followers');

        let growthText = '';

        if (spotifyGrowth.available) {
          growthText += `${spotifyGrowth.growth.emoji} Followers: ${formatNumber(spotifyGrowth.current)} (${formatPercent(spotifyGrowth.growth.percentage)})\n`;
        }

        if (listenersGrowth.available) {
          growthText += `${listenersGrowth.growth.emoji} Monthly Listeners: ${formatNumber(listenersGrowth.current)} (${formatPercent(listenersGrowth.growth.percentage)})\n`;
        }

        if (growthText) {
          embed.addFields({
            name: '🎵 Spotify Growth',
            value: growthText.trim(),
            inline: true
          });
        }

        if (youtubeGrowth.available) {
          embed.addFields({
            name: '📺 YouTube Growth',
            value: `${youtubeGrowth.growth.emoji} Subscribers: ${formatNumber(youtubeGrowth.current)} (${formatPercent(youtubeGrowth.growth.percentage)})`,
            inline: true
          });
        }

        if (instagramGrowth.available) {
          embed.addFields({
            name: '📸 Instagram Growth',
            value: `${instagramGrowth.growth.emoji} Followers: ${formatNumber(instagramGrowth.current)} (${formatPercent(instagramGrowth.growth.percentage)})`,
            inline: true
          });
        }
      }

      // Find top growing artist
      const artistGrowthData = [];
      for (const artist of latestData.artists || []) {
        const growth = calculatePlatformGrowth(historicalData, artist.name, 'spotify', 'monthly_listeners');
        if (growth.available && growth.growth.percentage !== 0) {
          artistGrowthData.push({
            name: artist.name,
            percentage: growth.growth.percentage,
            absolute: growth.growth.absolute
          });
        }
      }

      if (artistGrowthData.length > 0) {
        artistGrowthData.sort((a, b) => b.percentage - a.percentage);
        const topGrowers = artistGrowthData.slice(0, 3).map((data, i) => {
          const medals = ['🥇', '🥈', '🥉'];
          return `${medals[i]} **${data.name}** - ${formatPercent(data.percentage)}`;
        }).join('\n');

        embed.addFields({
          name: '🚀 Top Growing Artists',
          value: topGrowers,
          inline: false
        });
      }

      embed.setFooter({
        text: `Casa 24 Records - ${historicalData.length} days analyzed`
      });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in /growth command:', error);
      await interaction.editReply({
        content: '❌ Failed to calculate growth data. Please try again later.',
        ephemeral: true
      });
    }
  },
};
