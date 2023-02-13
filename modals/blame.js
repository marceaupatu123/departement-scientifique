const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

const modal = new ModalBuilder()
  .setCustomId("blame")
  .setTitle("Formulaire de blâme");

const raison = new TextInputBuilder()
  .setCustomId("raison")
  .setLabel("Raison")
  .setMaxLength(900)
  .setStyle(TextInputStyle.Paragraph);

modal.addComponents(new ActionRowBuilder().addComponents(raison));

module.exports = { modal };
