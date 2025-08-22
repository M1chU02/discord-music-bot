import { SlashCommandBuilder } from "discord.js";
export const data = new SlashCommandBuilder().setName("resume").setDescription("Wznów");
export async function execute({ interaction, distube }) {
  const q = distube.getQueue(interaction.guildId);
  if (!q) return interaction.reply({ content: "Nic nie gra.", ephemeral: true });
  q.resume();
  return interaction.reply("▶️ Wznowiono.");
}
