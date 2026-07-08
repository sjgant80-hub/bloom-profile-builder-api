# @ai-native-solutions/bloom-profile-builder-api

HTTP REST proxy for [`@ai-native-solutions/bloom-profile-builder-sdk`](https://github.com/sjgant80-hub/bloom-profile-builder-sdk).

Zero external deps beyond Node + the SDK. Runs anywhere Node runs. Docker-ready.

## Run

### Node

```bash
npx @ai-native-solutions/bloom-profile-builder-api
# bloom-profile-builder-api · listening on http://0.0.0.0:4210 · sdk v1.0.0
```

### Docker

```bash
docker build -t bloom-profile-builder-api .
docker run --rm -p 4210:4210 bloom-profile-builder-api
```

### Docker Compose

```bash
docker compose up -d
```

Config: `PORT` (default 4210), `HOST` (default 0.0.0.0).

## Endpoints

| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/` | — | Metadata + endpoint list |
| GET | `/health` | — | `{ ok, ts }` |
| GET | `/probes` | — | Full probe library (21 probes) |
| GET | `/rings` | — | The 7 rings |
| GET | `/likert` | — | The likert scale |
| GET | `/kappa-bands` | — | The 7 κ depth bands |
| POST | `/next-probe` | `{ session_state }` | `{ probe, done }` |
| POST | `/score` | `{ score, ring, text? }` | `{ ring, score, ring_delta, text_band }` |
| POST | `/profile` | `{ session_state }` | `{ profile }` |
| POST | `/export` | `{ profile, indent? }` | `{ blob, mimeType, filename }` |
| POST | `/live` | `{ session_state }` | `{ bloom, foldNumber, stateSum, signature, band, omega }` |
| POST | `/radial` | `{ bloom, size? }` | `{ svg }` |
| POST | `/classify-kappa` | `{ text }` | `{ name, glyph, ring, min, max }` |

## Example

```bash
curl -sX POST http://localhost:4210/classify-kappa \
     -H 'content-type: application/json' \
     -d '{"text":"i feel this is grieving to be finished"}'
# {"min":0.6,"max":0.8,"name":"heart","glyph":"♡","ring":3,"orphan":true}

curl -sX POST http://localhost:4210/next-probe \
     -H 'content-type: application/json' \
     -d '{"session_state":{"answers":[]}}'
# {"probe":{"idx":0,"ring":0,"glyph":"●","name":"ground","q":"When a problem lands..."},"done":false}

curl -s http://localhost:4210/rings
# {"rings":[{"idx":0,"glyph":"●","name":"ground",...},...]}
```

## Related

- SDK: [`@ai-native-solutions/bloom-profile-builder-sdk`](https://github.com/sjgant80-hub/bloom-profile-builder-sdk)
- MCP: [`@ai-native-solutions/bloom-profile-builder-mcp`](https://github.com/sjgant80-hub/bloom-profile-builder-mcp)

## License

MIT - © 2026 AI-Native Solutions
