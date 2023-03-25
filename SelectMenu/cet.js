const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

const menucetincident = new ActionRowBuilder().addComponents(
  new StringSelectMenuBuilder()
    .setCustomId("selectcet")
    .setPlaceholder("Rien de selectionné")
    .addOptions(
      {
        label: "Brèche",
        description: "Le SCP à rompu son confinement.",
        value: "breach",
      },
      {
        label: "Dégats Mineurs",
        description: "Dommages mineurs dans le confinement.",
        value: "minor",
      }
    )
);

module.exports = { menucetincident };
