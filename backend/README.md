# RPG Table Manager - Backend

## Prerequisites
- Java 21
- Gradle (or use the wrapper)

## Running

```bash
cd backend
./gradlew bootRun
```

The server will start on `http://localhost:8080`.

## API Endpoints

### Campaigns
- `POST /campaigns` - Create campaign
- `GET /campaigns/{id}` - Get campaign
- `POST /campaigns/join` - Join campaign with joinCode
- `GET /campaigns/{id}/players` - List campaign players

### Players
- `POST /players` - Create player
- `GET /players/{id}` - Get player

### Characters
- `POST /characters` - Create character
- `GET /characters/{id}` - Get character
- `PUT /characters/{id}` - Update character
- `GET /players/{playerId}/character` - Get player's character
- `POST /characters/{id}/damage` - Apply damage
- `POST /characters/{id}/heal` - Heal character
- `POST /characters/{id}/spell-slots` - Add spell slot
- `PUT /spell-slots/{id}` - Update spell slot

### Combat
- `POST /combats/start?campaignId={id}` - Start combat
- `POST /combats/{id}/roll-initiative` - Set initiative order
- `POST /combats/{id}/next-turn` - Advance turn
- `GET /combats/{id}` - Get combat state

### Dice
- `POST /dice/roll` - Roll dice (e.g. `{"expression": "2d6+3"}`)

### WebSocket
- Endpoint: `/ws` (STOMP over SockJS)
- Send: `/app/chat.send`
- Subscribe: `/topic/campaign/{id}/chat`, `/topic/combat`, `/topic/events`
