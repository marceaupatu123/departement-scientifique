require("dotenv").config();
const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { CheckSuperviseur } = require("../functions/checkroles");
const { SCP } = require("../functions/scp");
const { NotAllowed } = require("../json/messages.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("spawncet")
    .setDescription("Fais spawn le cet d'un scp")
    .addNumberOption((option) =>
      option.setName("numero").setDescription("Numéro du SCP").setRequired(true)
    ),
  async execute(interaction) {
    const botlog = await interaction.guild.channels.cache.get(
      process.env.cetlogs
    );
    if (!CheckSuperviseur(interaction.member)) {
      interaction.reply({ content: NotAllowed, ephemeral: true });
      return;
    }
    const scpnumber = await interaction.options.getNumber("numero");
    const thescp = await SCP.fetchSCP(interaction.client, scpnumber);
    const time = Math.floor(Date.now() / 1000);
    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle(`⚒️ | Controle d'Entretien Technique`)
      .setThumbnail(thescp.imageurl)
      .addFields(
        {
          name: "📋 | Informations sur l'objet SCP",
          value: `**Objet:** ${thescp.id} \n**Classe:** ${thescp.containmentClass} \n**Niveau Minimum Requis:** ${thescp.clearanceLevel} \n**Classe de Perturbation:** ${thescp.disruptionClass} \n**Classe de Risque:** ${thescp.riskClass}`,
          inline: true,
        },
        {
          name: "📁 | Informations sur la demande",
          value: `**Date du dernier CET:** <t:${time}:R> \n**Dernier Opérateur:** ${interaction.member} \n**Etat du SASC:** 🟢 Cellule Opérationnelle`,
          inline: false,
        }
      );
    await botlog.send(`${thescp.id}|${interaction.member}|${time}|operational`);
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("cetdone")
          .setLabel("✅ Effectué")
          .setStyle(ButtonStyle.Success)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("incident")
          .setLabel("⚠️ Signaler un Incident")
          .setStyle(ButtonStyle.Danger)
      );
    interaction.reply({
      content: `SCP-${thescp.id}`,
      embeds: [embed],
      components: [row],
    });
  },
};
