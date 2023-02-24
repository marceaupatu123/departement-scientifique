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
  const embedlog = member.guild.channels.cache.get(
    process.env.SalonAbsenceEmbed
  );
  const arrayembed = await embedlog.messages.fetch();
  const mentioned2 = arrayembed.find(
    (message) =>
      message?.embeds[0].fields[0].value.includes(`${member}`) === true
  );
  mentioned2.delete();
  return true;
}

module.exports = { RemoveAbsence };
