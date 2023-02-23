class Blâme {
  constructor(id, memberblamed, superviseur, raison) {
    this.id = id;
    this.memberblamed = memberblamed;
    this.superviseur = superviseur;
    this.raison = raison;
  }
}

/**
 * Renvoie un dictionnaire à partir d'un embed
 * @param {string} message
 * @typedefs {Object<string>}
 */
function split(message) {
  let value = message.replaceAll("*", "");
  value = value.replaceAll(" ", "");
  const array = value.split(":").join(",").split("\n").join(",").split(",");
  const dic = [];
  for (let i = 0; i < array.length; i += 2) {
    dic[array[i]] = array[i + 1];
  }
  return dic;
}

/**
 * Renvoie tout les blâmes d'une personnes
 * @param {TextChannel} logssalon
 * @param {GuildMember} member
 * @returns {Promise.<Array.<Blâme>}
 */
async function GetMemberBlame(logssalon, member) {
  const array = await logssalon.messages.fetch();
  const BlameArray = [];
  array.forEach((message) => {
    const splited = message.content.split("|");
    if (splited[1] === `${member}`) {
      BlameArray.push(
        new Blâme(splited[0], splited[1], splited[2], splited[3])
      );
    }
  });
  return BlameArray;
}

module.exports = { split, GetMemberBlame };
