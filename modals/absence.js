const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

const modal = new ModalBuilder()
  .setCustomId("modalabsence")
  .setTitle("Formulaire d' absences");

const grade = new TextInputBuilder()
  .setCustomId("grade")
  .setLabel("Grade")
  .setMaxLength(40)
  .setStyle(TextInputStyle.Short);

const timestampstart = new TextInputBuilder()
  .setCustomId("starttimestamp")
  .setLabel("Date de début (DD/MM/YYYY)")
  .setMaxLength(10)
  .setMinLength(10)
  .setStyle(TextInputStyle.Short);

const timestampend = new TextInputBuilder()
  .setCustomId("endtimestamp")
  .setLabel("Date de fin (DD/MM/YYYY)")
  .setMaxLength(10)
  .setMinLength(10)
  .setStyle(TextInputStyle.Short);

const raison = new TextInputBuilder()
  .setCustomId("raison")
  .setLabel("Raison")
  .setMaxLength(900)
  .setStyle(TextInputStyle.Paragraph);

modal.addComponents(
  new ActionRowBuilder().addComponents(grade),
  new ActionRowBuilder().addComponents(timestampstart),
  new ActionRowBuilder().addComponents(timestampend),
  new ActionRowBuilder().addComponents(raison)
);

module.exports = { modal };
