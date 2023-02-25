/* eslint-disable consistent-return */
require("dotenv").config();
const { Events } = require("discord.js");
const { Allowed, NotAllowed } = require("../json/messages.json");
const { GetBlameByID } = require("../functions/blames");
const { CheckSuperviseur } = require("../functions/CheckRoles");

const { split } = require("../functions/database");

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(button) {
    if (!button.isButton() || !(button.customId === "enlevecettemerde")) return;
    if (!CheckSuperviseur(button.member))
      return button.reply({ content: NotAllowed, ephemeral: true });
    button.deferReply({ ephemeral: true });
    const { value } = button.message.embeds[0].fields[0];
    const blame = await GetBlameByID(button.client, split(value).ID);
    await blame.deleteBlame(button.client);
    button.editReply({ content: Allowed, ephemeral: true });
  },
};
