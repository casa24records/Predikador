const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { loadLatestData, loadHistoricalData } = require('../utils/dataLoader');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('achievements')
        .setDescription('🏆 View unlocked achievements and track progress toward special accomplishments')
        .addStringOption(option =>
            option.setName('artist')
                .setDescription('Artist to check achievements for')
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Achievement category to view')
                .addChoices(
                    { name: 'All Achievements', value: 'all' },
                    { name: 'Growth Achievements', value: 'growth' },
                    { name: 'Viral Achievements', value: 'viral' },
                    { name: 'Consistency Achievements', value: 'consistency' },
                    { name: 'Collective Achievements', value: 'collective' },
                    { name: 'Rare Achievements', value: 'rare' }
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

        try {
            const artistName = interaction.options.getString('artist');
            const category = interaction.options.getString('category') || 'all';

            const data = await loadLatestData();
            const historicalData = await loadHistoricalData(90); // 90 days for comprehensive achievement checking

            if (!data) {
                return interaction.editReply('❌ Error loading data.');
            }

            // Define all achievements
        const achievementDefinitions = {
            growth: [
                { id: 'first_steps', name: '🌱 First Steps', description: 'Reach 100 followers on any platform', check: (artist) => checkFollowerMilestone(artist, 100) },
                { id: 'rising_star', name: '🚀 Rising Star', description: 'Gain 100+ followers in 7 days', check: (artist, hist) => checkGrowthRate(artist, hist, 100, 7) },
                { id: 'shooting_star', name: '💫 Shooting Star', description: 'Gain 500+ followers in 30 days', check: (artist, hist) => checkGrowthRate(artist, hist, 500, 30) },
                { id: 'lightning_growth', name: '⚡ Lightning Growth', description: '50% growth in 14 days', check: (artist, hist) => checkPercentageGrowth(artist, hist, 50, 14) },
                { id: 'on_fire', name: '🔥 On Fire', description: '100% growth in 30 days', check: (artist, hist) => checkPercentageGrowth(artist, hist, 100, 30) },
                { id: 'unstoppable', name: '🚂 Unstoppable', description: 'Positive growth for 30 consecutive days', check: (artist, hist) => checkConsecutiveGrowth(artist, hist, 30) }
            ],
            viral: [
                { id: 'viral_video', name: '📹 Viral Video', description: 'YouTube video reaches 1K+ views', check: (artist) => checkVideoViews(artist, 1000) },
                { id: 'track_explosion', name: '🎵 Track Explosion', description: 'Track popularity reaches 20+ points', check: (artist) => checkTrackPopularity(artist, 20) },
                { id: 'trending_track', name: '📊 Trending Track', description: 'Track enters top 3 on Spotify', check: (artist) => checkTopTracks(artist, 3) },
                { id: 'wave_rider', name: '🌊 Wave Rider', description: '1K+ monthly listeners', check: (artist) => parseInt(artist.spotify?.monthly_listeners) >= 1000 },
                { id: 'viral_moment', name: '💥 Viral Moment', description: '500+ growth in any metric in 7 days', check: (artist, hist) => checkViralGrowth(artist, hist, 500, 7) }
            ],
            consistency: [
                { id: 'week_warrior', name: '📅 Week Warrior', description: '7 consecutive days of growth', check: (artist, hist) => checkConsecutiveGrowth(artist, hist, 7) },
                { id: 'month_master', name: '📆 Month Master', description: '30 consecutive days of growth', check: (artist, hist) => checkConsecutiveGrowth(artist, hist, 30) },
                { id: 'steady_climber', name: '🎯 Steady Climber', description: '90 days of net positive growth', check: (artist, hist) => checkNetGrowth(artist, hist, 90) },
                { id: 'veteran', name: '🏆 Veteran', description: '180+ days tracked in system', check: (artist, hist) => hist && hist.length >= 180 },
                { id: 'consistent_creator', name: '🎨 Consistent Creator', description: 'Release content every month for 3 months', check: (artist, hist) => checkContentConsistency(artist, hist, 3) }
            ],
            collective: [
                { id: 'platform_domination', name: '🌐 Platform Domination', description: '10K+ total followers on one platform', check: (artist) => checkPlatformDomination(artist, 10000) },
                { id: 'community_milestone', name: '👥 Community Milestone', description: 'Discord reaches 100 members', check: (artist, hist, allArtists, discord) => discord?.member_count >= 100 }
            ],
            rare: [
                { id: 'diamond_status', name: '💎 Diamond Status', description: 'Reach 100K on any platform', check: (artist) => checkFollowerMilestone(artist, 100000) },
                { id: 'unicorn_moment', name: '🦄 Unicorn Moment', description: '1000%+ growth on any metric', check: (artist, hist) => checkUnicornGrowth(artist, hist, 1000) },
                { id: 'legendary', name: '🏅 Legendary', description: 'Appear in top tracks across all platforms', check: (artist) => checkLegendaryStatus(artist) },
                { id: 'perfect_week', name: '✨ Perfect Week', description: 'Growth on all metrics for 7 days straight', check: (artist, hist) => checkPerfectWeek(artist, hist) }
            ]
        };

        // Get artists to check
        const artists = artistName && artistName !== 'All Artists'
            ? data.artists.filter(a => a.name === artistName)
            : data.artists;

        let allUnlocked = [];
        let allInProgress = [];

        for (const artist of artists) {
            const artistAchievements = checkArtistAchievements(
                artist,
                historicalData,
                data.artists,
                data.discord,
                achievementDefinitions,
                category
            );

            // Add artist name to achievements
            artistAchievements.unlocked.forEach(a => {
                a.artistName = artist.name;
                allUnlocked.push(a);
            });

            artistAchievements.inProgress.forEach(a => {
                a.artistName = artist.name;
                allInProgress.push(a);
            });
        }

        // Build embed
        const embed = new EmbedBuilder()
            .setTitle('🏆 ACHIEVEMENTS')
            .setDescription(artistName && artistName !== 'All Artists'
                ? `Achievements for **${artistName}**`
                : 'Achievements for all artists')
            .setColor(0xFFD700)
            .setTimestamp();

        // Calculate progress
        const totalAchievements = Object.values(achievementDefinitions).flat().length;
        const unlockedCount = allUnlocked.length;
        const progressPercent = ((unlockedCount / totalAchievements) * 100).toFixed(1);

        embed.addFields({
            name: '📊 Progress',
            value: `**${unlockedCount}/${totalAchievements}** Unlocked (${progressPercent}%)`,
            inline: false
        });

        // Add unlocked achievements
        if (allUnlocked.length > 0) {
            const unlockedText = allUnlocked.slice(0, 10).map(a =>
                `${a.name} - **${a.artistName}**\n*${a.description}*`
            ).join('\n\n');

            embed.addFields({
                name: '✅ UNLOCKED',
                value: unlockedText,
                inline: false
            });
        }

        // Add in-progress achievements
        if (allInProgress.length > 0) {
            const inProgressText = allInProgress.slice(0, 5).map(a => {
                const progressBar = '█'.repeat(Math.floor(a.progress / 10)) + '░'.repeat(10 - Math.floor(a.progress / 10));
                return `${a.name} - **${a.artistName}**\n${progressBar} ${a.progress.toFixed(0)}%\n*${a.progressText}*`;
            }).join('\n\n');

            embed.addFields({
                name: '🔒 IN PROGRESS',
                value: inProgressText,
                inline: false
            });
        }

        // Add rare achievement teaser
        const rareUnlocked = allUnlocked.filter(a =>
            achievementDefinitions.rare.some(def => def.name === a.name)
        );

        if (rareUnlocked.length > 0) {
            embed.setFooter({
                text: `🦄 ${rareUnlocked.length} RARE achievement${rareUnlocked.length > 1 ? 's' : ''} unlocked! Incredible!`
            });
        } else {
            embed.setFooter({
                text: 'Keep grinding to unlock rare achievements! 🦄'
            });
        }

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error in /achievements command:', error);
            await interaction.editReply({
                content: '❌ Failed to load achievements. Please try again later.',
                ephemeral: true
            });
        }
    },
};

// Achievement checking functions
function checkFollowerMilestone(artist, milestone) {
    const total = (artist.spotify?.followers || 0) +
                  (artist.youtube?.subscribers || 0) +
                  (artist.instagram?.followers || 0);
    return total >= milestone;
}

function checkGrowthRate(artist, historicalData, amount, days) {
    if (!historicalData || historicalData.length < days) return false;

    const oldData = historicalData[Math.min(days, historicalData.length - 1)];
    const oldArtist = oldData.artists?.find(a => a.name === artist.name);

    if (!oldArtist) return false;

    const currentTotal = (artist.spotify?.followers || 0) +
                        (artist.youtube?.subscribers || 0) +
                        (artist.instagram?.followers || 0);
    const oldTotal = (oldArtist.spotify?.followers || 0) +
                    (oldArtist.youtube?.subscribers || 0) +
                    (oldArtist.instagram?.followers || 0);

    return (currentTotal - oldTotal) >= amount;
}

function checkPercentageGrowth(artist, historicalData, percentage, days) {
    if (!historicalData || historicalData.length < days) return false;

    const oldData = historicalData[Math.min(days, historicalData.length - 1)];
    const oldArtist = oldData.artists?.find(a => a.name === artist.name);

    if (!oldArtist) return false;

    const currentTotal = (artist.spotify?.followers || 0) +
                        (artist.youtube?.subscribers || 0) +
                        (artist.instagram?.followers || 0);
    const oldTotal = (oldArtist.spotify?.followers || 0) +
                    (oldArtist.youtube?.subscribers || 0) +
                    (oldArtist.instagram?.followers || 0);

    if (oldTotal === 0) return false;

    return ((currentTotal - oldTotal) / oldTotal * 100) >= percentage;
}

function checkConsecutiveGrowth(artist, historicalData, days) {
    if (!historicalData || historicalData.length < days) return false;

    let consecutiveDays = 0;
    for (let i = 1; i < Math.min(days, historicalData.length); i++) {
        const current = historicalData[i - 1].artists?.find(a => a.name === artist.name);
        const previous = historicalData[i].artists?.find(a => a.name === artist.name);

        if (!current || !previous) return false;

        const currentTotal = (current.spotify?.followers || 0) +
                           (current.youtube?.subscribers || 0) +
                           (current.instagram?.followers || 0);
        const previousTotal = (previous.spotify?.followers || 0) +
                             (previous.youtube?.subscribers || 0) +
                             (previous.instagram?.followers || 0);

        if (currentTotal > previousTotal) {
            consecutiveDays++;
        } else {
            break;
        }
    }

    return consecutiveDays >= days;
}

function checkVideoViews(artist, viewThreshold) {
    if (!artist.youtube?.top_videos) return false;
    return artist.youtube.top_videos.some(video => video.views >= viewThreshold);
}

function checkTrackPopularity(artist, popularityThreshold) {
    if (!artist.spotify?.top_tracks) return false;
    return artist.spotify.top_tracks.some(track => track.popularity >= popularityThreshold);
}

function checkTopTracks(artist, position) {
    if (!artist.spotify?.top_tracks) return false;
    return artist.spotify.top_tracks.length >= position;
}

function checkViralGrowth(artist, historicalData, amount, days) {
    return checkGrowthRate(artist, historicalData, amount, days);
}

function checkNetGrowth(artist, historicalData, days) {
    if (!historicalData || historicalData.length < 2) return false;

    const oldestIndex = Math.min(days, historicalData.length - 1);
    const oldest = historicalData[oldestIndex].artists?.find(a => a.name === artist.name);

    if (!oldest) return false;

    const currentTotal = (artist.spotify?.followers || 0) +
                        (artist.youtube?.subscribers || 0) +
                        (artist.instagram?.followers || 0);
    const oldestTotal = (oldest.spotify?.followers || 0) +
                       (oldest.youtube?.subscribers || 0) +
                       (oldest.instagram?.followers || 0);

    return currentTotal > oldestTotal;
}

function checkContentConsistency(artist, historicalData, months) {
    // Simplified check - would need more data about content releases
    return artist.youtube?.video_count > months * 2;
}

function checkPlatformDomination(artist, threshold) {
    return (artist.spotify?.followers >= threshold) ||
           (artist.youtube?.subscribers >= threshold) ||
           (artist.instagram?.followers >= threshold);
}

function checkUnicornGrowth(artist, historicalData, percentage) {
    return checkPercentageGrowth(artist, historicalData, percentage, 30);
}

function checkLegendaryStatus(artist) {
    // Check if artist appears in top content across platforms
    return (artist.spotify?.popularity_score >= 50) &&
           (artist.youtube?.subscribers >= 1000);
}

function checkPerfectWeek(artist, historicalData) {
    return checkConsecutiveGrowth(artist, historicalData, 7);
}

function checkArtistAchievements(artist, historicalData, allArtists, discord, definitions, category) {
    const unlocked = [];
    const inProgress = [];

    const categoriesToCheck = category === 'all'
        ? Object.keys(definitions)
        : [category];

    for (const cat of categoriesToCheck) {
        if (!definitions[cat]) continue;

        for (const achievement of definitions[cat]) {
            const isUnlocked = achievement.check(artist, historicalData, allArtists, discord);

            if (isUnlocked) {
                unlocked.push({
                    name: achievement.name,
                    description: achievement.description,
                    category: cat
                });
            } else {
                // Calculate progress (simplified)
                let progress = 0;
                let progressText = 'Not started';

                // Example progress calculation for follower milestones
                if (achievement.description.includes('100 followers')) {
                    const total = (artist.spotify?.followers || 0) +
                                (artist.youtube?.subscribers || 0) +
                                (artist.instagram?.followers || 0);
                    progress = (total / 100) * 100;
                    progressText = `${total}/100 followers`;
                }

                if (progress > 0) {
                    inProgress.push({
                        name: achievement.name,
                        description: achievement.description,
                        category: cat,
                        progress: Math.min(100, progress),
                        progressText: progressText
                    });
                }
            }
        }
    }

    return { unlocked, inProgress };
}