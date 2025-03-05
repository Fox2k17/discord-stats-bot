const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const { sendSingle } = require('../../lib/mysql');
const { secondsTo_DGMS, secondsTo_GMS } = require('../../lib/time');

module.exports = {
	name: 'statystyki',
	description: "Sprawdź statystyki",
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
    options: [
        {
            name: 'user',
            description: 'Sprawdź statystyki innej osoby',
            type: 6
        }
    ],
	run: async (client, interaction) => {
        const user = interaction.options.get('user')?.user || interaction.user;

        const { status, data } = await sendSingle("SELECT `spend_time`, `today_time`, `stream_time`, `last_active`, `last_channel` FROM `stats` WHERE `user_id` = ?;", [user.id]);

        if (!status) return await interaction.reply({ content: 'Wystąpił błąd podczas pobierania informacji', ephemeral: true });
        if (!data.length) return await interaction.reply({ content: 'Brak informacji o tym użytkowniku', ephemeral: true });

        const spend_time = secondsTo_DGMS(data[0].spend_time);
        const today_time = secondsTo_GMS(data[0].today_time);
        const stream_time = secondsTo_GMS(data[0].stream_time)
        const embed = new EmbedBuilder()
        .setTitle(`Statystyki - ${user.tag}`)
        .addFields(
          {
            name: "Czas spędzony na kanałach głosowych __ogólnie__",
            value: `\`\`\`${spend_time.dni}d, ${spend_time.godziny}g, ${spend_time.minuty}m, ${spend_time.sekundy}s \`\`\``,
            inline: false
          },
          {
            name: "Czas spędzony na kanałch głosowych __dzisiaj__",
            value: `\`\`\`${today_time.godziny}g, ${today_time.minuty}m, ${today_time.sekundy}s\`\`\``,
            inline: false
          },
          {
            name: "Czas przestreamowany",
            value: `\`\`\`${stream_time.godziny}g, ${stream_time.minuty}m, ${stream_time.sekundy}s\`\`\``,
            inline: false
          },
          {
            name: "Ostatnio online",
            value: `> <t:${new Date(data[0].last_active).getTime() / 1000}:R>\n**Na kanale głosowym**\n> <#${data[0].last_channel}>`,
            inline: false
          },
        )
        .setThumbnail(user.displayAvatarURL({ size: 4096 }))
        .setColor("#00b0f4")
        .setFooter({
          text: "Wygenerowane",
        })
        .setTimestamp();

		return interaction.reply({ embeds: [embed] })
	}
};
