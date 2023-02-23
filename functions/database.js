/**
 * Renvoie un dictionnaire à partir d'un embed
 * @param {string} message
 * @typedefs {Object<string>}
 */
function split(message) {
  if (typeof message !== "string")
    throw new TypeError(`waiting for string but received ${typeof message}`);
  let value = message.replaceAll("*", "");
  value = value.replaceAll(" ", "");
  const array = value.split(":").join(",").split("\n").join(",").split(",");
  const dic = [];
  for (let i = 0; i < array.length; i += 2) {
    dic[array[i]] = array[i + 1];
  }
  return dic;
}

module.exports = { split };
