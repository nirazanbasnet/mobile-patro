# Mobile Patro Architecture

## Technology Stack

* **Framework:** React Native + Expo
* **Routing:** Expo Router (`expo-router`) using a file-based routing system.
* **Language:** TypeScript
* **State Management:** Zustand and React Query
* **Package Manager:** Bun
* **Icons:** `lucide-react-native`

## Project Structure

The project follows a standard Expo Router setup with modularized utility and component folders.

```plaintext
mobile-patro/
├── app/                      # Expo Router screens and layouts
│   ├── (tabs)/               # Bottom tab navigation
│   │   ├── (home)/           # Home screen logic (index.tsx & _layout.tsx)
│   │   └── settings/         # Settings screen logic
│   ├── +not-found.tsx        # 404 fallback screen
│   └── _layout.tsx           # Root navigation layout
├── components/               # Reusable UI components
│   ├── AnimatedDate.tsx      # Date component with animations
│   ├── DailyInfo.tsx         # Display for daily information (Tithi, Sunrise, etc.)
│   ├── MonthModal.tsx        # Modal for selecting/viewing a month
│   ├── NoteModal.tsx         # Modal for taking or viewing notes
│   └── ParticleEffect.tsx    # Visual particle effects component
├── constants/                # Global static definitions
│   ├── colors.ts             # Color palette tokens
│   ├── themes.ts             # Theme configurations (Light/Dark mode)
│   └── translations.ts       # i18n/translation strings
├── contexts/                 # React Context providers for global state
├── data/                     # Application data / mock data
├── utils/                    # Core business logic and helper functions
│   ├── bs-converter.ts       # Bikram Sambat (BS) date conversion logic
│   ├── nepali.ts             # Nepali language/date formatting utilities
│   ├── sun-times.ts          # Sunrise/Sunset calculation utilities
│   └── tithi.ts              # Hindu lunar calendar (Tithi) calculations
├── package.json              # App dependencies and scripts
└── bun.lock                  # Bun lockfile for deterministic installs
```

## Key Architectural Patterns

1. **File-Based Routing:** The `app` directory uses Expo Router to automatically generate navigation between screens. The `(tabs)` directory indicates a bottom tab bar navigation containing the "Home" and "Settings" screens.
2. **Domain-Specific Utilities:** The `utils` folder contains pure functions focused on the core domain of a "Patro" (Nepali Calendar), such as converting dates (`bs-converter.ts`), calculating lunar phases (`tithi.ts`), and fetching sun times (`sun-times.ts`).
3. **Component Modularity:** UI is broken down into small, distinct components like `DailyInfo` and `AnimatedDate` ensuring the screens in `app/` remain clean and declarative.
4. **Theming & Localization:** The use of `constants/themes.ts`, `constants/colors.ts`, and `constants/translations.ts` suggests built-in support for Light/Dark mode and bilingual (English/Nepali) settings.
