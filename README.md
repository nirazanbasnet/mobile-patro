# Mobile Patro (मोबाइल पात्रो)

A comprehensive, high-performance Nepali Calendar (Bikram Sambat) application built with React Native and Expo. This app provides a seamless experience for tracking Nepali dates, festivals, and personal events.

## 🌟 Key Features

- **Accurate BS Calendar**: Full Bikram Sambat calendar support with conversion to/from AD.
- **Festival Tracking**: Automatic updates for major and minor Nepali festivals, including public holidays.
- **Custom Holiday Marking**: Long-press any date on the grid to add your own personal holidays or events.
- **Monthly Event View**: Quick access to all events of the month with a smooth, auto-scroll to the current date.
- **Panchanga & Tithi**: Detailed daily information including sunrise, sunset, and Lunar Tithi.
- **Notes & Planning**: Add personal notes to specific dates for better organization.
- **Bilingual Support**: Full support for both English and Nepali languages.
- **AI Smart Add**: Type an event in plain language (*"sister's wedding on 15th Baisakh at 4 PM"*) and have the date, time, and title extracted automatically.
- **AI Ritual Guide**: Get a step-by-step guide and required-items list (Sait-Saaman) for the day's Tithi, in English or Nepali.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Recommended: v18+)
- [Bun](https://bun.sh/) (Fast package manager and runner)
- [Expo Go](https://expo.dev/go) app installed on your physical device (optional, for mobile testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd mobile-patro
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Configure the environment**
   ```bash
   cp .env.example .env
   ```
   The calendar works without any configuration. The two AI features additionally
   need `EXPO_PUBLIC_AI_PROXY_URL` — see [AI Features](#-ai-features) below. Without
   it the app runs normally and those two features report that they are unavailable.

4. **Start the development server**
   ```bash
   bun run start
   ```

### Running the App

- **Web Preview**: Press `w` in the terminal or run `bun run start-web`.
- **iOS Simulator**: Press `i` in the terminal.
- **Android Emulator**: Press `a` in the terminal.
- **Physical Device**: Scan the QR code shown in the terminal using the Expo Go app (Android) or the Camera app (iOS).

## 🛠 Tech Stack

- **Framework**: [Expo](https://expo.dev/) + [React Native](https://reactnative.dev/)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **State Management**: [React Query](https://tanstack.com/query/latest) (TanStack Query)
- **Icons**: [Lucide React Native](https://lucide.dev/)
- **Storage**: [Async Storage](https://react-native-async-storage.github.io/async-storage/) for local persistence
- **AI**: [Cerebras](https://cloud.cerebras.ai/) inference, called via a [Supabase Edge Function](https://supabase.com/docs/guides/functions)

---

## 🤖 AI Features

Smart Add and the Ritual Guide call Cerebras through a small proxy in
[`supabase/functions/ai-proxy`](supabase/functions/ai-proxy). The app never holds the
API key: `EXPO_PUBLIC_` variables are inlined into the JavaScript bundle at build time
and can be recovered from a shipped APK with nothing more than `strings`. The key lives
as a server-side secret, and the client sends only structured parameters — prompts are
built inside the function, so the endpoint cannot be used as a general-purpose LLM proxy.

### Deploying the proxy

```bash
supabase link --project-ref <your-project-ref>
supabase secrets set CEREBRAS_API_KEY=<your key>
supabase functions deploy ai-proxy --no-verify-jwt
```

Then set the resulting URL in `.env`:

```
EXPO_PUBLIC_AI_PROXY_URL=https://<your-project-ref>.supabase.co/functions/v1/ai-proxy
```

`--no-verify-jwt` is intentional — the app has no accounts, so it calls the function
without a Supabase session. The endpoint is therefore unauthenticated; add rate limiting
before exposing it to public traffic.

For EAS builds, set the URL as a secret rather than committing it to `eas.json`:

```bash
eas secret:create --name EXPO_PUBLIC_AI_PROXY_URL --value <your proxy url>
```

---

## 🗺 Roadmap (Feature Ideas)

Further AI-driven features that could be integrated:

### 1. Physical Invitation Scanner (OCR + Vision)
Users can take a photo of a wedding card, invitation, or a printed patro, and the AI will automatically parse the details and add them to their custom holidays/events.

### 2. AI Saait & Muhurta Advisor
An AI assistant trained on Nepali astrological data that can answer questions like: *"When is the most auspicious day to start a new business in Jestha?"* or *"Is tomorrow a good day for travel?"*

### 3. Automated Festival Recipe Generator
For upcoming festivals (like Dashain or Tihar), the AI can suggest traditional recipes and generate a smart grocery shopping list based on the number of guests.

### 4. Daily "Insights & Wisdom"
Beyond just a horoscope (Rashifal), an AI bot that provides daily motivation and cultural insights based on the user's specific zodiac and the day's planetary positions.

### 5. Voice-Activated Patro
Full voice navigation: *"Hey Patro, when is the next public holiday?"* or *"What is the Tithi for next Tuesday?"*

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
