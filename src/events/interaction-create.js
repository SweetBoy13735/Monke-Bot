/*
 * Respresents the "interactionCreate" event handler of the bot.
 * When this event is invoked, this script is responsible for handling user interactons.
 * @author Ramone Graham
 */
// IMPORTS
const { Events: { InteractionCreate }, InteractionType: { ApplicationCommand } } = require("discord.js");

// CODE BODY
/**
 * Handles any application commands.
 * @param {import("discord.js").CommandInteraction} interaction The command interaction context.
 */
async function handleAppCommand(interaction) {
	const command = interaction.client.commands.get(interaction.commandName);

	if (command) try { await command.execute(interaction); } catch (error) {
		handleError(`An error occurred whilst executing "${interaction.commandName}"`, error.stack, interaction);
	} else {
		const content = `Command "${interaction.commandName}" not found.`;

		console.warn(content);

		await interaction.reply({ content, ephemeral: true });
	}
}

/**
 * Logs thrown errors to the console and notifies the Discord user.
 * @param {String} content The message content.
 * @param {String} errorStack The error stack.
 * @param {import("discord.js").Interaction} interaction The interaction context.
 */
async function handleError(content, errorStack, interaction) {
	const message = { content, ephemeral: true };

	if (interaction.replied || interaction.deferred) await interaction.editReply(message);
	else await interaction.reply(message);

	console.error(`${content} - ${errorStack}`);
}

// EXPORTS
module.exports = {
	name: InteractionCreate,

	/**
	 * Executes the event handler.
	 * @param {import("discord.js").BaseInteraction} interaction The interaction that was created.
	 */
	async execute(interaction) {
		switch (interaction.type) {
		case ApplicationCommand:
			handleAppCommand(interaction);

			break;
		default:
			break;
		}
	}
};
