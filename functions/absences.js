/**
 * Enlève l'absence d'un membre, renvoie un booléen si l'opération est faite avec succès.
 * @param {Client} client
 * @param {GuildMember} member
 * @typedefs {Object<string>}
 * @returns {Promise<boolean>}
 */
async function RemoveAbsence(client, member) {
  const guild = await client.guilds.cache.get(process.env.guildId);
  const botlog = guild.channels.cache.get(process.env.SalonAbsenceLogs);
  const array = await botlog.messages.fetch();
  const mentioned = array.find(
    (logs) => logs.mentions.users.first()?.id === member.id
  );
  const memberlists = await guild.members.fetch();
  const realmember = await memberlists.get(member.id);
  if (realmember) {
    await realmember.roles.remove(
      guild.roles.cache.get(process.env.RoleAbsent)
    );
  }
  await mentioned.delete();
  const embedlog = guild.channels.cache.get(process.env.SalonAbsenceEmbed);
  const arrayembed = await embedlog.messages.fetch();
  const mentioned2 = arrayembed.find(
    (message) =>
      message?.embeds[0]?.fields[0]?.value.includes(`${member}`) === true &&
      message.author === member.client.user
  );
  mentioned2.delete();
  return true;
}

module.exports = { RemoveAbsence };
