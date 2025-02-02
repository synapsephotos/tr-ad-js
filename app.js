const axios = require("axios");
const express = require("express");
const server = express();

server.all("/", (req, res) => res.send(`<meta http-equiv="refresh" content="0; URL=https://passwordpassword.online"/>`));
server.listen(process.env.PORT ?? 3000, () => {
    console.log("clan-advertisements | PSION");
    console.log("\nThe webserver is ready.\n");
});

// Load token from environment variables
const Authorization = process.env.Authorization;

// Define variables
const SOURCE_CHANNEL_ID = "1333272333359517818";
const TARGET_CHANNEL_ID = "1245731705113940089";
let SOURCE_MESSAGE_ID = "1335721769692037192"; // This may be replaced dynamically
const DISCORD_API = "https://discord.com/api/v10";

// Set up headers
const headers = {
  Authorization: Authorization,
  "Content-Type": "application/json",
};

// Function to convert seconds into a human-readable time format (HH:MM:SS)
function secondsToTime(seconds) {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  return `${hours} hours, ${minutes} minutes`;
}

// Function to check if the source message exists
async function checkSourceMessage() {
  try {
    await axios.get(`${DISCORD_API}/channels/${SOURCE_CHANNEL_ID}/messages/${SOURCE_MESSAGE_ID}`, { headers });
    return true; // Message exists
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log("⚠️ Source message not found, searching for 'Psion'...");
      return false; // Message not found
    }
    console.error("❌ Error checking source message:", error.response ? error.response.data : error.message);
    throw error; // Unknown error
  }
}

// Function to search for "Psion" in the source channel
async function findPsionMessage() {
  try {
    const response = await axios.get(`${DISCORD_API}/channels/${SOURCE_CHANNEL_ID}/messages?limit=10`, { headers });
    const messages = response.data;
    const psionMessage = messages.find(msg => msg.content.includes("Psion"));

    if (psionMessage) {
      console.log(`✅ Found fallback message: ${psionMessage.id}`);
      return psionMessage.id;
    } else {
      console.log("⚠️ No messages containing 'Psion' found.");
      return null;
    }
  } catch (error) {
    console.error("❌ Error searching for 'Psion' message:", error.response ? error.response.data : error.message);
    return null;
  }
}

// Function to forward the message
async function forwardMessage() {
  try {
    const messageExists = await checkSourceMessage();

    if (!messageExists) {
      const newSourceMessageId = await findPsionMessage();
      if (newSourceMessageId) {
        SOURCE_MESSAGE_ID = newSourceMessageId; // Update message ID
      } else {
        console.error("❌ No valid source message found. Aborting.");
        return;
      }
    }

    // Payload for forwarding the message
    const payload = {
      message_reference: {
        type: 1, // FORWARD type
        message_id: SOURCE_MESSAGE_ID,
        channel_id: SOURCE_CHANNEL_ID,
      },
    };

    const response = await axios.post(`${DISCORD_API}/channels/${TARGET_CHANNEL_ID}/messages`, payload, { headers });
    console.log("✅ Message forwarded successfully\n", response.data);
  } catch (error) {
    if (error.response && error.response.data && error.response.data.code === 20016) {
      const retryAfter = error.response.data.retry_after;
      console.error(`❌ Slowmode limit reached. Retrying in ${secondsToTime(retryAfter)}.`);
      setTimeout(forwardMessage, retryAfter * 1000);
    } else {
      console.error("❌ Error forwarding message:\n", error.response ? error.response.data : error.message);
    }
  }
  forwardMessage();
}

// Initial run
forwardMessage();