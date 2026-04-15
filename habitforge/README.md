# HabitForge 🔥 

The premier gamified habit tracker and AI learning path platform structurally built as a dark, premium, "Zero-Blue" digital forge tracking continuous human growth.

![License](https://img.shields.io/badge/license-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![NestJS](https://img.shields.io/badge/NestJS-10-red)

## Overview 🚀
HabitForge shifts standard passive tracking into an aggressive Gamified progression model. By mapping streaks against native multipliers tracking towards dynamic group leaderboards natively, user loops become substantially stronger over time. Supported via deep Gemni generation endpoints scaling AI driven learning Paths dynamically.

## Quick Start (Local Development) 🛠

### Prerequisites
- Node.js (v20+)
- PostgreSQL configured locally or remotely 

### 1. Backend (`/habitforge-api`)
```bash
cd habitforge-api
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```
Ensure your `.env` contains valid pointers for:
- `DATABASE_URL`
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`
- `GEMINI_API_KEY`

### 2. Frontend (`/habitforge`)
```bash
cd habitforge
npm install
npm run dev
```

## System Maps 🗺
- **/analytics**: Recharts-driven native heatmaps charting XP generation telemetry securely.
- **/social**: Group tracking loops alongside dynamic flex-podium structural bounding resolving Global Rank telemetry.
- **/paths**: AI-Generated JSON objectives split natively into modular steps. 

## Deployment 🌐
- **Frontend (Vercel)**: Automatically tracks against `vercel.json` and outputs `standalone` clusters over the native `.next` bundles natively. 
- **Backend (Render)**: Automatically provisions PostgreSQL bindings internally mapping through the custom `render.yaml` scaling node natively inside `Dockerfile` layers.

## Contributing 🤝
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📜
Distributed under the MIT License. See `LICENSE` for more information.
