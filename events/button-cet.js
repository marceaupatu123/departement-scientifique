const { Events } = require("discord.js");
const { splitEmbed } = require("../functions/database");
const { SCP } = require("../functions/scp");
const { Allowed } = require("../json/messages.json");
const { menucetincident } = require("../selectmenu/cet");

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(button) {
    if (
      !button.isButton() ||
      !(button.customId === "cetdone" || button.customId === "incident")
    )
      return;
    const SCPNumber = splitEmbed(
      button.message.embeds[0].fields[0].value
    ).Objet;
    const thescp = await SCP.fetchSCP(button.client, SCPNumber);
    if (button.customId === "cetdone") {
      await thescp.changeCetStatus("operational", button.member);
      await button.deferReply({ ephemeral: true });
    }
    if (button.customId === "incident") {
      const replyfirst = await button.reply({
        content: "Selectionnez votre Incident",
        components: [menucetincident],
        ephemeral: true,
      });
      const selectmenu = await replyfirst.awaitMessageComponent({
        time: 15_000,
      });
      await thescp.changeCetStatus(selectmenu.values[0], button.member);
    }
    await button.editReply({
      content: Allowed,
      ephemeral: true,
      components: [],
    });
  },
};
