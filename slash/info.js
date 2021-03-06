const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Displays info about the curent song"),

  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guildId);

    if (!queue)
      return await interaction.editReply(`There are no songs in the queue!`);

    let bar = queue.createProgressBar({
      queue: false,
      length: 19,
    });

    const song = queue.current;

    await interaction.editReply({
      emneds: [
        new MessageEmbed()
          .setThumbnail(song.thumbnail)
          .setDescription(
            `Currently Playing \n\`[${song.duration}]\`${song.title} ` + bar
          ),
      ],
    });
  },
};
