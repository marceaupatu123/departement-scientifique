const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

const modal = new ModalBuilder()
    .setCustomId('exp')
    .setTitle('Demande d\'Autorisation d\'Expérience');

const grade = new TextInputBuilder()
    .setCustomId('grade')
    .setLabel("Grade")
    .setMaxLength(30)
    .setStyle(TextInputStyle.Short);

const scp = new TextInputBuilder()
    .setCustomId('scp')
    .setLabel("SCP")
    .setMaxLength(4)
    .setStyle(TextInputStyle.Short);

const ut = new TextInputBuilder()
    .setCustomId('unité')
    .setLabel("Unité et Matériel")
    .setMaxLength(200)
    .setStyle(TextInputStyle.Paragraph);

const but = new TextInputBuilder()
    .setCustomId('but')
    .setLabel("But")
    .setMaxLength(600)
    .setStyle(TextInputStyle.Paragraph);


modal.addComponents(new ActionRowBuilder().addComponents(grade), new ActionRowBuilder().addComponents(scp), new ActionRowBuilder().addComponents(ut), new ActionRowBuilder().addComponents(but))

module.exports = {modal}