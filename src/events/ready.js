/*
 * Respresents the "ready" event handler of the bot.
 * When this event is invoked, this script is responsible for handling post-log-in functions.
 * @author Ramone Graham
 */
// IMPORTS
// Node modules
const { Events: { ClientReady } } = require("discord.js");

// Project modules
const { guildIDs, readyMessage } = require("../config.json");

// EXPORTS
module.exports = {
	name: ClientReady,
	once: true,

	/**
	 * Executes the event handler.
	 * @param {import("discord.js").Client} client The client instance emitting the event.
	 */
	async execute(client) {
		if (guildIDs.length > 0) {
			// Loop through the guild IDs and map the objects to an array.
			const guilds = guildIDs.map(guildID => client.guilds.cache.get(guildID));

			// For each guild, send a ready message if the guild is available and has a system channel.
			guilds.forEach(async ({ name, available, systemChannel }) => {
				try {
					if (available && systemChannel) await systemChannel.send(readyMessage);
				} catch (error) {
					console.error(`An error occurred posting to "${name}": ${error.message}`);
				}
			});
		}

		console.log(`Ready! Logged-in as ${client.user.tag}.`);
	}
};
