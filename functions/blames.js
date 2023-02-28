const {
  ButtonBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonStyle,
} = require("discord.js");
const { split } = require("./database");

class Blâme {
  constructor(id, memberblamed, superviseur, raison) {
    this.id = id;
    this.memberblamed = memberblamed;
    this.superviseur = superviseur;
    this.raison = raison;
  }

  /**
   * Renvoie le message contenant l'embed du blâme
   * @param {Client} client
   * @returns {Message}
   */
  async getEmbedMessage(client) {
    const guild = await client.guilds.cache.get(process.env.guildId);
    const channel = await guild.channels.cache.get(process.env.SalonBlame);
    const messages = await channel.messages.fetch();
    return messages.find((message) => {
      if (message?.embeds[0]) {
        const { value } = message.embeds[0].fields[0];
        const id = split(value).ID;
        return id === this.id;
      }
      return false;
    });
  }

  /**
   * Renvoie le message contenant de log du blâme
   * @param {Client} client
   * @returns {Message}
   */
  async getLogMessage(client) {
    const guild = await client.guilds.cache.get(process.env.guildId);
    const channel = await guild.channels.cache.get(process.env.SalonBlamelogs);
    const messages = await channel.messages.fetch();
    return messages.find((element) => element.content.includes(this.id));
  }

  /**
   * Supprime le blâme
   * @param {Client} client
   */
  async deleteBlame(client) {
    const DisabledButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("denied")
        .setLabel("🗑️ Supprimer le blâme")
        .setDisabled(true)
        .setStyle(ButtonStyle.Danger)
    );
    const logMessage = await this.getLogMessage(client);
    const embedMessage = await this.getEmbedMessage(client);
    const embed = EmbedBuilder.from(embedMessage.embeds[0]).setColor("#290000");
    embedMessage.edit({
      content: "",
      embeds: [embed],
      components: [DisabledButtons],
    });
    logMessage.delete();
    delete this;
  }
}

/**
 * Renvoie un booléen pour savoir si c'est un superviseur, cette fonction valide automatiquement Dominus_Marceau pour tout tests et maintenances.
 * @param {GuildMember} member
 * @typedefs {Object<string>}
 */

/**
 * Renvoie tout les blâmes d'une personnes
 * @param {TextChannel} logssalon
 * @param {GuildMember} member
 * @returns {Promise.<Array.<Blâme>}
 */
async function GetMemberBlame(client, member) {
  const logssalon = await client.guilds.cache
    .get(process.env.guildId)
    .channels.cache.get(process.env.SalonBlamelogs);
  const array = await logssalon.messages.fetch();
  const BlameArray = [];
  array.forEach((message) => {
    const splited = message.content.split("|");
    if (splited[1] === `!${member.id}`) {
      BlameArray.push(
        new Blâme(splited[0], splited[1], splited[2], splited[3])
      );
    }
  });
  return BlameArray;
}

/**
 * Renvoie un blame grâce à l'id
 * @param {TextChannel} logssalon
 * @param {String} id
 * @returns {Promise.<Array.<Blâme>}
 */
async function GetBlameByID(client, id) {
  const logssalon = client.guilds.cache
    .get(process.env.guildId)
    .channels.cache.get(process.env.SalonBlamelogs);
  const array = await logssalon.messages.fetch();
  const args = array
    .find((message) => message.content.split("|")[0] === id)
    .content.split("|");
  return new Blâme(...args);
}

module.exports = { GetBlameByID, GetMemberBlame, Blâme };
