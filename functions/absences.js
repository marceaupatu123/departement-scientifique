/**
 * Enlève l'absence d'un membre, renvoie un booléen si l'opération est faite avec succès.
 * @param {GuildMember} member
 * @typedefs {Object<string>}
 */
async function RemoveAbsence(member) {
  const botlog = member.guild.channels.cache.get(process.env.SalonAbsenceLogs);
  const array = await botlog.messages.fetch();
  const mentioned = array.find(
    (logs) => logs.mentions.members.first()?.id === member.id
  );
  await member.roles.remove(
    member.guild.roles.cache.get(process.env.RoleAbsent)
  );
  await mentioned.delete();
  return true;
}

module.exports = { RemoveAbsence };
