require("dotenv").config()
const { Events, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const { modal } = require("../modals/psy.js")
const SalonPsy = process.env.SalonPsy

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction) {
		if (!interaction.isButton() || !(interaction.customId == "psybutton")) return;
			await interaction.showModal(modal)
			return console.log(interaction);
	}
}
