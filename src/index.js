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
const { Client, GatewayIntentBits: { Guilds, GuildMessages, DirectMessages, MessageContent }, Collection } = require("discord.js");

// CODE BODY
// Create a new Discord gateway client instance
const client = new Client({ intents: [Guilds, GuildMessages, DirectMessages, MessageContent] });

// Command handling
client.commands = new Collection();

// Grab all the command folders and loop through them,...
const commandfoldersPath = Path.join(__dirname, "commands"), commandFolders = FileSystem.readdirSync(commandfoldersPath);

for (const folder of commandFolders) {
	// then grab all the command files and loop through those,...
	const commandsPath = Path.join(commandfoldersPath, folder), commandFiles = FileSystem.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

	for (const file of commandFiles) {
		// then compile the command data for execution.
		const filePath = Path.join(commandsPath, file), command = require(filePath);

		if ("data" in command && "execute" in command) client.commands.set(command.data.name, command);
		else console.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Event handling
// Grab all the event files and loop through them,...
const eventsPath = Path.join(__dirname, "events"), eventFiles = FileSystem.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
	// then register the event on the client.
	const filePath = Path.join(eventsPath, file), event = require(filePath);

	if (event.once) client.once(event.name, (...args) => event.execute(...args));
	else client.on(event.name, (...args) => event.execute(...args));
}

// Log-in to Discord using the bot token
client.login(process.env.DISCORD_TOKEN);
