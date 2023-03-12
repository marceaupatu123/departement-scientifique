require("dotenv").config();
const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
} = require("discord.js");
const { modal } = require("../modals/blame");

const { SalonBlamelogs } = process.env;
const { SalonBlame } = process.env;
const { Allowed, NotAllowed } = require("../json/messages.json");
const { CheckSuperviseur } = require("../functions/checkroles");

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Mettre un blâme")
    .setType(ApplicationCommandType.User),
  async execute(interaction) {
    if (!CheckSuperviseur(interaction.member))
      return interaction.reply({ content: NotAllowed, ephemeral: true });
    const user = interaction.targetUser;
    const botlog = interaction.guild.channels.cache.get(SalonBlamelogs);
    await interaction.showModal(modal);
    let modalinteraction = null;
    try {
      modalinteraction = await interaction.awaitModalSubmit({ time: 60000 });
    } catch (e) {
      return console.log(e);
    }
    modalinteraction.deferReply({ ephemeral: true });
    const blameid = makeid(7);
    const array = await botlog.messages.fetch();
    let keys = 1;
    array.forEach((element) => {
      const split = element.content.split("|");
      const wow = split[1].search(`${user}`);
      if (wow > -1) keys += 1;
    });
    await botlog.send(
      `${blameid}|${user}|${
        interaction.member
      }|${modalinteraction.fields.getTextInputValue("raison")}`
    );
    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("🔔 | Notification de blâme")
      .setThumbnail("https://cdn-icons-png.flaticon.com/512/1022/1022300.png")
      .addFields({
        name: "📁 | Informations sur le blame",

        value: `**ID**: ${blameid}\n**Superviseur:** ${
          interaction.user
        }\n **Raison:** ${modalinteraction.fields.getTextInputValue("raison")}`,
        inline: false,
      })
      .setDescription(
        `${user} à reçu un nouveau blâme, il a désormais un blâme **${keys}**`
      );
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("enlevecettemerde")
        .setLabel("🗑️ Supprimer le blâme")
        .setStyle(ButtonStyle.Danger)
    );
    modalinteraction.guild.channels.cache.get(SalonBlame).send({
      content: "",
      ephemeral: false,
      embeds: [embed],
      components: [row],
    });
    return modalinteraction.editReply({ content: Allowed, ephemeral: true });
  },
};
