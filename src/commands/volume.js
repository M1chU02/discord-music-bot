import { SlashCommandBuilder } from "discord.js";
export const data = new SlashCommandBuilder()
  .setName("volume")
  .setDescription("Ustaw głośność (0-100)")
  .addIntegerOption(o => o.setName("percent").setDescription("Procent").setMinValue(0).setMaxValue(100).setRequired(true));
export async function execute({ interaction, distube }) {
  const q = distube.getQueue(interaction.guildId);
  if (!q) return interaction.reply({ content: "Nic nie gra.", ephemeral: true });
  const v = interaction.options.getInteger("percent", true);
  q.setVolume(v);
  return interaction.reply(`🔊 Głośność: **${v}%**`);
}
