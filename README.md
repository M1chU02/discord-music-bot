# Discord Music Bot (naprawiony)

Stabilny, prosty bot muzyczny oparty o `discord.js` + `DisTube`, z obsługą linków YouTube i Spotify.

## Wymagania
- Node.js >= 18.17.0 (zalecane 20 LTS)
- Token bota Discord oraz zarejestrowana aplikacja (CLIENT_ID)
- (Opcjonalnie) ID serwera (GUILD_ID) do szybkiej rejestracji komend w jednej gildii
- FFmpeg nie jest wymagany systemowo — używamy `ffmpeg-static`

## Instalacja
```bash
npm i
```

Utwórz plik `.env`:
```env
DISCORD_TOKEN=twoj_bot_token
CLIENT_ID=twoje_client_id
# Opcjonalnie na czas developmentu (komendy rejestrowane w 1 gildii w kilka sekund)
GUILD_ID=id_twojego_serwera
```

Zarejestruj komendy:
```bash
npm run register
```

Uruchom bota:
```bash
npm start
```

## Komendy
- `/play <query>` — link (YouTube/Spotify) lub fraza
- `/skip`
- `/stop`
- `/pause`
- `/resume`
- `/volume <0-100>`
- `/nowplaying`
- `/queue`
- `/shuffle`

## Uwaga dot. Spotify
Wtyczka Spotify służy do rozwiązywania linków (mapowanie na źródła do odtwarzania), nie streamujemy bezpośrednio ze Spotify.
Zwykle nie są potrzebne żadne klucze API — bot wyszukuje odpowiedniki na YouTube.

## Najczęstsze problemy
- **Komendy nie pojawiają się**: Użyj `GUILD_ID` i `npm run register` na czas developmentu. Globalne komendy mogą propagować się do ~1h.
- **Bot nie dołącza do kanału**: Sprawdź uprawnienia bota na kanale głosowym (`Connect`, `Speak`).
- **Brak dźwięku**: Na hostingach bez natywnych bibliotek audio używamy `opusscript` + `ffmpeg-static`.
- **Błędy odtwarzania z YouTube**: Spróbuj innego linku lub frazy. Możesz też zamienić źródło wtyczki YouTube (yt-dlp/innertube).
