import { SlashCommandBuilder } from "discord.js";
export const data = new SlashCommandBuilder().setName("stop").setDescription("Zatrzymaj i wyjdź");
export async function execute({ interaction, distube }) {
  const q = distube.getQueue(interaction.guildId);
  if (!q) return interaction.reply({ content: "Nic nie gra.", ephemeral: true });
  q.stop();
  return interaction.reply("⏹️ Zatrzymano odtwarzanie.");
}
