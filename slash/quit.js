const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("quit")
    .setDescription("Quit the current voice channel"),

  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guildId);

    if (!queue)
      return await interaction.editReply(`There are no songs in the queue!`);

    queue.destroy();
    await interaction.editReply(`Disconnected from the voice channel!`);
  },
};
