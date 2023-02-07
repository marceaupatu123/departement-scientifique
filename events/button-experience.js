const { Events, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const { modal } = require("../modals/experience.js")
const { Superviseur, SalonExpérience } = require("../json/config.json")
const { Allowed, NotAllowed, Delais } = require("../json/messages.json")
const { menuderefus } = require("../SelectMenu/Experience")
module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction) {
		if (!interaction.isButton() || !(interaction.channelId == SalonExpérience)) return;
		if (interaction.customId == "primary") {
			return await interaction.showModal(modal);
		}
		if (!interaction.member.roles.cache.some(role => role.id == Superviseur)) return interaction.reply({ content: NotAllowed, ephemeral: true})

		const embed = EmbedBuilder.from(interaction.message.embeds[0]).spliceFields(-1, 1)
		if (interaction.customId == "success") {
			embed.addFields({ name: "📁 | Informations sur la demande", value: "**Statut:** ✅ | Validé\n **Opérateur:** " + `${interaction.member}`, inline: false })
			interaction.reply({ content: Allowed, ephemeral: true })
		} else {
			const reply = await interaction.reply({ content: "Veuillez choisir une raison de refus :", ephemeral: true, components: [menuderefus]})
			let menuinteraction = null
			try { menuinteraction = await reply.awaitMessageComponent({time: 60000}) } catch(e) {return interaction.editReply({content: Delais, ephemeral: true, components: []})}
			const Raison = menuinteraction.values[0] == "PCS" ? "Votre expérience pose un risque quant à l\'application des Procédures de Confinements Spéciales." : menuinteraction.values[0] == "ethic" ? "Votre expérience pose un problème d\'éthique, veuillez vous approcher d'un superviseur si vous estimez que l\'expérience devrait tout de même être effectuée." : menuinteraction.values[0] == "notusefull" ? "Votre expérience ne permet pas spécialement à la fondation d\'en apprendre plus sur les capacités anormales du SCP, cela peut-être en raison de la thèse pas assez intéréssante ou bien l\'expérience à déjà été effectuée." : menuinteraction.values[0] == "expensive" ? "Votre expérience est trop couteuse en ressources par rapport aux informations que nous pouvons potentiellement en tirer." : null
		    embed.addFields({ name: "📁 | Informations sur la demande", value: `**Statut:** ❌ | Refusé\n **Opérateur:** ${interaction.member}\n **Raison:** ${Raison}`, inline: false })
			menuinteraction.reply({ content: Allowed, ephemeral: true })
		}
		interaction.message.edit({ embeds: [embed], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('primary').setLabel('📩 Envoyer une demande').setStyle(ButtonStyle.Primary),)] });
	}
}
