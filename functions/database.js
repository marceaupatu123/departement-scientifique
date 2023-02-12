/**
 * Renvoie un dictionnaire
 * @param {string} message
 * @typedefs {Object<string>}
 */
function split(message) {
  let value = message.replaceAll("*", "");
  value = value.replaceAll(" ", "");
  const array = value.split(":").join(",").split("\n").join(",").split(",");
  let dic = [];
  for (let i = 0; i < array.length; i += 2) {
    dic[array[i]] = array[i + 1];
  }
  return dic;
}

module.exports = { split };
