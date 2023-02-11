require("dotenv").config()
const { Events, EmbedBuilder } = require('discord.js');
const { modal } = require("../modals/suggestion.js")
const { Allowed } = require("../json/messages.json")
const SalonBlamelogs = process.env.SalonBlamelogs, SalonBlame = process.env.SalonBlame
const { split } = require("../functions/database")

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(button) {
        if (!button.isButton() || !(button.customId == "enlevecettemerde")) return
		const botlog = button.guild.channels.cache.get(SalonBlamelogs);
		const array = await botlog.messages.fetch()
		let value = button.message.embeds[0].fields[0].value
		const id = split(value)["ID"]
        const message = array.find(element => element.content.includes(id));
		message.delete()
		button.message.delete()
	}
}