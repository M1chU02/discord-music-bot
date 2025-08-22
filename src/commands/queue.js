import { SlashCommandBuilder } from "discord.js";
export const data = new SlashCommandBuilder().setName("queue").setDescription("Pokaż kolejkę");
export async function execute({ interaction, distube }) {
  const q = distube.getQueue(interaction.guildId);
  if (!q || !q.songs?.length) return interaction.reply({ content: "Kolejka pusta.", ephemeral: true });
  const lines = q.songs.map((s, i) => `${i === 0 ? "▶️" : `${i}.`} ${s.name} (${s.formattedDuration || "—"})`);
  return interaction.reply(lines.slice(0, 15).join("\n")); // 15 pierwszych pozycji
}
