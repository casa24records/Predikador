const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { loadLatestData } = require('../utils/dataLoader');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('battle')
        .setDescription('⚔️ Epic head-to-head artist battle with winner declaration!')
        .addStringOption(option =>
            option.setName('artist1')
                .setDescription('First artist to compare')
                .setRequired(true)
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('artist2')
                .setDescription('Second artist to compare')
                .setRequired(true)
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('platform')
                .setDescription('Focus on specific platform')
                .addChoices(
                    { name: 'All Platforms', value: 'all' },
                    { name: 'Spotify Only', value: 'spotify' },
                    { name: 'YouTube Only', value: 'youtube' },
                    { name: 'Instagram Only', value: 'instagram' }
                )),

    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);
        const data = await loadLatestData();

        if (!data || !data.artists) return;

        const artistNames = data.artists.map(a => a.name);
        const focusedValue = focusedOption.value.toLowerCase();

        const filtered = artistNames
            .filter(name => name.toLowerCase().includes(focusedValue))
            .slice(0, 25);

        await interaction.respond(
            filtered.map(name => ({ name: name, value: name }))
        );
    },

    async execute(interaction) {
        await interaction.deferReply();

        const artist1Name = interaction.options.getString('artist1');
        const artist2Name = interaction.options.getString('artist2');
        const platform = interaction.options.getString('platform') || 'all';

        const data = await loadLatestData();

        if (!data) {
            return interaction.editReply('❌ Error loading data. Please try again later.');
        }

        const artist1 = data.artists.find(a => a.name === artist1Name);
        const artist2 = data.artists.find(a => a.name === artist2Name);

        if (!artist1 || !artist2) {
            return interaction.editReply('❌ Could not find one or both artists.');
        }

        if (artist1Name === artist2Name) {
            return interaction.editReply('❌ Please select two different artists to battle!');
        }

        let battleResults = {
            artist1: { wins: 0, metrics: [] },
            artist2: { wins: 0, metrics: [] },
            ties: 0
        };

        // Battle metrics
        const battles = [];

        // Spotify battles
        if (platform === 'all' || platform === 'spotify') {
            // Followers battle
            const followers1 = artist1.spotify?.followers || 0;
            const followers2 = artist2.spotify?.followers || 0;

            if (followers1 > followers2) {
                battleResults.artist1.wins++;
                battles.push(`🎵 **Spotify Followers:** ${artist1Name} WINS! (${followers1.toLocaleString()} vs ${followers2.toLocaleString()}) +${((followers1 - followers2) / followers2 * 100).toFixed(0)}%`);
            } else if (followers2 > followers1) {
                battleResults.artist2.wins++;
                battles.push(`🎵 **Spotify Followers:** ${artist2Name} WINS! (${followers2.toLocaleString()} vs ${followers1.toLocaleString()}) +${((followers2 - followers1) / followers1 * 100).toFixed(0)}%`);
            } else {
                battleResults.ties++;
                battles.push(`🎵 **Spotify Followers:** TIE! (${followers1.toLocaleString()} each)`);
            }

            // Monthly listeners battle
            const listeners1 = parseInt(artist1.spotify?.monthly_listeners) || 0;
            const listeners2 = parseInt(artist2.spotify?.monthly_listeners) || 0;

            if (listeners1 > listeners2) {
                battleResults.artist1.wins++;
                const diff = listeners2 > 0 ? ((listeners1 - listeners2) / listeners2 * 100).toFixed(0) : '∞';
                battles.push(`🎧 **Monthly Listeners:** ${artist1Name} DOMINATES! (${listeners1.toLocaleString()} vs ${listeners2.toLocaleString()}) +${diff}%`);
            } else if (listeners2 > listeners1) {
                battleResults.artist2.wins++;
                const diff = listeners1 > 0 ? ((listeners2 - listeners1) / listeners1 * 100).toFixed(0) : '∞';
                battles.push(`🎧 **Monthly Listeners:** ${artist2Name} DOMINATES! (${listeners2.toLocaleString()} vs ${listeners1.toLocaleString()}) +${diff}%`);
            } else {
                battleResults.ties++;
                battles.push(`🎧 **Monthly Listeners:** TIE! (${listeners1.toLocaleString()} each)`);
            }
        }

        // YouTube battles
        if (platform === 'all' || platform === 'youtube') {
            const subs1 = artist1.youtube?.subscribers || 0;
            const subs2 = artist2.youtube?.subscribers || 0;

            if (subs1 > subs2) {
                battleResults.artist1.wins++;
                const diff = subs2 > 0 ? ((subs1 - subs2) / subs2 * 100).toFixed(0) : '∞';
                battles.push(`📺 **YouTube Subscribers:** ${artist1Name} ${diff === '∞' || parseInt(diff) > 1000 ? 'CRUSHES' : 'WINS'}! (${subs1.toLocaleString()} vs ${subs2.toLocaleString()}) ${diff !== '∞' ? '+' + diff + '%' : ''}`);
            } else if (subs2 > subs1) {
                battleResults.artist2.wins++;
                const diff = subs1 > 0 ? ((subs2 - subs1) / subs1 * 100).toFixed(0) : '∞';
                battles.push(`📺 **YouTube Subscribers:** ${artist2Name} ${diff === '∞' || parseInt(diff) > 1000 ? 'CRUSHES' : 'WINS'}! (${subs2.toLocaleString()} vs ${subs1.toLocaleString()}) ${diff !== '∞' ? '+' + diff + '%' : ''}`);
            } else {
                battleResults.ties++;
                battles.push(`📺 **YouTube Subscribers:** TIE! (${subs1.toLocaleString()} each)`);
            }

            const views1 = artist1.youtube?.total_views || 0;
            const views2 = artist2.youtube?.total_views || 0;

            if (views1 > views2) {
                battleResults.artist1.wins++;
                const diff = views2 > 0 ? ((views1 - views2) / views2 * 100).toFixed(0) : '∞';
                battles.push(`👁️ **Total Views:** ${artist1Name} ${parseInt(diff) > 5000 ? 'OBLITERATES' : 'beats'} ${artist2Name}! (${views1.toLocaleString()} vs ${views2.toLocaleString()})`);
            } else if (views2 > views1) {
                battleResults.artist2.wins++;
                battles.push(`👁️ **Total Views:** ${artist2Name} beats ${artist1Name}! (${views2.toLocaleString()} vs ${views1.toLocaleString()})`);
            } else {
                battleResults.ties++;
                battles.push(`👁️ **Total Views:** TIE! (${views1.toLocaleString()} each)`);
            }
        }

        // Instagram battles
        if (platform === 'all' || platform === 'instagram') {
            const ig1 = artist1.instagram?.followers || 0;
            const ig2 = artist2.instagram?.followers || 0;

            if (ig1 > ig2) {
                battleResults.artist1.wins++;
                battles.push(`📸 **Instagram Followers:** ${artist1Name} WINS! (${ig1.toLocaleString()} vs ${ig2.toLocaleString()})`);
            } else if (ig2 > ig1) {
                battleResults.artist2.wins++;
                battles.push(`📸 **Instagram Followers:** ${artist2Name} WINS! (${ig2.toLocaleString()} vs ${ig1.toLocaleString()})`);
            } else {
                battleResults.ties++;
                battles.push(`📸 **Instagram Followers:** TIE! (${ig1.toLocaleString()} each)`);
            }
        }

        // Determine overall winner
        let winner = '';
        let winnerEmoji = '';
        let resultMessage = '';

        if (battleResults.artist1.wins > battleResults.artist2.wins) {
            winner = artist1Name;
            winnerEmoji = '🏆';
            const dominance = battleResults.artist2.wins === 0 ? 'COMPLETELY DOMINATES' : 'defeats';
            resultMessage = `${winner} ${dominance} ${artist2Name}!`;
        } else if (battleResults.artist2.wins > battleResults.artist1.wins) {
            winner = artist2Name;
            winnerEmoji = '🏆';
            const dominance = battleResults.artist1.wins === 0 ? 'COMPLETELY DOMINATES' : 'defeats';
            resultMessage = `${winner} ${dominance} ${artist1Name}!`;
        } else {
            winnerEmoji = '🤝';
            resultMessage = `It's a TIE! Both artists are equally matched!`;
        }

        const embed = new EmbedBuilder()
            .setTitle(`⚔️ ARTIST BATTLE ⚔️`)
            .setDescription(`**${artist1Name}** VS **${artist2Name}**`)
            .setColor(winner === artist1Name ? 0xFF0000 : winner === artist2Name ? 0x0000FF : 0xFFFF00)
            .addFields(
                { name: '🥊 Battle Results', value: battles.join('\n\n'), inline: false },
                {
                    name: `${winnerEmoji} FINAL SCORE`,
                    value: `**${artist1Name}:** ${battleResults.artist1.wins} wins\n**${artist2Name}:** ${battleResults.artist2.wins} wins\n**Ties:** ${battleResults.ties}\n\n**${resultMessage}**`,
                    inline: false
                }
            )
            .setTimestamp()
            .setFooter({ text: `${platform === 'all' ? 'All Platforms' : platform.charAt(0).toUpperCase() + platform.slice(1) + ' Only'} • Use /leaderboard to see full rankings` });

        await interaction.editReply({ embeds: [embed] });
    },
};