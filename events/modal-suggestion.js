require("dotenv").config()
const { Events, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const { modal } = require("../modals/suggestion.js")
module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(modalinteraction) {
		if (modalinteraction.customId == "suggestion") return await modalinteraction.showModal(modal)
        if (!modalinteraction.isModalSubmit() || !(modalinteraction.customId == "suggestionmodal")) return;
			const channel = modalinteraction.client.guilds.cache.get("606939452425633802").channels.cache.get("1071892702398005360")
			const embed = new EmbedBuilder()
				.setColor("#f2f20c")
				.setTitle(`Suggestion de ${modalinteraction.user.tag}`)
				.setThumbnail('https://icones.pro/wp-content/uploads/2022/01/icone-de-commentaires-verte.png')
				.setDescription(modalinteraction.fields.getTextInputValue("descriptionsuggestion"))
		
		await channel.send({ content: '', ephemeral: false, embeds: [embed]});
		await modalinteraction.reply({ content: '', ephemeral: false});
    }
}