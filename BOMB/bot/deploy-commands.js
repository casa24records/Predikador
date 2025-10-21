const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

// Validate environment variables
if (!process.env.DISCORD_BOT_TOKEN) {
  console.error('❌ Error: DISCORD_BOT_TOKEN not found in .env file');
  process.exit(1);
}

if (!process.env.DISCORD_CLIENT_ID) {
  console.error('❌ Error: DISCORD_CLIENT_ID not found in .env file');
  process.exit(1);
}

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Load all command data
console.log('📦 Loading commands for deployment...\n');
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
    console.log(`   ✓ Loaded: /${command.data.name}`);
  } else {
    console.log(`   ⚠️  Warning: ${file} is missing "data" or "execute"`);
  }
}

// Deploy commands
const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
  try {
    console.log(`\n🚀 Started deploying ${commands.length} slash commands...`);

    // Deploy globally (takes up to 1 hour to propagate)
    // For faster testing, use guild commands instead (see commented code below)
    const data = await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      { body: commands }
    );

    // For guild-specific (instant) deployment, uncomment this and comment above:
    /*
    const data = await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
      { body: commands }
    );
    */

    console.log(`✅ Successfully deployed ${data.length} slash commands!`);
    console.log('\n📝 Deployed commands:');
    data.forEach(cmd => {
      console.log(`   • /${cmd.name} - ${cmd.description}`);
    });

    console.log('\n⚠️  Note: Global commands may take up to 1 hour to appear.');
    console.log('💡 Tip: For instant testing, deploy to a specific guild instead.\n');

  } catch (error) {
    console.error('❌ Error deploying commands:', error);
    process.exit(1);
  }
})();
