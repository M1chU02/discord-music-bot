import { SlashCommandBuilder, ChannelType, PermissionFlagsBits } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Odtwórz z YouTube/Spotify lub wyszukaj frazę")
  .addStringOption(o => o.setName("query").setDescription("Link lub fraza").setRequired(true));

export async function execute({ interaction, distube }) {
  const query = interaction.options.getString("query", true);
  const member = interaction.member;
  const voice = member?.voice?.channel;

  if (!voice || voice.type !== ChannelType.GuildVoice)
    return interaction.reply({ content: "Wejdź na kanał głosowy.", ephemeral: true });

  const me = interaction.guild.members.me;
  const perms = voice.permissionsFor(me);
  if (!perms?.has(PermissionFlagsBits.Connect) || !perms?.has(PermissionFlagsBits.Speak))
    return interaction.reply({ content: "Brak uprawnień do dołączenia/mówienia.", ephemeral: true });

  await interaction.deferReply();
  try {
    await distube.play(voice, query, { member, textChannel: interaction.channel, interaction });
    await interaction.editReply("Dodano do kolejki! ✅");
  } catch (e) {
    console.error(e);
    await interaction.editReply("Nie udało się odtworzyć źródła. Spróbuj innego linku/frazy.");
  }
}
