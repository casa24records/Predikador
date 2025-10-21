const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ActivityType } = require('discord.js');

// Try to load .env.local first (for local development), then fall back to .env
const dotenv = require('dotenv');
const envLocalPath = path.join(__dirname, '.env.local');
const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envLocalPath)) {
  console.log('📁 Loading local environment from .env.local');
  dotenv.config({ path: envLocalPath });
} else {
  dotenv.config({ path: envPath });
}

// Validate required environment variables
if (!process.env.DISCORD_BOT_TOKEN || process.env.DISCORD_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE_FROM_GITHUB_SECRET') {
  console.error('❌ Error: DISCORD_BOT_TOKEN is not properly configured!');
  console.error('');
  console.error('For local development:');
  console.error('1. Copy .env.example to .env.local');
  console.error('2. Add your bot token to .env.local');
  console.error('');
  console.error('For GitHub deployment:');
  console.error('1. Go to your repo Settings → Secrets → Actions');
  console.error('2. Create a secret named DISCORD_BOT_TOKEN');
  console.error('3. Paste your bot token as the value');
  process.exit(1);
}

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ]
});

// Load commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

console.log('📦 Loading commands...');
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    console.log(`   ✓ Loaded command: /${command.data.name}`);
  } else {
    console.log(`   ⚠️  Warning: Command at ${filePath} is missing required "data" or "execute" property`);
  }
}

// Bot ready event
client.once(Events.ClientReady, (c) => {
  console.log(`\n✅ Discord bot is online!`);
  console.log(`   Logged in as: ${c.user.tag}`);
  console.log(`   Serving ${c.guilds.cache.size} server(s)`);
  console.log(`   Commands loaded: ${client.commands.size}`);

  // Set bot activity
  client.user.setActivity('Casa 24 Analytics', { type: ActivityType.Watching });

  console.log(`\n🎵 Casa 24 Records Bot is ready to serve stats!\n`);
});

// Handle slash commands
client.on(Events.InteractionCreate, async interaction => {
  // Handle autocomplete
  if (interaction.isAutocomplete()) {
    const command = client.commands.get(interaction.commandName);
    if (!command || !command.autocomplete) return;

    try {
      await command.autocomplete(interaction);
    } catch (error) {
      console.error(`Error in autocomplete for ${interaction.commandName}:`, error);
    }
    return;
  }

  // Handle slash commands
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`❌ No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    console.log(`📊 Executing command: /${interaction.commandName} by ${interaction.user.tag}`);
    await command.execute(interaction);
  } catch (error) {
    console.error(`❌ Error executing ${interaction.commandName}:`, error);

    const errorMessage = {
      content: '❌ There was an error executing this command. Please try again later.',
      ephemeral: true
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

// Error handling
client.on(Events.Error, error => {
  console.error('❌ Discord client error:', error);
});

process.on('unhandledRejection', error => {
  console.error('❌ Unhandled promise rejection:', error);
});

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down bot gracefully...');
  client.destroy();
  process.exit(0);
});

// Login to Discord
console.log('🚀 Starting Casa 24 Records Discord Bot...\n');
client.login(process.env.DISCORD_BOT_TOKEN);
