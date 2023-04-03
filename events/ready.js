const { Events, ActivityType } = require("discord.js");
const { RemoveAbsence } = require("../functions/absences");
const { SCP } = require("../functions/scp");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    client.user.setStatus("idle");
    client.user.setActivity("Démarrage du Bot", {
      type: ActivityType.Streaming,
    });
    /**
     * Check des absences
     */
    console.log("Check des Absences");
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
    console.log("Supresssion des CET Daily et Weekly");
    const cetlogs = await client.guilds.cache
      .get(process.env.guildId)
      .channels.cache.get(process.env.cetlogs);
    const cetdaily = await client.guilds.cache
      .get(process.env.guildId)
      .channels.cache.get(process.env.cetdaily);
    const cetdailyarray = await cetdaily.messages.fetch();
    const cetweekly = await client.guilds.cache
      .get(process.env.guildId)
      .channels.cache.get(process.env.cetweeklog);
    const cetweeklyarray = await cetweekly.messages.fetch();
    await Promise.all(cetdailyarray.map((v) => v.delete()));
    const today = new Date();
    if (today.getDay() === 1)
      await Promise.all(cetweeklyarray.map((v) => v.delete()));
    console.log("Check des CET");
    const arraycet = await cetlogs.messages.fetch();
    await Promise.all(
      arraycet.map(async (v) => {
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
        if (DateNow - infos[2] >= 115200 && infos[3] === "needcheck") {
          // 32 heures de delais
          await thescp.changeCetStatus("needcheckpriority");
        } else if (DateNow - infos[2] >= 57600 && infos[3] === "operational") {
          // 16 heures de delais
          await thescp.changeCetStatus("needcheck");
        }
      })
    );
    console.log(`Ready! Logged in as ${client.user.tag}`);
    client.user.setStatus("online");
    client.user.setActivity("Les Gacha du Dr Dominus", {
      type: ActivityType.Watching,
    });
  },
};
