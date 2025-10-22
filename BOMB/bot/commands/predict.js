const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { loadLatestData, loadHistoricalData, getAllArtistNames } = require('../utils/dataLoader');
const { predictMetric, formatNumber, formatPercent } = require('../utils/analytics');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('predict')
    .setDescription('Predict future metrics using AI (linear regression)')
    .addStringOption(option =>
      option.setName('artist')
        .setDescription('Artist to predict for (default: Casa 24)')
        .setRequired(false)
    )
    .addIntegerOption(option =>
      option.setName('days')
        .setDescription('Days ahead to predict (7-90)')
        .setRequired(false)
        .setMinValue(7)
        .setMaxValue(90)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const latestData = await loadLatestData();
      const artistName = interaction.options.getString('artist') || 'Casa 24';
      const daysAhead = interaction.options.getInteger('days') || 30;

      // Validate artist
      const artist = latestData.artists?.find(a =>
        a.name.toLowerCase() === artistName.toLowerCase() ||
        a.name.toLowerCase().includes(artistName.toLowerCase())
      );

      if (!artist) {
        const artistList = getAllArtistNames(latestData);
        await interaction.editReply({
          content: `❌ Artist "${artistName}" not found.\n\nAvailable artists: ${artistList.join(', ')}`,
          ephemeral: true
        });
        return;
      }

      // Load historical data (need more for predictions)
      const historicalData = await loadHistoricalData(90);

      if (historicalData.length < 7) {
        await interaction.editReply({
          content: '❌ Need at least 7 days of historical data for predictions.',
          ephemeral: true
        });
        return;
      }

      const embed = new EmbedBuilder()
        .setColor(0x8c52ff) // Purple for predictions
        .setTitle(`🔮 AI Prediction - ${artist.name}`)
        .setDescription(`Forecasting ${daysAhead} days ahead using linear regression\n*Based on ${historicalData.length} days of historical data*`)
        .setTimestamp();

      // Predict Spotify followers
      const followersPrediction = predictMetric(
        historicalData,
        artist.name,
        'spotify',
        'followers',
        daysAhead
      );

      if (followersPrediction.available) {
        const confidenceBar = '█'.repeat(Math.floor(followersPrediction.confidence / 10)) + '░'.repeat(10 - Math.floor(followersPrediction.confidence / 10));
        embed.addFields({
          name: '🎵 Spotify Followers',
          value: `**Current:** ${formatNumber(followersPrediction.current)}\n` +
                 `**Predicted:** ${formatNumber(followersPrediction.predicted)} (${formatPercent(followersPrediction.growth.percentage)})\n` +
                 `**Confidence:** ${followersPrediction.confidence}% ${confidenceBar}`,
          inline: false
        });
      }

      // Predict monthly listeners
      const listenersPrediction = predictMetric(
        historicalData,
        artist.name,
        'spotify',
        'monthly_listeners',
        daysAhead
      );

      if (listenersPrediction.available) {
        const confidenceBar = '█'.repeat(Math.floor(listenersPrediction.confidence / 10)) + '░'.repeat(10 - Math.floor(listenersPrediction.confidence / 10));
        embed.addFields({
          name: '🎧 Monthly Listeners',
          value: `**Current:** ${formatNumber(listenersPrediction.current)}\n` +
                 `**Predicted:** ${formatNumber(listenersPrediction.predicted)} (${formatPercent(listenersPrediction.growth.percentage)})\n` +
                 `**Confidence:** ${listenersPrediction.confidence}% ${confidenceBar}`,
          inline: false
        });
      }

      // Predict Instagram followers if available
      const instagramPrediction = predictMetric(
        historicalData,
        artist.name,
        'instagram',
        'followers',
        daysAhead
      );

      if (instagramPrediction.available) {
        const confidenceBar = '█'.repeat(Math.floor(instagramPrediction.confidence / 10)) + '░'.repeat(10 - Math.floor(instagramPrediction.confidence / 10));
        embed.addFields({
          name: '📸 Instagram Followers',
          value: `**Current:** ${formatNumber(instagramPrediction.current)}\n` +
                 `**Predicted:** ${formatNumber(instagramPrediction.predicted)} (${formatPercent(instagramPrediction.growth.percentage)})\n` +
                 `**Confidence:** ${instagramPrediction.confidence}% ${confidenceBar}`,
          inline: false
        });
      }

      // Add disclaimer
      embed.addFields({
        name: '⚠️ Disclaimer',
        value: 'Predictions use simple linear regression and assume current growth trends continue. Actual results may vary based on releases, marketing, and external factors.',
        inline: false
      });

      embed.setFooter({
        text: `Casa 24 Records - AI-powered predictions`
      });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in /predict command:', error);
      await interaction.editReply({
        content: '❌ Failed to generate predictions. Please try again later.',
        ephemeral: true
      });
    }
  },
};
