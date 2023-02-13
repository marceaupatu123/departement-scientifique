const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

const menuderefus = new ActionRowBuilder().addComponents(
  new StringSelectMenuBuilder()
    .setCustomId("select")
    .setPlaceholder("Rien de selectionné")
    .addOptions(
      {
        label: "PCS",
        description: "Les PCS ne sont pas respectées.",
        value: "PCS",
      },
      {
        label: "Non Ethique",
        description: "L'expérience n'est pas éthique.",
        value: "ethic",
      },
      {
        label: "Inutile",
        description: "L'expérience n'est pas utile.",
        value: "notusefull",
      },
      {
        label: "Trop Couteux",
        description: "L'expérience est trop chère.",
        value: "expensive",
      }
    )
);

module.exports = { menuderefus };
