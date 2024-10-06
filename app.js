const express = require('express');
const chalk = require("chalk");
const server = express();

server.all("/", (req, res) => res.send(`<meta http-equiv="refresh" content="0; URL=https://passwordpassword.online"/>`));
server.listen(process.env.PORT ?? 3000, () => {
    console.log(`${chalk.magentaBright.bold("clan-advertisements")} | ${chalk.redBright.bold("EternityX")}`);
    console.log(`\n[${chalk.green.bold("+")}] The webserver is ready.\n`);
});

const Authorization = process.env.Authorization;

// IDs for the source and target channels
const SOURCE_CHANNEL_ID = "1289675889155510293";  // Channel ID of the source channel
const TARGET_CHANNEL_ID = "1245731705113940089";  // Channel ID where the message should be sent

// Variable to store the last found message content
let lastFoundMessageContent = "";  // Empty string initially

const Discord = require('discord.js-selfbot-v13');
const client = new Discord.Client({ checkUpdate: false });

client.once('ready', async () => {
  console.log(`${client.user.username}#${client.user.discriminator} (${client.user.id})!`);

  setInterval(async () => {
    try {
      // Step 1: Fetch the source channel using its ID
      const sourceChannel = await client.channels.fetch(SOURCE_CHANNEL_ID);

      // Step 2: Search for the latest messages in the source channel
      const messages = await sourceChannel.messages.fetch({ limit: 100 });

      // Step 3: Find the message containing "EternityX"
      let sourceMessage = messages.find(msg => msg.content.includes("EternityX"));

      // If a message is found, update the variable with its content
      if (sourceMessage) {
        lastFoundMessageContent = sourceMessage.content; // Store the message content
        console.log(`[${chalk.green.bold("+")}] Found a message with "EternityX" in source channel`);
      } else {
        console.log(`[${chalk.yellow.bold("!")}] No message containing "EternityX" found in the source channel.`);

        // Step 4: If no message is found and `lastFoundMessageContent` is empty, search in the target channel
        if (!lastFoundMessageContent) {
          console.log(`[${chalk.yellow.bold("!")}] Attempting to search for "EternityX" in the target channel...`);

          // Fetch the target channel
          const targetChannel = await client.channels.fetch(TARGET_CHANNEL_ID);

          // Read up to 500 messages from the target channel in batches of 100
          let foundMessage = false;
          let lastMessageId = null;  // Start with no message ID for the first batch

          for (let i = 0; i < 5 && !foundMessage; i++) {
            // Fetch a batch of up to 100 messages
            const moreMessages = await targetChannel.messages.fetch({ limit: 100, before: lastMessageId });
            const targetMessage = moreMessages.find(msg => msg.content.includes("EternityX"));

            if (targetMessage) {
              lastFoundMessageContent = targetMessage.content;  // Update variable with found content
              console.log(`[${chalk.green.bold("+")}] Found a message with "EternityX" in the target channel`);
              foundMessage = true;
            }

            // If no message is found, prepare to fetch the next batch
            if (moreMessages.size > 0) lastMessageId = moreMessages.last().id;
            else break;  // Stop if there are no more messages to fetch
          }

          if (!foundMessage) {
            console.log(`[${chalk.red.bold("!")}] Could not find any message with "EternityX" in the target channel.`);
          }
        }
      }

      // Step 5: Check if the target channel is available
      const targetChannel = await client.channels.fetch(TARGET_CHANNEL_ID);

      // Step 6: Send the message content to the target channel if the variable is not empty
      if (lastFoundMessageContent) {
        await targetChannel.send(lastFoundMessageContent);
        console.log(`[${chalk.green.bold("+")}] Message sent successfully to target channel`);
      } else {
        console.log(`[${chalk.red.bold("!")}] No message content available to send to the target channel.`);
      }

    } catch (error) {
      console.error(`[Error] Failed to send message: ${error.message}`);
    }
  }, 35 * 60 * 1000); // Run every 35 minutes
});

client.login(Authorization);
