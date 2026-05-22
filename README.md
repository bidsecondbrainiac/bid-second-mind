# BID Second Brain

AI-powered knowledge base with interactive knowledge graph for the Behavioural Insights & Design Thinking team.

**Cost: $0/month** — Google Gemini free tier + Vercel free hosting.

## Features

- **Knowledge Graph** — Interactive force-directed graph showing 30 concepts and how they connect. Filter by category, click to explore, hover to highlight connections.
- **AI Chat** — Ask questions about your team's knowledge base. Powered by Google Gemini (free).
- **Click-to-ask** — Click any node in the graph, then "Ask the Brain about this" to jump to chat.

## Quick Setup

1. Get a free Gemini API key from [aistudio.google.com](https://aistudio.google.com)
2. Push this project to GitHub
3. Deploy on [Vercel](https://vercel.com) — set `GEMINI_API_KEY` as environment variable
4. Share the link with your team

## Files

```
bid-second-brain/
├── app/
│   ├── layout.js              ← Page shell (title, fonts)
│   ├── page.js                ← Knowledge graph + chat interface
│   └── api/chat/route.js      ← Server-side AI handler (Gemini)
├── lib/
│   └── knowledge-base.js      ← Your team's knowledge base content
├── package.json               ← Dependencies (Next.js, React, D3)
├── next.config.js
└── .gitignore
```

## Updating

1. Edit `lib/knowledge-base.js` with new content
2. Commit & push to GitHub
3. Vercel auto-deploys in ~2 minutes
