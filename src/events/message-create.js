/*
 * Respresents the "messageCreate" event handler of the bot.
 * When this event is invoked, this script is responsible for handling messages sent.
 * @author Ramone Graham
 */
// IMPORTS
const { Events: { MessageCreate } } = require("discord.js");

// EXPORTS
module.exports = {
	name: MessageCreate,

	/**
	 * Executes the event handler.
	 * @param {import("discord.js").Message} message The message that was created.
	 */
	async execute(message) {
		try {
			if (!message.author.bot && message.content.toLowerCase().includes("mmm")) await message.reply("Monke");
		} catch (error) {
			const { guild, channel } = message;

			console.error(`An error occurred trying to reply in "${guild.name} #${channel.name}" - ${error.message}`);
		}
	}
};
