import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  EmbedBuilder,
} from "discord.js";
import { DisTube } from "distube";
import { SpotifyPlugin } from "@distube/spotify";
import { YouTubePlugin } from "@distube/youtube";

// --- Client setup ---
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
  ],
  partials: [Partials.Channel],
});

// Load commands dynamically (Windows-friendly)
client.commands = new Collection();
const registerLocalCommands = async () => {
  const { readdir } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const { pathToFileURL } = await import("node:url");
  const commandsPath = join(process.cwd(), "src", "commands");
  const files = await readdir(commandsPath);
  for (const file of files) {
    if (!file.endsWith(".js")) continue;
    const mod = await import(pathToFileURL(join(commandsPath, file)).href);
    client.commands.set(mod.data.name, {
      data: mod.data,
      execute: mod.execute,
    });
  }
};

// --- DisTube setup ---
// Usunięto: emitNewSongOnly, leaveOnFinish, leaveOnStop, leaveOnEmpty (nie są już wspierane)
// Pluginy bez opcji, bo ich stare opcje też są odrzucone.
export const distube = new DisTube(client, {
  plugins: [new YouTubePlugin(), new SpotifyPlugin()],
});

// --- DisTube events (logs + nice embeds) ---
const status = (q) =>
  `Głośność: ${q.volume}% | Filtry: ${
    q.filters.names.join(", ") || "brak"
  } | Pętla: ${
    q.repeatMode ? (q.repeatMode === 2 ? "kolejka" : "utwór") : "off"
  } | Autoplay: ${q.autoplay ? "on" : "off"}`;

distube
  .on("playSong", (queue, song) => {
    const e = new EmbedBuilder()
      .setTitle("▶️ Odtwarzanie")
      .setDescription(`**${song.name}**`)
      .addFields(
        { name: "Czas", value: song.formattedDuration || "—", inline: true },
        { name: "Status", value: status(queue), inline: false }
      );
    queue.textChannel?.send({ embeds: [e] }).catch(() => {});
  })
  .on("addSong", (queue, song) => {
    queue.textChannel
      ?.send(`➕ Dodano: **${song.name}** (${song.formattedDuration})`)
      .catch(() => {});
  })
  .on("addList", (queue, playlist) => {
    queue.textChannel
      ?.send(
        `📃 Dodano playlistę: **${playlist.name}** (${playlist.songs.length} utworów)`
      )
      .catch(() => {});
  })
  .on("error", (channel, error) => {
    console.error("DisTube error:", error);
    if (channel?.send) channel.send("😵 Wystąpił błąd odtwarzania.");
  })
  .on("finish", (queue) => {
    queue.textChannel?.send("✅ Kolejka zakończona.").catch(() => {});
  });

// --- Interaction handling ---
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) return;
  try {
    await cmd.execute({ interaction, client, distube });
  } catch (err) {
    console.error(err);
    if (interaction.deferred || interaction.replied) {
      await interaction
        .followUp({ content: "Coś poszło nie tak 😵", ephemeral: true })
        .catch(() => {});
    } else {
      await interaction
        .reply({ content: "Coś poszło nie tak 😵", ephemeral: true })
        .catch(() => {});
    }
  }
});

client.once("ready", async () => {
  console.log(`Zalogowano jako ${client.user.tag}`);
});

// Boot
await registerLocalCommands();
client.login(process.env.DISCORD_TOKEN);
