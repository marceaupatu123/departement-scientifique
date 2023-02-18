require("dotenv").config();
const { Events } = require("discord.js");
const { modal } = require("../modals/psy");

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction) {
    if (!interaction.isButton() || !(interaction.customId === "psybutton"))
      return;
    await interaction.showModal(modal);
    console.log(interaction);
  },
};
