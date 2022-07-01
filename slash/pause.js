const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause the current song"),

  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guildId);

    if (!queue)
      return await interaction.editReply(`There are no songs in the queue!`);

    queue.setPause(true);
    await interaction.editReply(
      `Music has been paused! ` / resume` to resume the music `
    );
  },
};
