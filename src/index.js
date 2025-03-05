const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds, 
		GatewayIntentBits.GuildMessages, 
		GatewayIntentBits.GuildPresences, 
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMembers
	], 
	partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction] 
});

const fs = require('fs');
require('dotenv').config()

client.slashCommands = new Collection();
client.commands = new Collection();
client.aliases = new Collection();
client.buttons = new Collection();

client.streamTimestamps = new Map();
client.joinTimestamps = new Map();

client.statsMessage;

module.exports = client;

fs.readdirSync('./handlers').forEach((handler) => {
  require(`./handlers/${handler}`)(client)
});

client.login(process.env.TOKEN)