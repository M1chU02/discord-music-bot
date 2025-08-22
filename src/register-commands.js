import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { REST, Routes } from "discord.js";
import { pathToFileURL } from "node:url";

const commands = [];
const commandsPath = path.join(process.cwd(), "src", "commands");

for (const file of fs.readdirSync(commandsPath)) {
  if (!file.endsWith(".js")) continue;
  const modPath = path.join(commandsPath, file);
  const mod = await import(pathToFileURL(modPath).href);
  commands.push(mod.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID; // opcjonalne: szybka rejestracja w 1 gildii

try {
  if (!clientId) throw new Error("Brak CLIENT_ID w .env");
  if (guildId) {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });
    console.log(
      `Zarejestrowano ${commands.length} komend w gildii ${guildId}.`
    );
  } else {
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log(`Zarejestrowano ${commands.length} komend GLOBALNIE.`);
    console.log("Globalne komendy mogą potrzebować do 1h na propagację.");
  }
} catch (e) {
  console.error("Błąd rejestracji komend:", e);
  process.exitCode = 1;
}
