const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription(
      "Commande de maintenance permettant de mettre en place des commandes"
    ),
  async execute(interaction) {
    const FirstButton = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("setupconseil")
          .setLabel("🎓 Setup Réunion")
          .setStyle(ButtonStyle.Primary)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("setupexp")
          .setLabel("🧪 Setup Expérience")
          .setStyle(ButtonStyle.Primary)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("setuppsy")
          .setLabel("🧠 Setup Psy")
          .setStyle(ButtonStyle.Primary)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("setupsuggestions")
          .setLabel("💟 Setup Suggestions")
          .setStyle(ButtonStyle.Primary)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("page2")
          .setLabel("⏩ Page 2")
          .setStyle(ButtonStyle.Primary)
      );

    const SecondButton = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("setupabsences")
          .setLabel("🥥 Setup Abscences")
          .setStyle(ButtonStyle.Primary)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("maintenance")
          .setLabel("⚒️ Mode Maintenance")
          .setStyle(ButtonStyle.Primary)
      );

    const ConfigEmbed = new EmbedBuilder()
      .setColor("#91ff00")
      .setTitle("🛠️ | Configuration des Commandes")
      .setThumbnail(
        "https://images.freeimages.com/fic/images/icons/577/refresh_cl/256/install1.png"
      )
      .setDescription(
        "Ce panel n'est utilisable que par <@284036155928870912>.\n Oh mon créateur adoré ! Choisis ce que tu veux mettre en place sur ce magnifique serveur."
      );
    const reply = await interaction.reply({
      content: "",
      ephemeral: true,
      embeds: [ConfigEmbed],
      components: [FirstButton],
    });
    let button = await reply.awaitMessageComponent({ time: 60000 });
    let row = null;
    let embed = null;
    let pagechosen = null;
    /**
     * SETUP DES BOUTTONS PAGES
     */
    if (button.customId === "page2") {
      button.update({
        content: "",
        embeds: [ConfigEmbed],
        components: [SecondButton],
      });
      pagechosen = true;
    }
    if (pagechosen) {
      button = await reply.awaitMessageComponent({ time: 60000 });
    }
    /**
     * SETUP DES BOUTTONS UTILISATEURS
     */
    interaction.deleteReply();
    if (button.customId === "maintenance") {
      interaction.client.user.setStatus("idle");
      return interaction.client.user.setActivity("⚒️ Maintenance");
    }
    if (button.customId === "setupconseil") {
      row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("conseildefou")
          .setLabel("🎓 Commencer la réunion")
          .setStyle(ButtonStyle.Primary)
      );

      embed = new EmbedBuilder()
        .setColor("#91ff00")
        .setTitle("🤝 | Réunion des Superviseurs")
        .setThumbnail("https://cdn-icons-png.flaticon.com/512/3712/3712250.png")
        .setDescription(
          "Cliquez sur le bouton ci-dessous pour lancer la réunion de superviseur.\n Attention il n'est plus possible de faire marche arrière après le début d'une réunion!\n Tout abus sera **lourdement sanctionné**."
        );
    } else if (button.customId === "setupexp") {
      row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("expbutton")
          .setLabel("📩 Envoyer une demande")
          .setStyle(ButtonStyle.Primary)
      );

      embed = new EmbedBuilder()
        .setColor("#91ff00")
        .setTitle("🧪 | Demande d'Autorisation d'Experience")
        .setDescription(
          "Cliquez sur le bouton ci-dessous pour envoyer une demande d'autorisation, tout abus sera sanctionné."
        );
    } else if (button.customId === "setuppsy") {
      row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("psybutton")
          .setLabel("📩 Envoyer une demande")
          .setStyle(ButtonStyle.Primary)
      );

      embed = new EmbedBuilder()
        .setColor("#ff00ee")
        .setTitle("🧠 | Demande de rendez-vous psychologique")
        .setDescription(
          "Les psychologues sont tenus au **secret professionnel**, tout ce qui est dit durant le rendez-vous ne pourra sortir de ce dernier sauf en cas de demande judiciaire, moyennant des conditions très strictes.\nCliquez sur le bouton ci-dessous pour envoyer une demande d'autorisation, tout abus sera sanctionné."
        );
    } else if (button.customId === "setupsuggestions") {
      row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("suggestion")
          .setLabel("💟 Envoyer une suggestion")
          .setStyle(ButtonStyle.Primary)
      );

      embed = new EmbedBuilder()
        .setColor("#0e1e8a")
        .setTitle("💌 | Envoyer des suggestions")
        .setThumbnail(
          "https://www.iconpacks.net/icons/2/free-feedback-icon-2949-thumb.png"
        )
        .setDescription(
          "Cliquez sur le bouton ci-dessous pour proposer une suggestion pour le robot discord.\nTout abus sera sanctionné."
        );
    } else if (button.customId === "setupabsences") {
      row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("absence")
          .setLabel("🥥 Déclarer une absence")
          .setStyle(ButtonStyle.Primary)
      );

      embed = new EmbedBuilder()
        .setColor("#0e1e8a")
        .setTitle("🌴 | Formulaire d'absences")
        .setThumbnail("https://cdn-icons-png.flaticon.com/512/6581/6581528.png")
        .setDescription(
          "Cliquez sur le bouton ci-dessous pour proposer devenir absent."
        );
    }
    return button.reply({
      content: "",
      ephemeral: false,
      embeds: [embed],
      components: [row],
    });
  },
};
