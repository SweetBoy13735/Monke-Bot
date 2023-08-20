/*
 * Represents the core of the bot.
 * When the main program starts, this script is responsible for handling the bot's main functions.
 * @author Ramone Graham
 */
// IMPORTS
// Node modules
require("dotenv").config();

const FileSystem = require("node:fs");
const Path = require("node:path");
const { Client, GatewayIntentBits, Collection, Events } = require("discord.js");

// CODE BODY
// Create a new Discord gateway client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Command handling
client.commands = new Collection();

// Grab all the command folders and loop through them,...
const foldersPath = Path.join(__dirname, "commands"), commandFolders = FileSystem.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// then grab all the command files and loop through those,...
	const commandsPath = Path.join(foldersPath, folder), commandFiles = FileSystem.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

	for (const file of commandFiles) {
		// then compile the command data for execution.
		const filePath = Path.join(commandsPath, file), command = require(filePath);

		if ("data" in command && "execute" in command) client.commands.set(command.data.name, command);
		else console.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Execute this handler once when the client is ready
client.once(Events.ClientReady, readyClient => { console.log(`Ready! Logged-in as ${readyClient.user.tag}.`); });

// Log-in to Discord using the bot token
client.login(process.env.DISCORD_TOKEN);
