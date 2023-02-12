require("dotenv").config();
const {
  Events,
  ButtonBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonStyle,
} = require("discord.js");
const { modal } = require("../modals/suggestion.js");
const { Allowed } = require("../json/messages.json");

const { SalonBlamelogs } = process.env;
const { SalonBlame } = process.env;
const { Superviseur } = process.env;
const { split } = require("../functions/database");

const DisabledButtons = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId("denied")
    .setLabel("🗑️ Supprimer le blâme")
    .setDisabled(true)
    .setStyle(ButtonStyle.Danger)
);

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(button) {
    if (
      !button.isButton() ||
      !(button.customId == "enlevecettemerde") ||
      !button.member.roles.cache.some((role) => role.id == Superviseur)
    )
      return;
    const botlog = button.guild.channels.cache.get(SalonBlamelogs);
    const array = await botlog.messages.fetch();
    const { value } = button.message.embeds[0].fields[0];
    const id = split(value).ID;
    const message = array.find((element) => element.content.includes(id));
    const embed = EmbedBuilder.from(button.message.embeds[0]).setColor(
      "#290000"
    );
    message.delete();
    button.message.edit({
      content: "",
      embeds: [embed],
      components: [DisabledButtons],
    });
    button.reply(Allowed);
  },
};
