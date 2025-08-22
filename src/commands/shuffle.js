import { SlashCommandBuilder } from "discord.js";
export const data = new SlashCommandBuilder().setName("shuffle").setDescription("Wymieszaj kolejkę");
export async function execute({ interaction, distube }) {
  const q = distube.getQueue(interaction.guildId);
  if (!q || q.songs.length < 3) return interaction.reply({ content: "Za mało utworów do miksowania.", ephemeral: true });
  q.shuffle();
  return interaction.reply("🔀 Wymieszano kolejkę.");
}
