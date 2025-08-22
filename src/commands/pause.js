import { SlashCommandBuilder } from "discord.js";
export const data = new SlashCommandBuilder().setName("pause").setDescription("Wstrzymaj");
export async function execute({ interaction, distube }) {
  const q = distube.getQueue(interaction.guildId);
  if (!q) return interaction.reply({ content: "Nic nie gra.", ephemeral: true });
  q.pause();
  return interaction.reply("⏸️ Wstrzymano.");
}
