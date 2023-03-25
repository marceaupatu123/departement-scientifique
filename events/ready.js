const { Events, ActivityType } = require("discord.js");
const { RemoveAbsence } = require("../functions/absences");
const { SCP } = require("../functions/scp");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    client.user.setStatus("online");
    client.user.setActivity("Les Gacha du Dr Dominus", {
      type: ActivityType.Watching,
    });
    /**
     * Check des absences
     */
    const guild = client.guilds.cache.get(process.env.guildId);
    const members = await guild.members.fetch();
    const absencelog = client.guilds.cache
      .get(process.env.guildId)
      .channels.cache.get(process.env.SalonAbsenceLogs);
    const arrayabsence = await absencelog.messages.fetch();
    arrayabsence.forEach((v) => {
      const infos = v.content.split("|");
      const DateNow = Date.now() / 1000;
      if (infos[2] - DateNow < 0) {
        const memberId = v.mentions.users.first().id;
        const member = members.get(memberId);
        if (!member) return;
        RemoveAbsence(member);
      }
    });
    /**
     * Check des CET
     */
    const cetlogs = await client.guilds.cache
      .get(process.env.guildId)
      .channels.cache.get(process.env.cetlogs);
    const arraycet = await cetlogs.messages.fetch();
    const promise = arraycet.map(async (v) => {
      const infos = v.content.split("|");
      if (
        !(
          infos[3] === "operational" ||
          infos[3] === "needcheck" ||
          infos[3] === "needcheckpriority"
        )
      )
        return;
      const DateNow = Date.now() / 1000;
      const thescp = await SCP.fetchSCP(client, infos[0]);
      if (DateNow - infos[2] >= 20) {
        // 32 heures de delais
        await thescp.changeCetStatus("needcheckpriority");
      } else if (DateNow - infos[2] >= 5) {
        // 16 heures de delais
        await thescp.changeCetStatus("needcheck");
      }
    });
    await Promise.all(promise);
  },
};
