const fs = require("fs");
const chalk = require("chalk");
var AsciiTable = require("ascii-table");
var table = new AsciiTable();
const { CronJob } = require('cron');
table.setHeading("CronJobs", "Status").setBorder("|", "=", "0", "0");

module.exports = (client) => {
  fs.readdirSync('./cron/').filter((file) => file.endsWith('.js')).forEach((file) => {
    const jobModule = require(`../cron/${file}`);

    if (jobModule instanceof CronJob) {
      jobModule.start();
      table.addRow(file.split(".js")[0], "🟢");
    } else {
      table.addRow(file.split('.js')[0], '🔴')
    }
  });
  console.log(chalk.cyan(table.toString()));
};