const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skipto")
    .setDescription("Skips to a certain track")
    .addNumberOption((option) =>
      option
        .setName("tracknumber")
        .setDescription("The track number to skip to")
        .setMinValue(1)
        .setRequired(true)
    ),

  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guildId);

    if (!queue)
      return await interaction.editReply(`There are no songs in the queue!`);

    const trackNum = interaction.options.getNumber("tracknumber");
    if (trackNum > queue.tracks.length)
      return await interaction.editReply(
        `There are only ${queue.tracks.length} tracks in the queue!`
      );
    queue.skipTo(trackNum - 1);
    await interaction.editReply(`Skipped ahead to track ${trackNum}!`);
  },
};
