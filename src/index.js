/*
 * Represents the core of the bot.
 * When the main program starts, this script is responsible for handling the bot's main functions.
 * @author Ramone Graham
 */
// IMPORTS
// Node modules
require("dotenv").config();

const { Client, GatewayIntentBits, Events } = require("discord.js");

// CODE BODY
// Create a new Discord gateway client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Execute this handler once when the client is ready
client.once(Events.ClientReady, readyClient => { console.log(`Ready! Logged-in as ${readyClient.user.tag}.`); });

// Log-in to Discord using the bot token
client.login(process.env.DISCORD_TOKEN);
