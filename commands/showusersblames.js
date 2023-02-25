require("dotenv").config();
const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder,
} = require("discord.js");
const { GetMemberBlame } = require("../functions/blames");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Afficher les blâmes")
    .setType(ApplicationCommandType.User),
  async execute(interaction) {
    const member = interaction.targetMember;
    const blames = await GetMemberBlame(interaction.client, member);
    if (blames.length === 0)
      return interaction.reply({
        content: "🤷‍♀️ Cet utilisateur est plutot sage car il n'a pas de blâmes",
        ephemeral: true,
      });
    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle(`📜 | Liste des blâmes de ${member.displayName}`)
      .setThumbnail("https://cdn-icons-png.flaticon.com/512/1022/1022300.png");
    blames.forEach((blame, index) => {
      const fakeindex = index + 1;
      embed.addFields({
        name: `⚖️ | Blâme ${fakeindex}`,
        value: `**ID**: ${blame.id}\n**Superviseur:** ${blame.superviseur}\n **Raison:** ${blame.raison}`,
        inline: false,
      });
    });
    return interaction.reply({ content: "", embeds: [embed], ephemeral: true });
  },
};
