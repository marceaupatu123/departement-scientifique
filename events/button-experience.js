const { Events, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const { modal } = require("../modals/experience.js")
const Superviseur = process.env.Superviseur
const SalonExpérience = process.env.SalonExperience, SalonExperienceValide = process.env.SalonExperienceValide
const { Allowed, NotAllowed, Delais } = require("../json/messages.json")
const { menuderefus } = require("../SelectMenu/Experience")
const DisabledButtons = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('✅ Autoriser').setCustomId('success').setStyle(ButtonStyle.Success).setDisabled(true),).addComponents(new ButtonBuilder().setCustomId('denied').setLabel('🗑️ Refuser').setDisabled(true).setStyle(ButtonStyle.Danger),);
const EnabledButtons = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('✅ Autoriser').setCustomId('success').setStyle(ButtonStyle.Success).setDisabled(false),).addComponents(new ButtonBuilder().setCustomId('denied').setLabel('🗑️ Refuser').setDisabled(false).setStyle(ButtonStyle.Danger),);

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction) {
		if (!interaction.isButton() || !(interaction.channelId == SalonExpérience || interaction.channelId == SalonExperienceValide)) return;
		if (interaction.customId == "expbutton") { return await interaction.showModal(modal); } // Boutton envoi exp
		if (!interaction.member.roles.cache.some(role => role.id == Superviseur)) return interaction.reply({ content: NotAllowed, ephemeral: true })

		let embed = EmbedBuilder.from(interaction.message.embeds[0])
		interaction.message.edit({ embeds: [embed], components: [DisabledButtons] })
		if (interaction.customId == "success") { // Button Accepté

			embed.addFields({ name: "📁 | Informations sur la demande", value: "**Statut:** ✅ | Validé\n **Opérateur:** " + `${interaction.member}`, inline: false })
			interaction.reply({ content: Allowed, ephemeral: true })
		} else { // Boutton Refus
			const reply = await interaction.reply({ content: "Veuillez choisir une raison de refus :", ephemeral: true, components: [menuderefus], fetchReply: true})
			let menuinteraction, Raison
			try {
				menuinteraction = await reply.awaitMessageComponent({ time: 60000 })
				Raison = menuinteraction.values[0] == "PCS" ? "Votre expérience pose un risque quant à l\'application des Procédures de Confinements Spéciales." : menuinteraction.values[0] == "ethic" ? "Votre expérience pose un problème d\'éthique, veuillez vous approcher d'un superviseur si vous estimez que l\'expérience devrait tout de même être effectuée." : menuinteraction.values[0] == "notusefull" ? "Votre expérience ne permet pas spécialement à la fondation d\'en apprendre plus sur les capacités anormales du SCP, cela peut-être en raison de la thèse pas assez intéréssante ou bien l\'expérience à déjà été effectuée." : menuinteraction.values[0] == "expensive" ? "Votre expérience est trop couteuse en ressources par rapport aux informations que nous pouvons potentiellement en tirer." : null
			} catch (e) { interaction.message.edit({ embeds: [embed], components: [EnabledButtons] }); return interaction.editReply({ content: Delais, ephemeral: true, components: [] }) }
				await interaction.deleteReply()
			embed.addFields({ name: "📁 | Informations sur la demande", value: `**Statut:** ❌ | Refusé\n **Opérateur:** ${interaction.member}\n **Raison:** ${Raison}`, inline: false })
			menuinteraction.reply({ content: Allowed, ephemeral: true })
		}
		embed = embed.spliceFields(-2, 1)
		interaction.message.edit({ embeds: [embed], components: [EnabledButtons] });
		//interaction.message.edit({ embeds: [embed], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('expbutton').setLabel('📩 Envoyer une demande').setStyle(ButtonStyle.Primary),)] });
	}
}
