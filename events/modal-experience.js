require("dotenv").config();
const {
  Events,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { Allowed } = require("../json/messages.json");
const { SCP } = require("../functions/scp");

const { SalonExperienceValide } = process.env;
const { Superviseur } = process.env;

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(modalinteraction) {
    if (
      !modalinteraction.isModalSubmit() ||
      !(modalinteraction.customId === "exp")
    )
      return;
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("success")
          .setLabel("✅ Autoriser")
          .setStyle(ButtonStyle.Success)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("denied")
          .setLabel("🗑️ Refuser")
          .setStyle(ButtonStyle.Danger)
      );
    modalinteraction.deferReply({ ephemeral: true });
    const thescp = await SCP.fetchSCP(
      modalinteraction.client,
      modalinteraction.fields.getTextInputValue("scp")
    );
    const embed = new EmbedBuilder()
      .setColor("#03fc90")
      .setTitle("Demande d'Experience")
      .setThumbnail(thescp.imageurl)
      .addFields(
        {
          name: "📋 | Informations sur le Scientifique",
          value:
            `**Nom:** ${modalinteraction.user}` +
            `\n**Grade:** ${modalinteraction.fields.getTextInputValue(
              "grade"
            )}`,
          inline: true,
        },
        {
          name: "🧪 | Description de l'Experience",
          value: `**SCP:** ${modalinteraction.fields.getTextInputValue(
            "scp"
          )}\n**Unité et Matériel:** ${modalinteraction.fields.getTextInputValue(
            "unité"
          )}\n**But:** ${modalinteraction.fields.getTextInputValue("but")}`,
          inline: false,
        },
        {
          name: "📁 | Informations sur la demande",
          value: "**Statut:** ⚠️ | En Attente de Validation",
          inline: false,
        }
      );
    await modalinteraction.guild.channels.cache
      .get(SalonExperienceValide)
      .send({
        content: `<@&${Superviseur}>${modalinteraction.member}`,
        ephemeral: false,
        embeds: [embed],
        components: [row],
      });
    await modalinteraction.editReply({ content: Allowed, ephemeral: true });
  },
};
