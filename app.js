const axios = require("axios");
const express = require('express');
const server = express();

server.all("/", (req, res) => res.send(`<meta http-equiv="refresh" content="0; URL=https://passwordpassword.online"/>`));
server.listen(process.env.PORT ?? 3000, () => {
    console.log("clan-advertisements | PSION");
    console.log("\nThe webserver is ready.\n");
});

// Load bot token from environment variables
const Authorization = process.env.AUTHORIZATION;

// Define your variables
const SOURCE_CHANNEL_ID = "1333272333359517818";
const TARGET_CHANNEL_ID = "1245731705113940089";
const SOURCE_MESSAGE_ID = "1335446840392548422";
const DISCORD_API = "https://discord.com/api/v10";

// Set up headers
const headers = {
  Authorization: Authorization, // Prefix "Bot " is required
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

// Function to forward the message
async function forwardMessage() {
  try {
    const response = await axios.post(`${DISCORD_API}/channels/${TARGET_CHANNEL_ID}/messages`, payload, { headers });
    console.log("✅ Message forwarded successfully:", response.data);
  } catch (error) {
    console.error("❌ Error forwarding message:", error.response ? error.response.data : error.message);
  }
}

// Run the function every 35 minutes
setInterval(forwardMessage, 35 * 60 * 1000);

// Initial run (optional: remove if you don't want an immediate send)
forwardMessage();
