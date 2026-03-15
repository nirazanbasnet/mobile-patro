export type Language = "np" | "en";

interface Translations {
	today: string;
	swipeHint: string;
	tithi: string;
	sunrise: string;
	sunset: string;
	lunarPhase: string;
	paksha: string;
	settings: string;
	theme: string;
	display: string;
	about: string;
	showEnglishDate: string;
	showSunTimes: string;
	festivalAnimation: string;
	language: string;
	nepaliCalendar: string;
	feedback: string;
	beautyOfToday: string;
	close: string;
	cancel: string;
	save: string;
	noteFor: string;
	notePlaceholder: string;
	auto: string;
	light: string;
	dark: string;
	amoled: string;
	english: string;
	nepali: string;
	customHoliday: string;
	addCustomHoliday: string;
	editCustomHoliday: string;
	deleteCustomHoliday: string;
	customHolidayName: string;
	customHolidayPlaceholder: string;
}

const np: Translations = {
	today: "आज",
	swipeHint: "◁ स्वाइप गर्नुहोस् ▷",
	tithi: "तिथि",
	sunrise: "सूर्योदय",
	sunset: "सूर्यास्त",
	lunarPhase: "चन्द्रमा कला",
	paksha: "पक्ष",
	settings: "सेटिङ्",
	theme: "थिम",
	display: "प्रदर्शन",
	about: "बारेमा",
	showEnglishDate: "अंग्रेजी मिति देखाउनुहोस्",
	showSunTimes: "सूर्योदय / सूर्यास्त",
	festivalAnimation: "चाड पर्वको एनिमेसन",
	language: "भाषा",
	nepaliCalendar: "मोबाइल पात्रो",
	feedback: "प्रतिक्रिया",
	beautyOfToday: "आजको सुन्दर दृश्य ✦",
	close: "बन्द गर्नुहोस्",
	cancel: "रद्द",
	save: "सुरक्षित गर्नुहोस्",
	noteFor: "को नोट",
	notePlaceholder: "आफ्नो नोट यहाँ लेख्नुहोस्...",
	auto: "स्वचालित",
	light: "उज्यालो",
	dark: "अँध्यारो",
	amoled: "AMOLED",
	english: "English",
	nepali: "नेपाली",
	customHoliday: "कस्टम बिदा",
	addCustomHoliday: "कस्टम बिदा थप्नुहोस्",
	editCustomHoliday: "कस्टम बिदा सम्पादन",
	deleteCustomHoliday: "हटाउनुहोस्",
	customHolidayName: "बिदाको नाम",
	customHolidayPlaceholder: "उदाहरण: कम्पनी बन्द",
};

const en: Translations = {
	today: "Today",
	swipeHint: "◁ Swipe ▷",
	tithi: "Tithi",
	sunrise: "Sunrise",
	sunset: "Sunset",
	lunarPhase: "Lunar Phase",
	paksha: "Paksha",
	settings: "Settings",
	theme: "Theme",
	display: "Display",
	about: "About",
	showEnglishDate: "Show English Date",
	showSunTimes: "Sunrise / Sunset",
	festivalAnimation: "Festival Animation",
	language: "Language",
	nepaliCalendar: "Mobile Patro",
	feedback: "Feedback",
	beautyOfToday: "A beautiful way to see today ✦",
	close: "Close",
	cancel: "Cancel",
	save: "Save",
	noteFor: "Note for",
	notePlaceholder: "Write your note here...",
	auto: "Auto",
	light: "Light",
	dark: "Dark",
	amoled: "AMOLED",
	english: "English",
	nepali: "नेपाली",
	customHoliday: "Custom Holiday",
	addCustomHoliday: "Add Custom Holiday",
	editCustomHoliday: "Edit Custom Holiday",
	deleteCustomHoliday: "Delete",
	customHolidayName: "Holiday Name",
	customHolidayPlaceholder: "e.g. Company Holiday",
};

const translations: Record<Language, Translations> = { np, en };

export function t(lang: Language): Translations {
	return translations[lang];
}

export const BS_DAY_NAMES_SHORT_EN = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat",
];
