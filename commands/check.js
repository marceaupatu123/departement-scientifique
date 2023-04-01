const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("check")
    .setDescription("Permet de check les permissions"),
  async execute(interaction) {
    let checkmessage = "";
    async function checkPermission(
      permission,
      channelid = null,
      clientperm = false,
      message = null
    ) {
      let realmessage = message;
      if (!message) {
        if (permission === "ViewChannel") {
          realmessage = `Voir le channel <#${channelid}>`;
        } else if (permission === "SendMessages") {
          realmessage = `Parler dans le channel <#${channelid}>`;
        } else if (permission === "ManageMessages") {
          realmessage = `Gérer les messages dans le channel <#${channelid}>`;
        }
      }
      checkmessage = `${checkmessage}\n${realmessage}`;
      let status = "";
      try {
        let perm = false;
        if (clientperm) {
          perm = await interaction.guild.members.me.permissions.has(permission);
        } else {
          perm = await interaction.guild.channels.cache
            .get(channelid)
            .permissionsFor(interaction.client.user)
            .has(permission);
        }
        status = perm ? "✅" : "❌";
      } catch (e) {
        console.log(e);
        status = "❌";
      } finally {
        checkmessage = `${checkmessage} ${status}`;
        await interaction.editReply(checkmessage);
      }
    }
    await interaction.reply({
      content: "Controle des permissions en cours ⌛",
      ephemeral: true,
    });
    await checkPermission("ViewChannel", process.env.SalonAbsenceLogs);
    await checkPermission("SendMessages", process.env.SalonAbsenceLogs);
    await checkPermission("ViewChannel", process.env.SalonBlamelogs);
    await checkPermission("SendMessages", process.env.SalonBlamelogs);
    await checkPermission("ViewChannel", process.env.SalonExperienceValide);
    await checkPermission("SendMessages", process.env.SalonExperienceValide);
    await checkPermission("ViewChannel", process.env.SalonAbsenceEmbed);
    await checkPermission("SendMessages", process.env.SalonAbsenceEmbed);
    await checkPermission("ManageRoles", null, true, "Gérer les rôles");
    await checkPermission("ViewChannel", process.env.SCPDB);
    await checkPermission("SendMessages", process.env.SCPDB);
    await checkPermission("ViewChannel", process.env.cetlogs);
    await checkPermission("SendMessages", process.env.cetlogs);
    await checkPermission("ViewChannel", process.env.cetembedlogssafe);
    await checkPermission("SendMessages", process.env.cetembedlogssafe);
    await checkPermission("ViewChannel", process.env.cetembedlogsketer);
    await checkPermission("SendMessages", process.env.cetembedlogsketer);
    await checkPermission("ViewChannel", process.env.cetembedlogseuclide);
    await checkPermission("SendMessages", process.env.cetembedlogseuclide);
    await checkPermission("ViewChannel", process.env.cetdaily);
    await checkPermission("SendMessages", process.env.cetdaily);
    await checkPermission("ViewChannel", process.env.cetweeklog);
    await checkPermission("SendMessages", process.env.cetweeklog);
  },
};
