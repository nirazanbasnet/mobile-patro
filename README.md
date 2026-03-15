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

3. **Start the development server**
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

---

## 🤖 AI-Powered Roadmap (Feature Suggestions)

To make this app stand out and provide maximum utility, here are several AI-driven features that could be integrated:

### 1. Smart Event Extraction (Natural Language)
Allow users to type or speak events like *"Add a sister's wedding on 15th of Baisakh at 4 PM"* and have a local LLM or API extract the date, time, and title automatically.

### 2. Physical Invitation Scanner (OCR + Vision)
Users can take a photo of a wedding card, invitation, or a printed patro, and the AI will automatically parse the details and add them to their custom holidays/events.

### 3. AI Saait & Muhurta Advisor
An AI assistant trained on Nepali astrological data that can answer questions like: *"When is the most auspicious day to start a new business in Jestha?"* or *"Is tomorrow a good day for travel?"*

### 4. Personalized Ritual Guides
Based on the current Tithi (e.g., Ekadashi, Janai Purnima), the AI can provide personalized step-by-step guides on how to perform specific rituals, including a list of required items (Sait-Saaman).

### 5. Automated Festival Recipe Generator
For upcoming festivals (like Dashain or Tihar), the AI can suggest traditional recipes and generate a smart grocery shopping list based on the number of guests.

### 6. Daily "Insights & Wisdom"
Beyond just a horoscope (Rashifal), an AI bot that provides daily motivation and cultural insights based on the user's specific zodiac and the day's planetary positions.

### 7. Voice-Activated Patro
Full voice navigation: *"Hey Patro, when is the next public holiday?"* or *"What is the Tithi for next Tuesday?"*

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
