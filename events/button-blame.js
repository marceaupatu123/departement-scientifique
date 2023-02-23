/* eslint-disable consistent-return */
require("dotenv").config();
const { Events } = require("discord.js");
const { Allowed, NotAllowed } = require("../json/messages.json");
const { GetBlameByID } = require("../functions/blames");

const { Superviseur } = process.env;
const { split } = require("../functions/database");

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(button) {
    if (!button.isButton() || !(button.customId === "enlevecettemerde")) return;
    if (!button.member.roles.cache.some((role) => role.id === Superviseur))
      return button.reply({ content: NotAllowed, ephemeral: true });
    const { value } = button.message.embeds[0].fields[0];
    const blame = await GetBlameByID(
      button.guild.channels.cache.get(process.env.SalonBlamelogs),
      split(value).ID
    );
    blame.deleteBlame();
    button.reply({ content: Allowed, ephemeral: true });
  },
};
