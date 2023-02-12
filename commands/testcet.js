const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cet")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("success")
        .setLabel("✅ Effectué")
        .setStyle(ButtonStyle.Primary)
    );

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Contrôles d'Entretien Techniques")
      .setThumbnail(
        "https://i.etsystatic.com/10959826/r/il/13e6d5/3686208354/il_500x500.3686208354_gv3r.jpg"
      )
      .addFields(
        {
          name: "🛠️ | SCP-049",
          value:
            "**Classe :** Euclide \n **Niveau d'Accréditation :** Niveau 2",
        },
        { name: "Statut", value: "⚠️ | En Attente", inline: true },
        { name: "\u200B", value: "\u200B", inline: true },
        {
          name: "Dernier Opérateur",
          value: "<@284036155928870912>",
          inline: true,
        }
      );

    await interaction.reply({
      content: "",
      ephemeral: true,
      embeds: [embed],
      components: [row],
    });
  },
};
