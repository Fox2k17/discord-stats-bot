const { EmbedBuilder, Collection, PermissionsBitField } = require('discord.js');
const ms = require('ms');
const client = require('..');
const config = require('../config.json');

const cooldown = new Collection();

client.on('interactionCreate', async interaction => {
	const slashCommand = client.slashCommands.get(interaction.commandName);
		if (interaction.type == 4) {
			if(slashCommand.autocomplete) {
				const choices = [];
				await slashCommand.autocomplete(interaction, choices)
			}
		}
		if (!interaction.type == 2) return;
	
		if(!slashCommand) return client.slashCommands.delete(interaction.commandName);
		try {
			if(slashCommand.cooldown) {
				if(cooldown.has(`slash-${slashCommand.name}${interaction.user.id}`)) return interaction.reply({ content: config.messages["COOLDOWN_MESSAGE"].replace('<duration>', ms(cooldown.get(`slash-${slashCommand.name}${interaction.user.id}`) - Date.now(), {long : true}) ) })

				cooldown.set(`slash-${slashCommand.name}${interaction.user.id}`, Date.now() + slashCommand.cooldown)
				setTimeout(() => {
						cooldown.delete(`slash-${slashCommand.name}${interaction.user.id}`)
				}, slashCommand.cooldown)
			} 
			if(slashCommand.userPerms || slashCommand.botPerms) {
				if(!interaction.memberPermissions.has(PermissionsBitField.resolve(slashCommand.userPerms || []))) {
					const userPerms = new EmbedBuilder()
					.setDescription(`🚫 ${interaction.user}, Nie masz permisji \`${slashCommand.userPerms}\`, aby użyć tej komendy!`)
					.setColor('Red')
					return interaction.reply({ embeds: [userPerms] })
				}
				if(!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(slashCommand.botPerms || []))) {
					const botPerms = new EmbedBuilder()
					.setDescription(`🚫 ${interaction.user}, Muszę posiadać permisje \`${slashCommand.botPerms}\`, aby to wykonać!`)
					.setColor('Red')
					return interaction.reply({ embeds: [botPerms] })
				}
			}
			if(slashCommand.ownerOnly && process.env.OWNER_ID && process.env.OWNER_ID != interaction.user.id) {
				const ownerOnly = new EmbedBuilder()
				.setDescription(`🚫 ${interaction.user}, Ta komenda przeznaczona jest tylko dla właściciela!`)
				.setColor('Red')
				return interaction.reply({ embeds: [ownerOnly] })
			}
			await slashCommand.run(client, interaction);
		} catch (error) {
				console.log(error);
		}
});