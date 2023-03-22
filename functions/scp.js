const axios = require("axios");

/**
 * Une classe représentant un SCP (Secure, Contain, Protect).
 *
 * @class
 * @param {number} id - Le numéro du SCP.
 */
class SCP {
  #client;

  /**
   * @private Utiliser la méthode static SCP.fetchSCP() à la place.
   * @param {DiscordClient} client Client Discord
   * @param {number} id Numéro du SCP
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
    containmentclass,
    clearancelevel,
    disruptionclass,
    riskclass
  ) {
    this.id = id;
    this.imageurl = imageurl;
    this.containmentclass = containmentclass;
    this.clearancelevel = clearancelevel;
    this.disruptionclass = disruptionclass;
    this.riskclass = riskclass;
    this.breached = false;
    this.#client = client;
  }

  /**
   *
   * @param {DiscordClient} client Client Discord.
   * @param {*} id Numéro du SCP
   * @returns Objet SCP
   */
  static async fetchSCP(client, id) {
    const server = await client.guilds.cache.get(process.env.guildId);
    const SCPDB = await server.channels.cache
      .get(process.env.SCPDB)
      .messages.fetch();

    const scpArray = Array.from(SCPDB.values());
    const foundscp = scpArray.find((element) => {
      const split = element.content.split("|");
      return split[0] === id.toString();
    });

    if (!foundscp) {
      let reply = await axios.get(
        `https://www.googleapis.com/customsearch/v1?q=SCP-${id} png&searchType=image&cx=463e7e2a605284f03&key=AIzaSyDMRUKEOQ9I2UZ1ktQc19lzukZnExajfbM&imgSize=medium`
      );
      reply = reply.data.items;
      reply.forEach((element) => {
        if (element.link.includes("https://i.ytimg.com/v")) {
          reply.splice(reply.indexOf(element), 1);
        }
      });
      return new SCP(client, id, reply[0].link, null, null, null, null);
    }

    const split = foundscp.content.split("|");
    const rank = await server.roles.cache.get(split[2]);
    return new SCP(
      client,
      id,
      split[split.length - 1],
      split[1],
      rank,
      split[3],
      split[4]
    );
  }
}

module.exports = { SCP };
