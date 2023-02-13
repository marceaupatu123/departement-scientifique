const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('Commande de maintenance permettant de mettre en place des commandes'),
	async execute(interaction) {
		const FirstButton = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
				.setCustomId('setupconseil')
				.setLabel('🎓 Setup Réunion')
				.setStyle(ButtonStyle.Primary),
			)
            .addComponents(
				new ButtonBuilder()
				.setCustomId('setupexp')
				.setLabel('🧪 Setup Expérience')
				.setStyle(ButtonStyle.Primary),
			)
            .addComponents(
				new ButtonBuilder()
				.setCustomId('setuppsy')
				.setLabel('🧠 Setup Psy')
				.setStyle(ButtonStyle.Primary),
			)
            .addComponents(
				new ButtonBuilder()
				.setCustomId('setupsuggestions')
				.setLabel('💟 Setup Suggestions')
				.setStyle(ButtonStyle.Primary),
			);

		const ConfigEmbed = new EmbedBuilder()
			.setColor("#91ff00")
			.setTitle('🛠️ | Configuration des Commandes')
			.setThumbnail("https://images.freeimages.com/fic/images/icons/577/refresh_cl/256/install1.png")
			.setDescription("Ce panel n'est utilisable que par <@284036155928870912>.\n Oh mon créateur adoré ! Choisis ce que tu veux mettre en place sur ce magnifique serveur.")
		const reply = interaction.reply({ content: '', ephemeral: true, embeds: [ConfigEmbed], components: [FirstButton] });
        button = await reply.awaitMessageComponent({ time: 60000 })
        if (button.CustomId == "setupconseil") {
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
        }
	},
};