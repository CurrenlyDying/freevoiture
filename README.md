# FreeVoiture Knowledge Index

A static web app to index and search automotive software/protocol/workflow knowledge in one place.

## Features
- Full-text search across all indexable fields.
- Faceted filtering (brand, category, protocol, license, offline-capable).
- Weighted relevance scoring.
- Detail pane exposing full record metadata.
- Local saved searches via `localStorage`.

## Run locally
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000`.

## Data model
Records are stored in `app.js` and include:
- software/tool/protocol/workflow metadata
- aliases, compatibility, and limitations
- references and practical command examples

You can expand this into a larger dataset by adding entries to `records`.
