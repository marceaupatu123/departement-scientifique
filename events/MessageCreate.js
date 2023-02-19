const { Events } = require("discord.js");

const { SalonAbsenceLogs } = process.env;

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(message) {
    if (
      !message.mentions.members.first() ||
      message.author === message.client.user
    )
      return;
    const botlog = message.guild.channels.cache.get(SalonAbsenceLogs);
    const array = await botlog.messages.fetch();
    const mentioned = array.find(
      (logs) =>
        logs.mentions.members.first()?.id ===
        message.mentions.members.first()?.id
    );
    if (mentioned) {
      const infos = mentioned.content.split("|");
      message.reply({
        content: `${mentioned.mentions.members.first()} est absent depuis le <t:${
          infos[1]
        }:D> jusqu'au <t:${infos[2]}:D>.`,
        ephemeral: true,
      });
    }
  },
};
