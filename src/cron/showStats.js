const { secondsTo_DGMS, secondsTo_GMS } = require('../lib/time');
const { EmbedBuilder } = require("discord.js");
const { sendMulti } = require('../lib/mysql');
const config = require('../config.json');
const { CronJob } = require('cron');
const client = require('..');

module.exports = new CronJob('*/1 * * * *', async () => {
  try {
    async function checkMsg() {
      try {
        await channel.messages.fetch(client.statsMessage)
        return true;
      } catch {return false;}
    }
    function formatTime(time) {
      let desc = "";
      if (time.dni) desc += `${time.dni}d, `;
      if (time.godziny) desc += `${time.godziny}g, `;
      if (time.minuty) desc += `${time.minuty}m, `;
      if (time.sekundy) desc += `${time.sekundy}s`;
      return desc;
    }
    let pos1 = 1, pos2 = 1, pos3 = 1;
    let desc1 = "", desc2 = "", desc3 = "";
  
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) return;
  
    const channel = guild.channels.cache.get(config.messageChannel);
    if (!channel) return;
  
    const message = await checkMsg() ? client.statsMessage : null;

    const queries = [
      `SELECT user_id, spend_time, today_time FROM stats ORDER BY spend_time DESC LIMIT ${config.showLimit_1};`,
      `SELECT user_id, stream_time FROM stats ORDER BY stream_time DESC LIMIT ${config.showLimit_2};`,
      `SELECT user_id, is_on_channel, last_active, last_channel FROM stats WHERE last_active IS NOT NULL ORDER BY last_active ASC LIMIT ${config.showLimit_3};`,
    ];
    const { data } = await sendMulti(queries);
    const [data1, data2, data3] = data.map(item => item.data);

    for (let i = 0; i < data1.length; i++) {
      if (data1[i].spend_time) {
        const spend_time = secondsTo_DGMS(data1[i].spend_time);
        const today_time = secondsTo_GMS(data1[i].today_time);
    
        let desc_time1 = formatTime(spend_time);
        let desc_time2 = formatTime(today_time);
    
        if (desc_time2.length <= 1) {
          desc_time2 = "Dzisiaj nic";
        }
    
        desc1 += `
          > **#${pos1++}** - <@${data1[i].user_id}>
          > **Ogólnie**: \`${desc_time1}\`
          > **Dzisiaj**: \`${desc_time2}\`\n`;
      }
    }
    for (let i = 0; i < data2.length; i++) {
      if (data2[i].stream_time) {
        const streamTime = secondsTo_GMS(data2[i].stream_time);
        desc2 += `
        > **#${pos2++}** - <@${data2[i].user_id}>
        > **Przestreamował już**: \`${streamTime.godziny}g : ${streamTime.minuty}m : ${streamTime.sekundy}s\`\n`;
      }
    }
    for (let i = 0; i < data3.length; i++) {
      const userData = data3[i];
      if (typeof userData.last_active) {
        const userChannelInfo = userData.is_on_channel
          ? `Jest na kanale: <#${userData.last_channel}>\n`
          : `Ostatnio widziany <t:${new Date(userData.last_active).getTime() / 1000}:R> na kanale <#${userData.last_channel}>\n`;
    
        desc3 += `
          > **#${pos3++}** - <@${userData.user_id}>
          > ${userChannelInfo}`;
      }
    }
  
    const embed1 = new EmbedBuilder()
    embed1.setTitle("Spędzony Czas Online ⏳");
    embed1.setColor(0x0099FF);
    embed1.setDescription(desc1 ? desc1 : "Brak statystyk\n");
  
    const embed2 = new EmbedBuilder()
    embed2.setTitle("Czas Przestreamowany 🎥");
    embed2.setColor(0x0099FF);
    embed2.setDescription(desc2 ? desc2 : "Brak statystyk\n");
  
    const embed3 = new EmbedBuilder()
    embed3.setTitle("Ostatnio Online 📅");
    embed3.setColor(0x0099FF);
    embed3.setDescription(desc3 ? desc3 : "Brak statystyk\n");
    embed3.setTimestamp();
    embed3.setFooter({ text: 'Ostatnia aktualizacja ' });
  
    if (message) {
      return message.edit({ content: "# STATYSTYKI", embeds: [embed1, embed2, embed3] }).catch(console.error);
    }
  
    channel
    .send({ content: "# STATYSTYKI", embeds: [embed1, embed2, embed3] })
    .then((msg) => {
      client.statsMessage = msg;
    }).catch(console.error);
  } catch (error) {
    console.log(error);
    console.log("Wystąpił błąd podczas próby wysłania [showStats.js]")
  }
});