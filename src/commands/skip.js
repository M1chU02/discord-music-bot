import { SlashCommandBuilder } from "discord.js";
export const data = new SlashCommandBuilder().setName("skip").setDescription("Pomiń utwór");
export async function execute({ interaction, distube }) {
  const q = distube.getQueue(interaction.guildId);
  if (!q) return interaction.reply({ content: "Nic nie gra.", ephemeral: true });
  await q.skip().catch(() => {});
  return interaction.reply("⏭️ Pominięto.");
}
