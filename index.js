require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Partials, Events } = require('discord.js');

// Try to load token from environment, then config.json
let token = process.env.BOT_TOKEN;
const configPath = path.resolve(__dirname, 'config.json');
if (!token) {
  try {
    const cfgRaw = fs.readFileSync(configPath, 'utf8').trim();
    if (cfgRaw) {
      const cfg = JSON.parse(cfgRaw);
      token = cfg?.BOT_TOKEN || cfg?.token || cfg?.botToken;
    }
  } catch (err) {
    // ignore: file might not exist or be empty
  }
}

if (!token) {
  console.warn('No bot token found. Set BOT_TOKEN in environment or add it to config.json. The script will exit.');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Channel],
});

client.once(Events.ClientReady, c => {
  console.log(`Logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, message => {
  if (message.author.bot) return;
  const content = message.content.trim().toLowerCase();
  if (content === 'ping') {
    message.reply('Pong!');
  }
});

client.login(token).catch(err => {
  console.error('Failed to login:', err);
  process.exit(1);
});
