const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

const modal = new ModalBuilder()
  .setCustomId("psy")
  .setTitle("Demande de rendez-vous psychologique");

const nom = new TextInputBuilder()
  .setCustomId("nom")
  .setLabel("Nom")
  .setStyle(TextInputStyle.Short);

const grade = new TextInputBuilder()
  .setCustomId("grade")
  .setLabel("Grade")
  .setStyle(TextInputStyle.Short);

const dispo = new TextInputBuilder()
  .setCustomId("dispo")
  .setLabel("Disponibilité")
  .setStyle(TextInputStyle.Paragraph);

const fayot = new TextInputBuilder()
  .setCustomId("fayot")
  .setLabel("Souhaitez-vous un psychologue en particulier?")
  .setStyle(TextInputStyle.Short);

modal.addComponents(
  new ActionRowBuilder().addComponents(nom),
  new ActionRowBuilder().addComponents(grade),
  new ActionRowBuilder().addComponents(dispo),
  new ActionRowBuilder().addComponents(fayot)
);

module.exports = { modal };
