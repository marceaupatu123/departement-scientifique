const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("spawnexp")
    .setDescription("Setup les exps!"),
  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("expbutton")
        .setLabel("📩 Envoyer une demande")
        .setStyle(ButtonStyle.Primary)
    );

    const embed = new EmbedBuilder()
      .setColor("#91ff00")
      .setTitle("🧪 | Demande d'Autorisation d'Experience")
      .setDescription(
        "Cliquez sur le bouton ci-dessous pour envoyer une demande d'autorisation, tout abus sera sanctionné."
      );
    interaction.channel.send({
      content: "",
      ephemeral: false,
      embeds: [embed],
      components: [row],
    });
  },
};
