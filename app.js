const axios = require("axios");
const express = require('express');
const server = express();

server.all("/", (req, res) => res.send(`<meta http-equiv="refresh" content="0; URL=https://passwordpassword.online"/>`));
server.listen(process.env.PORT ?? 3000, () => {
    console.log("clan-advertisements | PSION");
    console.log("\nThe webserver is ready.\n");
});

// Load token from environment variables
const Authorization = process.env.Authorization;

// Define your variables
const SOURCE_CHANNEL_ID = "1333272333359517818";
const TARGET_CHANNEL_ID = "1245731705113940089";
const SOURCE_MESSAGE_ID = "1365769281085767700";
const DISCORD_API = "https://discord.com/api/v10";

// Set up headers
const headers = {
  Authorization: Authorization,
  "Content-Type": "application/json",
};

// Payload for forwarding the message
const payload = {
  message_reference: {
    type: 1, // FORWARD type
    message_id: SOURCE_MESSAGE_ID,
    channel_id: SOURCE_CHANNEL_ID,
  },
};

// Function to convert seconds into a human-readable time format (HH:MM:SS)
function secondsToTime(seconds) {
  let hours = Math.floor(seconds / 3600); // Convert to hours
  let minutes = Math.floor((seconds % 3600) / 60); // Convert the remaining seconds to minutes
  return `${hours} hours, ${minutes} minutes`;
}

// Function to forward the message
async function forwardMessage() {
  try {
    const response = await axios.post(`${DISCORD_API}/channels/${TARGET_CHANNEL_ID}/messages`, payload, { headers });
    console.log("✅ Message forwarded successfully\n", response.data);
  } catch (error) {
    if (error.response && error.response.data && error.response.data.code === 20016) {
      console.log(error.response.data)
      // Slowmode rate limit reached, retry after specified time
      const retryAfter = error.response.data.retry_after; // Time in seconds
      console.error(`❌ Retrying in ${secondsToTime(retryAfter)}.`); // Log in human-readable format
      // Retry after the retryAfter time in seconds
      setTimeout(forwardMessage, retryAfter * 1000); // Convert to milliseconds for setTimeout
      return;
    } else {
      console.error("❌ Error forwarding message:\n", error.response ? error.response.data : error.message);
    }
  }
    forwardMessage();
}

// Initial run (optional: remove if you don't want an immediate send)
forwardMessage();
