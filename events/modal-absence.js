require("dotenv").config();
const { Events } = require("discord.js");
const { modal } = require("../modals/absence");
const { Allowed } = require("../json/messages.json");

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
    if (mentioned) mentioned.delete();
    let timestamp1 =
      modalinteraction.fields.getTextInputValue("starttimestamp");
    timestamp1 = timestamp1.split("/");
    let timestamp2 = modalinteraction.fields.getTextInputValue("endtimestamp");
    timestamp2 = timestamp2.split("/");
    timestamp1 = new Date(
      timestamp1[2] - 1,
      timestamp1[1],
      timestamp1[0]
    ).getTime();
    timestamp2 = new Date(
      timestamp2[2],
      timestamp2[1],
      timestamp2[0]
    ).getTime();
    await botlog.send(
      `${modalinteraction.member}|${timestamp1 / 1000}|${
        timestamp2 / 1000
      }|${modalinteraction.fields.getTextInputValue("raison")}`
    );
    const absentrole = modalinteraction.guild.roles.cache.get(RoleAbsent);
    await modalinteraction.member.roles.add(absentrole);
    modalinteraction.reply({ content: Allowed, ephemeral: true });
  },
};
