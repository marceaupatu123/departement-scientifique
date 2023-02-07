const { Events, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const { modal } = require("../modals/psy.js")
const { SalonPsy } = require("../json/config.json")

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction) {
		if (!interaction.isButton() || !(interaction.channelId == SalonPsy)) return;
		if (interaction.customId == "primary") {

			await interaction.showModal(modal)
			return console.log(interaction);
		}
		interaction.message.edit({ embeds: [embed], components: [] });
	}
}
