require("dotenv").config();
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { SCP } = require("../functions/scp");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("spawncet")
    .setDescription("Affiche tout les blâmes actifs du serveur")
    .addNumberOption((option) =>
      option.setName("numero").setDescription("Numéro du SCP").setRequired(true)
    ),
  async execute(interaction) {
    const scpnumber = await interaction.options.getNumber("numero");
    const thescp = await SCP.fetchSCP(interaction.client, scpnumber);
    const embed = new EmbedBuilder()
      .setColor("#f2f20c")
      .setTitle(`⚒️ | Controle d'Entretien Technique`)
      .setThumbnail(thescp.imageurl)
      .addFields(
        {
          name: "📋 | Informations sur l'objet SCP",
          value: `**Objet:** ${thescp.id} \n**Classe:** ${thescp.containmentclass} \n**Niveau Minimum Requis:** ${thescp.clearancelevel} \n**Classe de Perturbation:** ${thescp.disruptionclass} \n**Classe de Risque:** ${thescp.riskclass}`,
          inline: true,
        },
        {
          name: "📁 | Informations sur la demande",
          value: `**Date du dernier CET:** <t:${Math.floor(
            Date.now() / 1000
          )}:D> \n**Dernier Opérateur:** ${
            interaction.member
          } \n**Etat du SASC :** 🟢 Cellule Opérationnelle`,
          inline: false,
        }
      );
    interaction.reply({ content: "", embeds: [embed] });
  },
};
