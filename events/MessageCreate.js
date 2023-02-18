const { Events } = require("discord.js");

const { SalonAbsenceLogs } = process.env;

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(message) {
    if (!message.mentions.members || message.author === message.client.user)
      return;
    const botlog = message.guild.channels.cache.get(SalonAbsenceLogs);
    const array = await botlog.messages.fetch();
    const mentioned = array.find(
      (logs) =>
        logs.mentions.members.first()?.id ===
        message.mentions.members.first()?.id
    );
    const infos = mentioned.content.split("|");
    if (mentioned) {
      message.reply(
        `${mentioned.mentions.members.first()} est absent depuis le <t:${
          infos[1]
        }:D> jusqu'au <t:${infos[2]}:D>.`
      );
    }
  },
};
