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
	customHolidayEmpty: string;
	viewRitualGuide: string;
	ritualItems: string;
	ritualSteps: string;
	aiDisclaimer: string;
	loadingRitual: string;
	retryRitual: string;
	smartAdd: string;
	intelligentDateParsing: string;
	smartAddInputPlaceholder: string;
	parsedAITitle: string;
	confirmAndAdd: string;
	whatsHappening: string;
	typingVoiceHint: string;
	// Reminders
	reminders: string;
	addReminder: string;
	reminderQuestion: string;
	reminderPlaceholder: string;
	notifyMe: string;
	oneDayBefore: string;
	onTheDay: string;
	reminderTime: string;
	noReminders: string;
	reminderEmpty: string;
	reminderPastTime: string;
	reminderSet: string;
	timeMorning: string;
	timeNoon: string;
	timeEvening: string;
	delete: string;
	// Shared feedback
	error: string;
	success: string;
	// Not found screen
	notFoundTitle: string;
	notFoundBody: string;
	goHome: string;
	// Tab bar / screen headers
	festivals: string;
	dateConverter: string;
	// Date detail sheet
	dateDetails: string;
	events: string;
	holiday: string;
	panchanga: string;
	nakshatra: string;
	yog: string;
	karan: string;
	// Festivals screen
	monthEvents: string;
	upcomingHolidays: string;
	noEventsThisMonth: string;
	publicHoliday: string;
	daysLeft: string;
	// Home
	goToToday: string;
	// Ritual guide
	aiRitualGuide: string;
	ritualGuideFailed: string;
	// Smart add
	voiceAssistant: string;
	voiceAssistantHint: string;
	// Converter picker
	year: string;
	month: string;
	day: string;
	select: string;
	bsAbbr: string;
	adAbbr: string;
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
	customHolidayEmpty: "बिदाको नाम दिनुहोस्",
    viewRitualGuide: "संस्कार विधि हेर्नुहोस्",
    ritualItems: "साँैत-सामान",
    ritualSteps: "विधि र प्रक्रिया",
    aiDisclaimer: "यो जानकारी एआई द्वारा तयार पारिएको हो। कृपया आफ्ना गुरु वा विज्ञसँग सल्लाह लिनुहोस्।",
    loadingRitual: "विधि तयार हुँदैछ...",
    retryRitual: "पुनः प्रयास गर्नुहोस्",
	customHolidayName: "बिदाको नाम",
	customHolidayPlaceholder: "उदाहरण: कम्पनी बन्द",
	smartAdd: "छरितो थप्नुहोस्",
	intelligentDateParsing: "स्वचालित मिति पहिचान",
	smartAddInputPlaceholder: "उदाहरण: १५ वैशाखमा बिहान १० बजे विवाह",
	parsedAITitle: "एआईले बुझेको विवरण",
	confirmAndAdd: "निश्चित गरी थप्नुहोस्",
	whatsHappening: "के हुँदैछ?",
	typingVoiceHint: "टाइप गर्नुहोस् वा आवाज प्रयोग गर्नुहोस्",
	reminders: "रिमाइन्डर",
	addReminder: "रिमाइन्डर थप्नुहोस्",
	reminderQuestion: "केको बारेमा सम्झाउनु पर्ने हो?",
	reminderPlaceholder: "उदाहरण: पूजाको लागि फूल किन्ने",
	notifyMe: "कहिले सम्झाउने?",
	oneDayBefore: "एक दिन अगाडि",
	onTheDay: "सोही दिन",
	reminderTime: "समय",
	noReminders: "यस दिनको लागि कुनै रिमाइन्डर छैन",
	reminderEmpty: "के सम्झाउने हो लेख्नुहोस्",
	reminderPastTime: "त्यो समय गइसक्यो",
	reminderSet: "रिमाइन्डर सेट भयो",
	timeMorning: "बिहान",
	timeNoon: "मध्यान्ह",
	timeEvening: "बेलुका",
	delete: "हटाउनुहोस्",
	error: "त्रुटि",
	success: "सफल",
	notFoundTitle: "पृष्ठ भेटिएन",
	notFoundBody: "यो पृष्ठ अवस्थित छैन।",
	goHome: "गृहपृष्ठमा जानुहोस्",
	festivals: "चाडपर्व",
	dateConverter: "मिति रूपान्तरण",
	dateDetails: "मिति विवरण",
	events: "कार्यक्रमहरू",
	holiday: "बिदा",
	panchanga: "पञ्चाङ्ग",
	nakshatra: "नक्षत्र",
	yog: "योग",
	karan: "करण",
	monthEvents: "मासिक कार्यक्रम",
	upcomingHolidays: "आगामी बिदा",
	noEventsThisMonth: "यस महिनामा कुनै कार्यक्रमहरू छैनन्।",
	publicHoliday: "सार्वजनिक बिदा",
	daysLeft: "दिन बाँकी",
	goToToday: "आजमा जानुहोस्",
	aiRitualGuide: "एआई संस्कार विधि",
	ritualGuideFailed: "विधि तयार गर्न सकिएन",
	voiceAssistant: "आवाज सहायक",
	voiceAssistantHint: "बोल्नको लागि किबोर्डको माइक आइकन थिच्नुहोस्।",
	year: "वर्ष",
	month: "महिना",
	day: "दिन",
	select: "छान्नुहोस्",
	bsAbbr: "वि.सं.",
	adAbbr: "ई.सं.",
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
	customHolidayEmpty: "Enter holiday name",
    viewRitualGuide: "View Ritual Guide",
    ritualItems: "Sait-Saaman (Items)",
    ritualSteps: "Ritual Steps",
    aiDisclaimer: "This information is generated by AI. Please consult with a priest or expert for accuracy.",
    loadingRitual: "Preparing guide...",
    retryRitual: "Retry",
	customHolidayName: "Holiday Name",
	customHolidayPlaceholder: "e.g. Company Holiday",
	smartAdd: "Smart Add",
	intelligentDateParsing: "Intelligent Date Parsing",
	smartAddInputPlaceholder: "e.g., Wedding on 15th Baisakh at 10 AM",
	parsedAITitle: "AI Parsed Results",
	confirmAndAdd: "Confirm & Add",
	whatsHappening: "What's happening?",
	typingVoiceHint: "Try typing or use voice dictation",
	reminders: "Reminders",
	addReminder: "Add reminder",
	reminderQuestion: "What should we remind you about?",
	reminderPlaceholder: "e.g. Buy flowers for the puja",
	notifyMe: "Notify me",
	oneDayBefore: "1 day before",
	onTheDay: "On the day",
	reminderTime: "Time",
	noReminders: "No reminders for this day",
	reminderEmpty: "Enter what to remind you about",
	reminderPastTime: "That time has already passed",
	reminderSet: "Reminder set",
	timeMorning: "Morning",
	timeNoon: "Midday",
	timeEvening: "Evening",
	delete: "Delete",
	error: "Error",
	success: "Success",
	notFoundTitle: "Page not found",
	notFoundBody: "This page doesn't exist.",
	goHome: "Go to home",
	festivals: "Festivals",
	dateConverter: "Date Converter",
	dateDetails: "Date Details",
	events: "Events",
	holiday: "Holiday",
	panchanga: "Panchanga",
	nakshatra: "Nakshatra",
	yog: "Yog",
	karan: "Karan",
	monthEvents: "Month Events",
	upcomingHolidays: "Upcoming Holidays",
	noEventsThisMonth: "No events for this month",
	publicHoliday: "Public Holiday",
	daysLeft: "days left",
	goToToday: "Go to Today",
	aiRitualGuide: "AI Ritual Guide",
	ritualGuideFailed: "Failed to generate guide",
	voiceAssistant: "Voice Assistant",
	voiceAssistantHint: "Tap the mic icon on your keyboard to speak.",
	year: "Year",
	month: "Month",
	day: "Day",
	select: "Select",
	bsAbbr: "BS",
	adAbbr: "AD",
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
