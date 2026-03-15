const SYNODIC_MONTH = 29.53059;
const KNOWN_NEW_MOON_JD = 2460705.5;
const KNOWN_NEW_MOON_DATE = new Date(2025, 0, 29);

const TITHI_NAMES_NP = [
	"प्रतिपदा",
	"द्वितीया",
	"तृतीया",
	"चतुर्थी",
	"पञ्चमी",
	"षष्ठी",
	"सप्तमी",
	"अष्टमी",
	"नवमी",
	"दशमी",
	"एकादशी",
	"द्वादशी",
	"त्रयोदशी",
	"चतुर्दशी",
	"पूर्णिमा",
	"प्रतिपदा",
	"द्वितीया",
	"तृतीया",
	"चतुर्थी",
	"पञ्चमी",
	"षष्ठी",
	"सप्तमी",
	"अष्टमी",
	"नवमी",
	"दशमी",
	"एकादशी",
	"द्वादशी",
	"त्रयोदशी",
	"चतुर्दशी",
	"औंसी",
];

const PAKSHA_NP = ["शुक्ल", "कृष्ण"];

const TITHI_NAMES_EN = [
	"Pratipada",
	"Dwitiya",
	"Tritiya",
	"Chaturthi",
	"Panchami",
	"Shashthi",
	"Saptami",
	"Ashtami",
	"Navami",
	"Dashami",
	"Ekadashi",
	"Dwadashi",
	"Trayodashi",
	"Chaturdashi",
	"Purnima",
	"Pratipada",
	"Dwitiya",
	"Tritiya",
	"Chaturthi",
	"Panchami",
	"Shashthi",
	"Saptami",
	"Ashtami",
	"Navami",
	"Dashami",
	"Ekadashi",
	"Dwadashi",
	"Trayodashi",
	"Chaturdashi",
	"Amavasya",
];

const PAKSHA_EN = ["Shukla", "Krishna"];

export interface TithiInfo {
	name: string;
	nameEn: string;
	paksha: string;
	pakshaEn: string;
	index: number;
}

export function getTithi(year: number, month: number, day: number): TithiInfo {
	const targetDate = new Date(year, month - 1, day);
	const diffMs = targetDate.getTime() - KNOWN_NEW_MOON_DATE.getTime();
	const diffDays = diffMs / (1000 * 60 * 60 * 24);

	let lunarAge = diffDays % SYNODIC_MONTH;
	if (lunarAge < 0) lunarAge += SYNODIC_MONTH;

	const tithiDuration = SYNODIC_MONTH / 30;
	const tithiIndex = Math.floor(lunarAge / tithiDuration);
	const clampedIndex = Math.max(0, Math.min(29, tithiIndex));

	const pakshaIdx = clampedIndex < 15 ? 0 : 1;

	return {
		name: TITHI_NAMES_NP[clampedIndex],
		nameEn: TITHI_NAMES_EN[clampedIndex],
		paksha: PAKSHA_NP[pakshaIdx],
		pakshaEn: PAKSHA_EN[pakshaIdx],
		index: clampedIndex,
	};
}

export function getLunarPhaseEmoji(tithiIndex: number): string {
	if (tithiIndex <= 1) return "🌑";
	if (tithiIndex <= 4) return "🌒";
	if (tithiIndex <= 7) return "🌓";
	if (tithiIndex <= 10) return "🌔";
	if (tithiIndex <= 14) return "🌕";
	if (tithiIndex <= 18) return "🌖";
	if (tithiIndex <= 22) return "🌗";
	if (tithiIndex <= 26) return "🌘";
	return "🌑";
}
