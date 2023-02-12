require("dotenv").config()
const { Events, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const { Allowed } = require("../json/messages.json")
const SalonExperienceValide = process.env.SalonExperienceValide, Superviseur = process.env.Superviseur
const { split } = require("../functions/database")
const axios = require('axios');
module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(modalinteraction) {
		if (!modalinteraction.isModalSubmit() || !(modalinteraction.customId == "exp")) return;
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('success')
					.setLabel('✅ Autoriser')
					.setStyle(ButtonStyle.Success),
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId('denied')
					.setLabel('🗑️ Refuser')
					.setStyle(ButtonStyle.Danger),
			);
			modalinteraction.deferReply({ephemeral: true })
			let reply = await axios.get(`https://www.googleapis.com/customsearch/v1?q=SCP-${modalinteraction.fields.getTextInputValue('scp')} png&searchType=image&cx=463e7e2a605284f03&key=AIzaSyDMRUKEOQ9I2UZ1ktQc19lzukZnExajfbM&imgSize=medium`)
			reply = reply.data.items
    		reply.forEach(element => {if (element.link.includes("https://i.ytimg.com/v")) {reply.splice(reply.indexOf(element), 1)}});
		const embed = new EmbedBuilder()
			.setColor("#03fc90")
			.setTitle('Demande d\'Experience')
			.setThumbnail(reply[0].link)
			.addFields(
				{ name: '📋 | Informations sur le Scientifique', value: `**Nom:** ${modalinteraction.user}` + "\n**Grade:** " + modalinteraction.fields.getTextInputValue('grade'), inline: true },
				{ name: '🧪 | Description de l\'Experience', value: "**SCP:** " + modalinteraction.fields.getTextInputValue('scp') + "\n**Unité et Matériel:** " + modalinteraction.fields.getTextInputValue('unité') + "\n**But:** " + modalinteraction.fields.getTextInputValue('but'), inline: false },
				{ name: "📁 | Informations sur la demande", value: "**Statut:** ⚠️ | En Attente de Validation", inline: false }
			)
		await modalinteraction.guild.channels.cache.get(SalonExperienceValide).send({ content: `<@&${Superviseur}>${modalinteraction.member}`, ephemeral: false, embeds: [embed], components: [row] });
		await modalinteraction.editReply({ content: Allowed, ephemeral: true })
	}
}