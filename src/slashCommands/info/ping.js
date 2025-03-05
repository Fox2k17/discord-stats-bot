const { ApplicationCommandType } = require('discord.js');

module.exports = {
	name: 'ping',
	description: "Sprawdź ping bota",
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
	run: async (client, interaction) => {
		interaction.reply({ content: `🏓 Pong! Opóźnienie: **${Math.round(client.ws.ping)} ms**` })
	}
};