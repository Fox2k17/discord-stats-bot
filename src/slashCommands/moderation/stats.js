const { ApplicationCommandType } = require('discord.js');
const { sendSingle } = require('../../lib/mysql');

module.exports = {
	name: 'stats',
	description: "Zarządanie użytkownikami",
	cooldown: 3000,
    ownerOnly: true,
	type: ApplicationCommandType.ChatInput,
    default_member_permissions: '0x0000000000000008',
	options: [
        {
            name: 'dodaj_wszystkich',
            description: 'Dodaj wszystkich użytkowników jednocześnie',
            type: 1,
        },
        {
            name: 'dodaj',
            description: 'Dodaj użytkownika',
            type: 1,
            options: [
                {
                    name: 'user',
                    description: 'Użytkownik, którego chcesz dodać',
                    type: 6,
                    required: true
                }
            ]
        },
        {
            name: 'usun',
            description: 'Usuń użytkownika',
            type: 1,
            options: [
                {
                    name: 'user',
                    description: 'Użytkownik, którego chcesz usunąć',
                    type: 6,
                    required: true
                }
            ]
        }
    ],
	run: async (client, interaction) => {
        try {
            if (interaction.options._subcommand === 'dodaj') {
                try {
                    const member = interaction.guild.members.cache.get(interaction.options.get('user').value);
                    if (member.user.bot) return await interaction.reply({ content: 'Użytkownik, którego chcesz dodać, nie może być botem!', ephemeral: true });
                    if (member.voice.channel) return await interaction.reply({ content: 'Użytkownik, którego chcesz dodać, nie może być na kanale głosowym!', ephemeral: true });
    
                    const { status } = await sendSingle("INSERT INTO `stats`(`user_id`) VALUES (?);", [member.user.id]);
                    if (!status) return await interaction.reply({ content: 'Ten użytkownik jest już dodany!', ephemeral: true });
    
                    return await interaction.reply({ content: `Pomyślnie dodano użytkownika <@${member.user.id}>`, ephemeral: true }); 
                } catch {
                    return await interaction.reply({ content: 'Wystąpił nieoczekiwany błąd, spróbuj ponownie!', ephemeral: true });
                }
            }
            if (interaction.options._subcommand === 'usun') {
                try {
                    const member = interaction.guild.members.cache.get(interaction.options.get('user').value);
                    const { status } = await sendSingle("DELETE FROM `stats` WHERE `user_id` = ?;", [member.user.id]);
                    if (!status) return await interaction.reply({ content: 'Coś poszło nie tak przy usuwaniu, spróbuj ponownie!', ephemeral: true });
    
                    return await interaction.reply({ content: `Pomyślnie usunięto użytkownika <@${member.user.id}>`, ephemeral: true }); 
                } catch {
                    return await interaction.reply({ content: 'Wystąpił nieoczekiwany błąd, spróbuj ponownie!', ephemeral: true });
                }
            }
            if (interaction.options._subcommand === 'dodaj_wszystkich') {
                const res = await interaction.guild.members.fetch();
                let i = 0;
                for (const [x, member] of res) {
                    if (member && member.user && !member.user.bot) {
                        const { status } = await sendSingle("INSERT INTO `stats`(`user_id`) VALUES (?);", [member.user.id]);
                        if (status) i++;
                    }
                }
                
                return await interaction.reply({ content: `Pomyślnie dodano ${i} nowych użytkowników`, ephemeral: true }); 
            }
        } catch {
            return interaction.reply({ content: 'Wystąpił nieoczekiwany błąd, spróbuj ponownie!', ephemeral: true });
        }
    } 
};
