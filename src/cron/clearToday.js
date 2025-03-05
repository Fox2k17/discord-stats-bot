const { CronJob } = require('cron');
const { sendSingle } = require('../lib/mysql');

module.exports = new CronJob('0 0 0 * * *', async () => {
  const { status } = await sendSingle(`UPDATE stats SET today_time = '0';`);
  if (!status) console.log("Wystąpił błąd podczas resetowania today_time w [clearToday]")
});