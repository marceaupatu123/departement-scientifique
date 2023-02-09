require("dotenv").config()
const {ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js');
const { modal } = require("../modals/blame")
const SalonBlamelogs = process.env.SalonBlamelogs, SalonBlame = process.env.SalonBlame
const Superviseur = process.env.Superviseur
const { Allowed, NotAllowed, Delais } = require("../json/messages.json")

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Mettre un blâme')
	    .setType(ApplicationCommandType.User),
	async execute(interaction) {
        if (!interaction.member.roles.cache.some(role => role.id == Superviseur)) return interaction.reply({content: NotAllowed, ephemeral: true})
		const user = interaction.targetUser;
        const botlog = interaction.guild.channels.cache.get(SalonBlamelogs);
        await interaction.showModal(modal)
        let modalinteraction = null
        try { modalinteraction = await interaction.awaitModalSubmit({ time: 60000 })} 
        catch(e) {return console.log(e)}
        await botlog.send(`${user}|${interaction.member}|${modalinteraction.fields.getTextInputValue('raison')}`)
        const array = await botlog.messages.fetch()
        let keys = 0
        array.forEach(element => {
            const split = element.content.split("|")
            const wow = split[0].search(`${user}`)
            if (wow > -1 ) keys += 1
        });
        const embed = new EmbedBuilder()
				.setColor("#ff0000")
				.setTitle('🔔 | Notification de blâme')
				.setThumbnail('https://cdn-icons-png.flaticon.com/512/1022/1022300.png')
				.addFields(
					{ name: "📁 | Informations sur le blame", value: `**Superviseur:** ${interaction.user}\n **Raison:** ${modalinteraction.fields.getTextInputValue('raison')}`, inline: false }
				)
                .setDescription(`Vous avez reçu un nouveau blâme, veuillez faire attention à l'avenir.\nVous avez désormais un total de **${keys}** blâme(s) actif(s).`)
        user.send({content: '', ephemeral: false, embeds: [embed]})
        modalinteraction.guild.channels.cache.get(SalonBlame).send({content: '', ephemeral: false, embeds: [embed]})
        modalinteraction.reply({content: Allowed, ephemeral: true})
	},
}