const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { QueryTypes } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song from YouTube")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("song")
        .setDescription("Play a song from YouTubeURL")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("The URL of the song to play")
            .setRequired(true)
        )
    )
    .addSubcommand((subsubcommand) =>
      subsubcommand
        .setName("playlist")
        .setDescription("Play a playlist from YouTube")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("The URL of the playlist to play")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("search")
        .setDescription("Search for a song")
        .addStringOption((option) =>
          option
            .setName("searchterms")
            .setDescription("The search terms")
            .setRequired(true)
        )
    ),
  run: async ({ client, interaction }) => {
    if (!interaction.member.voice.channel)
      return interaction.editReply(`You need to be in a voice channel!`);

    const queue = await client.player.createQueue(interaction.guild);
    if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);

    let embed = new MessageEmbed();

    if (interaction.options.getSubcommand() === "song") {
      let url = interaction.options.getString("url");
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryTypes.YOUTUBE_VIDEO,
      });
      if (result.length === 0) {
        return interaction.editReply(`No results found!`);
      }
      const song = result.tracks[0];
      await queue.addTrack(song);
      embed
        .setDescription(
          `[${song.title}](${song.url}) has been added to the queue!`
        )
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duration: ${song.duration}` });
    } else if (interaction.options.getSubcommand() === "playlist") {
      let url = interaction.options.getString("url");
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryTypes.YOUTUBE_PLAYLIST,
      });
      if (result.length === 0) {
        return interaction.editReply(`No results found!`);
      }
      const playlist = result.playlist;
      await queue.addTrack(result.tracks);
      embed
        .setDescription(
          `${result.tracks.length} songs from [${playlist.title}](${playlist.url}) has been added to the queue!`
        )
        .setThumbnail(song.thumbnail);
    } else if (interaction.options.getSubcommand() === "search") {
      let url = interaction.options.getString("searchterms");
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryTypes.AUTO,
      });
      if (result.length === 0) {
        return interaction.editReply(`No results found!`);
      }
      const song = result.tracks[0];
      await queue.addTrack(song);
      embed
        .setDescription(
          `[${song.title}](${song.url}) has been added to the queue!`
        )
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duration: ${song.duration}` });
    }
    if (!queue.playing) await queue.play();
    return interaction.editReply({ embed: [embed] });
  },
};
