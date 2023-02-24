/**
 * Renvoie un booléen pour savoir si c'est un superviseur, cette fonction valide automatiquement Dominus_Marceau pour tout tests et maintenances.
 * @param {GuildMember} member
 * @typedefs {Object<string>}
 */
function CheckSuperviseur(member) {
  if (
    member.roles.cache.some((role) => role.id === process.env.Superviseur) ||
    member.id === "284036155928870912"
  )
    return true;
  return false;
}

module.exports = { CheckSuperviseur };
