const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('spawnpsy')
		.setDescription('Setup les Psys!'),
	async execute(interaction) {
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
				.setCustomId('psybutton')
				.setLabel('📩 Envoyer une demande')
				.setStyle(ButtonStyle.Primary),
			);

		const embed = new EmbedBuilder()
			.setColor("#ff00ee")
			.setTitle('🧠 | Demande de rendez-vous psychologique')
			.setDescription("Les psychologues sont tenus au **secret professionnel**, tout ce qui est dit durant le rendez-vous ne pourra sortir de ce dernier sauf en cas de demande judiciaire, moyennant des conditions très strictes.\nCliquez sur le bouton ci-dessous pour envoyer une demande d'autorisation, tout abus sera sanctionné.")
		interaction.channel.send({ content: '', ephemeral: false, embeds: [embed], components: [row] });
	},
};