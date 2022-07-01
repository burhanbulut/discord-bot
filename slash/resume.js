const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resume the current song"),

  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guildId);

    if (!queue)
      return await interaction.editReply(`There are no songs in the queue!`);

    queue.setPause(false);
    await interaction.editReply(
      `Music has been paused! ` / pause` to pause the music `
    );
  },
};
