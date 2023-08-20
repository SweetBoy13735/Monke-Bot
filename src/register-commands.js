/*
 * Represents the command registration script of the bot.
 * When this side program starts, this script is responsible for compiling the bot's commands and deploying them to the Discord API.
 * @author Ramone Graham
 */
// IMPORTS
// Node modules
require("dotenv").config();

const FileSystem = require("node:fs");
const Path = require("node:path");
const { REST, Routes } = require("discord.js");

// Project modules
const { guilds } = require("./config.json");

// CODE BODY
const commands = [];

// Grab all the command folders and loop through them,...
const foldersPath = Path.join(__dirname, "commands"), commandFolders = FileSystem.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// then grab all the command files and loop through those,...
	const commandsPath = Path.join(foldersPath, folder), commandFiles = FileSystem.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

	for (const file of commandFiles) {
		// then compile the command data for registration.
		const filePath = Path.join(commandsPath, file), command = require(filePath);

		if ("data" in command && "execute" in command) commands.push(command.data.toJSON());
		else console.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Create a new Discord REST client instance
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Register the commands to the API
(async function() {
	try {
		const { id: appID } = await rest.get(Routes.currentApplication());

		if (guilds.length > 0) {
			console.log(`Registering ${commands.length} commands in ${guilds.length} guild(s)...`);

			for (const guildID of guilds) {
				const { name: guildName } = await rest.get(Routes.guild(guildID)), data = await rest.put(Routes.applicationGuildCommands(appID, guildID), { body: commands });

				console.log(`Registered ${data.length} commands in "${guildName}".`);
			}
		} else {
			console.log(`Registering ${commands.length} commands globally...`);

			const data = await rest.get(Routes.applicationCommands(appID));

			console.log(`Registered ${data.length} commands.`);
		}

		console.log("Registration successful!");
	} catch (error) {
		console.error(error);
	}
})();
