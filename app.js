const express = require('express');
const chalk = require("chalk");
const server = express();
server.all("/", (req, res) => res.send(`<meta http-equiv="refresh" content="0; URL=https://retinalogic.000webhostapp.com/api/"/>`));
server.listen(process.env.PORT ?? 3000, () => {
    console.log(`${chalk.cyanBright.bold("clan-advertisements")} | ${chalk.greenBright.bold("The Revengeance")}`);

  console.log(`\n[${chalk.green.bold("+")}] The webserver is ready.\n`);
});

const Authorization = process.env.Authorization
const CHANNEL_ID = "1245731705113940089"
const MESSAGE = "🌙 The Revengeance | NA Clan 🇺🇸\nRequirements:  Follow the upgrade requirements for the week, have 1k+ wins or 50k+ RAP\nStats: Coin Earning - MAX | Welfare - MAX | Luck - FIVE | Size FIVE | 3 upgrades away from Quantum Arena. 👾\n-# Mainly looking for AFKers or players w tokens to spare, DM <@992221688362192956> to apply! ^^"

const Discord = require('discord.js-selfbot-v13');
const client = new Discord.Client({checkUpdate: false});

client.once('ready', async () => {
  console.log(`${client.user.username}#${client.user.discriminator} (${client.user.id})!`);

  setInterval(async () =>{
    try {
      const channel = await client.channels.fetch(CHANNEL_ID);
      
      channel.send(MESSAGE);
      console.log(`[${chalk.green.bold("+")}] Message sent successfully.`);
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  }, 22 * 60 * 1000);
})

client.login(Authorization);