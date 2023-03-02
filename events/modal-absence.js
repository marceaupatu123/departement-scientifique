require("dotenv").config();
const { Events, EmbedBuilder } = require("discord.js");
const { modal } = require("../modals/absence");
const { Allowed } = require("../json/messages.json");
const { RemoveAbsence } = require("../functions/absences");

const { SalonAbsenceLogs, RoleAbsent } = process.env;

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(modalinteraction) {
    if (modalinteraction.customId === "absence") {
      await modalinteraction.showModal(modal);
      return;
    }
    if (
      !modalinteraction.isModalSubmit() ||
      !(modalinteraction.customId === "modalabsence")
    )
      return;
    const botlog = modalinteraction.guild.channels.cache.get(SalonAbsenceLogs);
    const array = await botlog.messages.fetch();
    const mentioned = array.find(
      (logs) => logs.mentions.members.first()?.id === modalinteraction.user.id
    );
    if (mentioned) await RemoveAbsence(modalinteraction.member);
    let timestamp1 =
      modalinteraction.fields.getTextInputValue("starttimestamp");
    timestamp1 = timestamp1.split("/");
    let timestamp2 = modalinteraction.fields.getTextInputValue("endtimestamp");
    timestamp2 = timestamp2.split("/");
    timestamp1 =
      new Date(
        Date.UTC(
          timestamp1[2] - 1,
          timestamp1[1],
          timestamp1[0],
          new Date().getUTCHours() + 1,
          new Date().getUTCMinutes()
        )
      ).getTime() / 1000;
    timestamp2 =
      new Date(
        Date.UTC(
          timestamp2[2],
          timestamp2[1] - 1,
          timestamp2[0],
          new Date().getUTCHours() + 1,
          new Date().getUTCMinutes()
        )
      ).getTime() / 1000;
    await botlog.send(
      `${
        modalinteraction.member
      }|${timestamp1}|${timestamp2}|${modalinteraction.fields.getTextInputValue(
        "raison"
      )}`
    );
    const embed = new EmbedBuilder()
      .setColor("#03fc90")
      .setTitle("🥥 | Notification d'Absence")
      .setThumbnail("https://cdn-icons-png.flaticon.com/512/4952/4952999.png")
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
          name: "📁 | Informations sur la demande",
          value: `**Date de début:** <t:${timestamp1}:D>\n**Date de fin:** <t:${timestamp2}:R>\n**Raison:** ${modalinteraction.fields.getTextInputValue(
            "raison"
          )}`,
          inline: false,
        }
      );
    const absentrole = modalinteraction.guild.roles.cache.get(RoleAbsent);
    await modalinteraction.member.roles.add(absentrole);
    modalinteraction.channel.send({ content: "", embeds: [embed] });
    modalinteraction.reply({ content: Allowed, ephemeral: true });
  },
};
