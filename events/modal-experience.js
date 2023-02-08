require("dotenv").config()
const { Events, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const { modal } = require("../modals/experience.js")
const { Allowed } = require("../json/messages.json")
const SalonExperienceValide = process.env.SalonExperienceValide

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
			const embed = new EmbedBuilder()
				.setColor("#03fc90")
				.setTitle('Demande d\'Experience')
				.setThumbnail('https://cdn-icons-png.flaticon.com/512/123/123793.png')
				.addFields(
					{ name: '📋 | Informations sur le Scientifique', value: `**Nom:** ${modalinteraction.user}` + "\n**Grade:** " + modalinteraction.fields.getTextInputValue('grade'), inline: true },
					{ name: '🧪 | Description de l\'Experience', value: "**SCP:** " + modalinteraction.fields.getTextInputValue('scp') + "\n**Unité et Matériel:** " + modalinteraction.fields.getTextInputValue('unité') + "\n**But:** " + modalinteraction.fields.getTextInputValue('but'), inline: false },
					{ name: "📁 | Informations sur la demande", value: "**Statut:** ⚠️ | En Attente de Validation", inline: false }
				)
		await modalinteraction.guild.channels.cache.get(SalonExperienceValide).send({ content: '', ephemeral: false, embeds: [embed], components: [row] });
		await modalinteraction.reply({ content: Allowed, ephemeral: true })
    }
}