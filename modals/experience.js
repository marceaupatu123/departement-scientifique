const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

const modal = new ModalBuilder()
    .setCustomId('exp')
    .setTitle('Demande d\'Autorisation d\'Expérience');

const nom = new TextInputBuilder()
    .setCustomId('nom')
    .setLabel("Nom RP")
    .setStyle(TextInputStyle.Short);

const grade = new TextInputBuilder()
    .setCustomId('grade')
    .setLabel("Grade")
    .setStyle(TextInputStyle.Short);

const scp = new TextInputBuilder()
    .setCustomId('scp')
    .setLabel("SCP")
    .setStyle(TextInputStyle.Short);

const ut = new TextInputBuilder()
    .setCustomId('unité')
    .setLabel("Unité et Matériel")
    .setStyle(TextInputStyle.Paragraph);

const but = new TextInputBuilder()
    .setCustomId('but')
    .setLabel("But")
    .setStyle(TextInputStyle.Paragraph);


modal.addComponents(new ActionRowBuilder().addComponents(nom), new ActionRowBuilder().addComponents(grade), new ActionRowBuilder().addComponents(scp), new ActionRowBuilder().addComponents(ut), new ActionRowBuilder().addComponents(but))

module.exports = {modal}