import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
export const data = new SlashCommandBuilder().setName("nowplaying").setDescription("Pokaż aktualnie odtwarzany utwór");
export async function execute({ interaction, distube }) {
  const q = distube.getQueue(interaction.guildId);
  if (!q || !q.songs?.length) return interaction.reply({ content: "Nic nie gra.", ephemeral: true });
  const song = q.songs[0];
  const e = new EmbedBuilder()
    .setTitle("🎶 Teraz gra")
    .setDescription(`**${song.name}**`)
    .addFields(
      { name: "Czas", value: song.formattedDuration || "—", inline: true },
      { name: "Głośność", value: `${q.volume}%`, inline: true },
      { name: "Kolejka", value: `${q.songs.length} utworów`, inline: true }
    );
  return interaction.reply({ embeds: [e] });
}
