const express = require('express');
const chalk = require("chalk");
const server = express();

server.all("/", (req, res) => res.send(`<meta http-equiv="refresh" content="0; URL=https://passwordpassword.online"/>`));
server.listen(process.env.PORT ?? 3000, () => {
    console.log(`${chalk.magentaBright.bold("clan-advertisements")} | ${chalk.redBright.bold("The Revengeance")}`);
    console.log(`\n[${chalk.green.bold("+")}] The webserver is ready.\n`);
});

const Authorization = process.env.Authorization;

const CHANNEL_ID = "1245731705113940089"
const MESSAGE = "🌙 [SOL] The Revengeance | NA Clan 🇺🇸\nRequirements: Be able to do fuel tasks every day, no exceptions\nStats: Coin Earning - SEVEN | Welfare - SIX | Luck - SEVEN | Size SEVEN | Calming unlocked, Quantum unlocked\nDM <@992221688362192956>  to apply! (Don’t DM if you can’t do the requirements) ^^"

const Discord = require('discord.js-selfbot-v13');
const client = new Discord.Client({checkUpdate: false});

client.once('ready', async () => {
  console.log(`${client.user.username}#${client.user.discriminator} (${client.user.id})!`);

  setInterval(async () =>{
    try {
      const channel = await client.channels.fetch(CHANNEL_ID);
      await channel.send(MESSAGE);
      console.log(`[${chalk.green.bold("+")}] Message sent successfully`);
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  }, 35 * 60 * 1000);
})

client.login(Authorization);
