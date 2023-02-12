const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("spawnsuggestions")
    .setDescription("Setup les suggestions!"),
  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("suggestion")
        .setLabel("💟 Envoyer une suggestion")
        .setStyle(ButtonStyle.Primary)
    );

    const embed = new EmbedBuilder()
      .setColor("#0e1e8a")
      .setTitle("💌 | Envoyer des suggestions")
      .setThumbnail(
        "https://www.iconpacks.net/icons/2/free-feedback-icon-2949-thumb.png"
      )
      .setDescription(
        "Cliquez sur le bouton ci-dessous pour proposer une suggestion pour le robot discord.\nTout abus sera sanctionné."
      );
    interaction.channel.send({
      content: "",
      ephemeral: false,
      embeds: [embed],
      components: [row],
    });
  },
};
