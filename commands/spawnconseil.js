const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('spawnconseil')
		.setDescription('Setup les conseil!'),
	async execute(interaction) {
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
				.setCustomId('conseildefou')
				.setLabel('🎓 Commencer la réunion')
				.setStyle(ButtonStyle.Primary),
			);

		const embed = new EmbedBuilder()
			.setColor("#91ff00")
			.setTitle('🤝 | Réunion des Superviseurs')
			.setThumbnail("https://cdn-icons-png.flaticon.com/512/3712/3712250.png")
			.setDescription("Cliquez sur le bouton ci-dessous pour lancer la réunion de superviseur.\n Attention il n'est plus possible de faire marche arrière après le début d'une réunion!\n Tout abus sera **lourdement sanctionné**.")
		interaction.channel.send({ content: '', ephemeral: false, embeds: [embed], components: [row] });
	},
};