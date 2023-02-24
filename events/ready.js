const { Events, ActivityType } = require("discord.js");
const { RemoveAbsence } = require("../functions/absences");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    client.user.setActivity("Les Gacha du Dr Dominus", {
      type: ActivityType.Watching,
    });
    /**
     * Check des absences
     */
    const botlog = client.guilds.cache
      .get(process.env.guildId)
      .channels.cache.get(process.env.SalonAbsenceLogs);
    const array = await botlog.messages.fetch();
    const guild = client.guilds.cache.get(process.env.guildId);
    const members = await guild.members.fetch();
    array.forEach((v) => {
      const infos = v.content.split("|");
      const DateNow = Date.now() / 1000;
      if (infos[2] - DateNow < 0) {
        const memberId = v.mentions.users.first().id;
        const member = members.get(memberId);
        RemoveAbsence(member);
      }
    });
  },
};
