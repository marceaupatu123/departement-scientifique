const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

const modal = new ModalBuilder()
    .setCustomId('suggestionmodal')
    .setTitle('Formulaire de suggestions');

const raison = new TextInputBuilder()
    .setCustomId('descriptionsuggestion')
    .setLabel("Descrpiton de la Suggestion")
    .setMaxLength(900)
    .setStyle(TextInputStyle.Paragraph);

modal.addComponents(new ActionRowBuilder().addComponents(raison))

module.exports = { modal }