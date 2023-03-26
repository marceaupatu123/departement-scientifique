const axios = require("axios");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
} = require("discord.js");
const { splitEmbed } = require("./database");

/**
 * Une classe représentant un SCP (Secure, Contain, Protect).
 *
 * @class SCP
 */
class SCP {
  #client;

  #guild;

  /**
   * @private Utiliser la méthode static SCP.fetchSCP() à la place.
   * @param {DiscordClient} client Client Discord
   * @param {number|string} id Numéro du SCP (Même les SCP de 001 à 100 peuvent être passés en tant que nombre)
   * @param {string} imageurl Url de l'image du SCP
   * @param {string} containmentclass Classe de confinement
   * @param {string} clearancelevel Rôle minimum d'accréditation
   * @param {string} disruptionclass ACS Disrpution Classe
   * @param {string} riskclass ACS Risque Class
   */
  constructor(
    client,
    id,
    imageurl,
    containmentClass,
    clearanceLevel,
    disruptionClass,
    riskClass
  ) {
    /**
     * Le numéro du SCP.
     *
     * @type {string}
     */
    this.id = id;

    /**
     * L'URL de l'image du SCP.
     *
     * @type {string}
     */
    this.imageurl = imageurl;

    /**
     * La classe de confinement du SCP.
     *
     * @type {string}
     */
    this.containmentClass = containmentClass;

    /**
     * Le niveau d'accréditation requis pour accéder au SCP.
     *
     * @type {string}
     */
    this.clearanceLevel = clearanceLevel;

    /**
     * La classe de perturbation du SCP.
     *
     * @type {string}
     */
    this.disruptionClass = disruptionClass;

    /**
     * La classe de risque du SCP.
     *
     * @type {string}
     */
    this.riskClass = riskClass;
    /**
     * Le SCP est-il breach?
     *
     * @type {boolean}
     */
    this.breached = false;
    /**
     * Le client discord.
     *
     * @private
     * @type {DiscordClient}
     */
    this.#client = client;
    /**
     * Le client discord.
     *
     * @private
     * @type {Guild}
     */
    this.#guild = this.#client.guilds.cache.get(process.env.guildId);
  }

  /**
   *
   * @param {DiscordClient} client Client Discord.
   * @param {*} id Numéro du SCP
   * @returns Objet SCP
   */
  static async fetchSCP(client, id) {
    const stringedid = id.toString().length < 3 ? `0${id}` : `${id}`;
    const server = await client.guilds.cache.get(process.env.guildId);
    const SCPDB = await server.channels.cache
      .get(process.env.SCPDB)
      .messages.fetch();

    const scpArray = Array.from(SCPDB.values());
    const foundscp = scpArray.find((element) => {
      const split = element.content.split("|");
      return split[0] === stringedid;
    });

    if (!foundscp) {
      let reply = await axios.get(
        `https://www.googleapis.com/customsearch/v1?q=SCP-${stringedid} png&searchType=image&cx=463e7e2a605284f03&key=AIzaSyDMRUKEOQ9I2UZ1ktQc19lzukZnExajfbM&imgSize=medium`
      );
      reply = reply.data.items;
      reply.forEach((element) => {
        if (element.link.includes("https://i.ytimg.com/v")) {
          reply.splice(reply.indexOf(element), 1);
        }
      });
      return new SCP(client, stringedid, reply[0].link, null, null, null, null);
    }

    const split = foundscp.content.split("|");
    const rank = await server.roles.cache.get(split[2]);
    return new SCP(
      client,
      stringedid,
      split[split.length - 1],
      split[1],
      rank,
      split[3],
      split[4]
    );
  }

  /**
   * @returns {Map} Une map contenant pour clé {"Opérateur", "Timestamp", "Status"}
   */
  async getCETInfo() {
    const botlog = await this.#guild.channels.cache.get(process.env.cetlogs);
    const messages = await botlog.messages.fetch();
    const thelog = await messages.find((element) => {
      const split = element.content.split("|");
      return split[0] === this.id;
    });
    const thelogarray = thelog.content.split("|");
    if (!thelog) return null;
    const map = new Map();
    map.set("Opérateur", thelogarray[1]);
    map.set("Timestamp", thelogarray[2]);
    map.set("Status", thelogarray[3]);
    map.set("Message", thelog);
    return map;
  }

  async changeCetStatus(status, member = "auto") {
    const cetdaily = await this.#guild.channels.cache.get(process.env.cetdaily);
    const cetdailyarray = await cetdaily.messages.fetch();
    if (
      cetdailyarray.some(
        (message) => message.content.split("|")[1] === `${member}`
      )
    )
      return 429;
    const messagelog = await this.getCETInfo();
    if (!messagelog) throw Error("This SCP doesn't have any cet setup");
    const botlog = await this.#guild.channels.cache.get(process.env.cetlogs);
    const embedlog = await this.#guild.channels.cache.get(
      process.env.cetembedlogs
    );
    const embedmessagearray = await embedlog.messages.fetch();
    const embedmessage = await embedmessagearray.find((message) => {
      if (message?.embeds[0]) {
        const { value } = message.embeds[0].fields[0];
        const id = splitEmbed(value).Objet;
        return id === this.id;
      }
      return null;
    });
    const time =
      member === "auto"
        ? messagelog.get("Timestamp")
        : Math.floor(Date.now() / 1000);
    await messagelog.get("Message").delete();
    const operator = member === "auto" ? messagelog.get("Opérateur") : member;
    await botlog.send(`${this.id}|${operator}|${time}|${status}`);
    if (member) {
      await cetdaily.send(`${this.id}|${operator}`);
      const cetweekly = await this.#guild.channels.cache.get(
        process.env.cetweeklog
      );
      cetweekly.send(`${this.id}|${operator}`);
    }
    let embed = EmbedBuilder.from(embedmessage.embeds[0]);
    let button = null;
    if (status === "operational") {
      embed = embed
        .addFields({
          name: "📁 | Informations sur la demande",
          value: `**Date du dernier CET:** <t:${Math.floor(
            Date.now() / 1000
          )}:R> \n**Opérateur:** ${operator} \n**Etat du SASC:**🟢 Cellule Opérationnelle`,
          inline: false,
        })
        .setColor("Green");
      button = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("cetdone")
            .setLabel("✅ Effectué")
            .setStyle(ButtonStyle.Success)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("incident")
            .setLabel("⚠️ Signaler un Incident")
            .setStyle(ButtonStyle.Danger)
        );
    } else if (status === "minor") {
      embed = embed
        .addFields({
          name: "📁 | Informations sur la demande",
          value: `**Date de l'Incident:** <t:${time}:R> \n**Signaleur:** ${operator} \n**Etat du SASC:** 🟣 Incident Signalé Manuellement`,
          inline: false,
        })
        .setColor("Purple");
      button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("🔨 Incident Résolu")
          .setCustomId("cetdone")
          .setStyle(ButtonStyle.Success)
      );
    } else if (status === "breach") {
      embed = embed
        .addFields({
          name: "📁 | Informations sur la demande",
          value: `**Date de la Brèche de Confinement:** <t:${time}:R> \n**Signaleur:** ${operator} \n**Etat du SASC:** 🔴 Brèche Signalée Manuellement`,
          inline: false,
        })
        .setColor("Red");
      button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("🔒 SCP Reconfiné")
          .setCustomId("cetdone")
          .setStyle(ButtonStyle.Success)
      );
    } else if (status === "needcheck") {
      embed = embed
        .addFields({
          name: "📁 | Informations sur le CET",
          value: `**Date du dernier CET:** <t:${time}:R> \n**Signaleur:** ${operator} \n**Etat du SASC:** 🔵 Besoin d'un CET`,
          inline: false,
        })
        .setColor("Blue");
      button = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setLabel("✅ Effectué")
            .setCustomId("cetdone")
            .setStyle(ButtonStyle.Success)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("incident")
            .setLabel("⚠️ Signaler un Incident")
            .setStyle(ButtonStyle.Danger)
        );
    } else if (status === "needcheckpriority") {
      embed = embed
        .addFields({
          name: "📁 | Informations sur le CET",
          value: `**Date du dernier CET:** <t:${time}:R> \n**Opérateur:** ${operator} \n**Etat du SASC:** 🟠 Besoin d'un CET en Urgence`,
          inline: false,
        })
        .setColor("Orange");
      button = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setLabel("✅ Effectué")
            .setCustomId("cetdone")
            .setStyle(ButtonStyle.Success)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("incident")
            .setLabel("⚠️ Signaler un Incident")
            .setStyle(ButtonStyle.Danger)
        );
    }
    embed = embed.spliceFields(-2, 1);
    await embedmessage.edit({
      embeds: [embed],
      components: [button],
    });
    return true;
  }
}

module.exports = { SCP };
