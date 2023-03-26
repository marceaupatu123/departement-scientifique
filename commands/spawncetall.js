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
const { NotAllowed, Allowed } = require("../json/messages.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("spawncetall")
    .setDescription("Fais spawn le cet d'un scp")
    .addStringOption((option) =>
      option.setName("classe").setDescription("Classe du SCP").setRequired(true)
    ),
  async execute(interaction) {
    const botlog = await interaction.guild.channels.cache.get(
      process.env.cetlogs
    );
    if (!CheckSuperviseur(interaction.member)) {
      interaction.reply({ content: NotAllowed, ephemeral: true });
      return;
    }
    await interaction.deferReply();
    const scplogs = await interaction.guild.channels.cache
      .get(process.env.SCPDB)
      .messages.fetch();
    await Promise.all(
      scplogs.map(async (element) => {
        const scpnumber = element.content.split("|")[0];
        if (
          element.content.split("|")[1] !==
          interaction.options.getString("classe")
        )
          return;
        const thescp = await SCP.fetchSCP(interaction.client, scpnumber);
        const time = Math.floor(Date.now() / 1000);
        console.log(thescp.id);
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
        await botlog.send(
          `${thescp.id}|${interaction.member}|${time}|operational`
        );
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
        await interaction.channel.send({
          content: `SCP-${thescp.id}`,
          embeds: [embed],
          components: [row],
        });
      })
    );

    await interaction.editReply({ content: Allowed });
  },
};
