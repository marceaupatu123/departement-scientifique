require("dotenv").config();
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const { NotAllowed } = require("../json/messages.json");
const { CheckSuperviseur } = require("../functions/checkroles");
const { Blâme } = require("../functions/blames");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("showblames")
    .setDescription("Affiche tout les blâmes actifs du serveur"),
  async execute(interaction) {
    if (!CheckSuperviseur(interaction.member))
      return interaction.reply({ content: NotAllowed, ephemeral: true });
    const botlog = await interaction.guild.channels.cache.get(
      process.env.SalonBlamelogs
    );
    const logs = await botlog.messages.fetch();
    const activeBlames = { type1: [], type2: [], type3: [] };

    const promises2 = logs.map(async (log) => {
      const splited = log.content.split("|");
      const blame = new Blâme(
        splited[0],
        splited[1],
        splited[2],
        splited[3],
        splited[4]
      );
      if (!blame.type) {
        blame.type = await blame.getTypeByEmbed(interaction.client);
      }
      activeBlames[`type${blame.type}`].push(blame);
    });

    await Promise.all(promises2);

    const StringArray = { type1: "", type2: "", type3: "" };

    const promises = Object.keys(activeBlames).map(async (key) => {
      const blameType = activeBlames[key];
      await Promise.all(
        blameType.map(async (b) => {
          const embedMessage = await b.getEmbedMessage(interaction.client);
          console.log(embedMessage);
          const localstring = `• ${b.memberblamed} à été blamé par : ${b.superviseur} ([lien du blâme](${embedMessage.url}))\n`;
          StringArray[key] += localstring;
        })
      );
    });

    await Promise.all(promises);

    console.log(StringArray);
    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle(`📜 | Liste des blâmes du serveur`)
      .addFields({
        name: `⚖️ | Blâme 1`,
        value:
          StringArray.type1 !== ""
            ? StringArray.type1
            : "🤷‍♀️ Aucun blâme de type 1 actif.",
        inline: false,
      })
      .addFields({
        name: `⚖️ | Blâme 2`,
        value:
          StringArray.type2 !== ""
            ? StringArray.type2
            : "🤷‍♀️ Aucun blâme de type 2 actif.",
        inline: false,
      })
      .addFields({
        name: `⚖️ | Blâme 3`,
        value:
          StringArray.type3 !== ""
            ? StringArray.type3
            : "🤷‍♀️ Aucun blâme de type 3 actif.",
        inline: false,
      });

    return interaction.reply({ content: "", ephemeral: true, embeds: [embed] });
  },
};
