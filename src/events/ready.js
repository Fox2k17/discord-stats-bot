const { ActivityType } = require('discord.js');
const { sendSingle } = require('../lib/mysql');
const { sqlite } = require('../config.json')
const client = require('..');
const chalk = require('chalk');

client.on("ready", async () => {
	const activities = [
		{ name: `/statystyki`, type: ActivityType.Listening },
		{ name: `Zbieranie statystyk`, type: ActivityType.Playing },
		{ name: `${client.users.cache.size} Użytkowników`, type: ActivityType.Watching }
	];
	const sts = [
		'online',
		'dnd',
		'idle'
	];
	let i = 0;
	setInterval(() => {
		if(i >= activities.length) i = 0
		client.user.setActivity(activities[i])
		i++;
	}, 5000);

	let s = 0;
	setInterval(() => {
		if(s >= activities.length) s = 0
		client.user.setStatus(sts[s])
		s++;
	}, 30000);
	console.log(chalk.red(`Zalogowano jako ${client.user.tag}!`))

	const query = sqlite 
	? "CREATE TABLE IF NOT EXISTS stats (id INTEGER PRIMARY KEY AUTOINCREMENT,user_id TEXT NOT NULL UNIQUE,is_on_channel INTEGER NOT NULL DEFAULT 0,spend_time INTEGER NOT NULL DEFAULT 0,today_time INTEGER NOT NULL DEFAULT 0,stream_time INTEGER NOT NULL DEFAULT 0,last_active TIMESTAMP NULL DEFAULT NULL,last_channel TEXT NOT NULL DEFAULT '000',last_update DATETIME DEFAULT CURRENT_TIMESTAMP);" 
	: "CREATE TABLE IF NOT EXISTS `stats` (`id` int(11) NOT NULL AUTO_INCREMENT, `user_id` varchar(255) NOT NULL,`is_on_channel` tinyint(1) NOT NULL DEFAULT 0,`spend_time` int(11) NOT NULL DEFAULT 0,`today_time` int(11) NOT NULL DEFAULT 0,`stream_time` int(11) NOT NULL DEFAULT 0,`last_active` timestamp NULL DEFAULT NULL,`last_channel` varchar(255) NOT NULL DEFAULT '000',`last_update` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),PRIMARY KEY (`id`),UNIQUE KEY `user_id` (`user_id`))"
	const { status } = await sendSingle(query);
	if (status) console.log(chalk.green("Pomyślnie zweryfikowano bazę danych"));
});