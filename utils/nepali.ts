const NEPALI_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

// Accepts a string so pre-formatted values (e.g. zero-padded "05") keep their
// padding; the body already handles non-numeric characters by passing them through.
export function toNepaliDigits(num: number | string): string {
	return String(num)
		.split("")
		.map((d) => {
			const n = parseInt(d, 10);
			return isNaN(n) ? d : NEPALI_DIGITS[n];
		})
		.join("");
}

export function toEnglishDigits(nepaliStr: string): string {
	return nepaliStr
		.split("")
		.map((ch) => {
			const idx = NEPALI_DIGITS.indexOf(ch);
			return idx >= 0 ? String(idx) : ch;
		})
		.join("");
}

const AD_MONTH_NAMES = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const AD_MONTH_NAMES_SHORT = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

const AD_MONTH_NAMES_NP = [
	"जनवरी",
	"फेब्रुअरी",
	"मार्च",
	"अप्रिल",
	"मे",
	"जुन",
	"जुलाई",
	"अगस्ट",
	"सेप्टेम्बर",
	"अक्टोबर",
	"नोभेम्बर",
	"डिसेम्बर",
];

/** Gregorian month name in the display language. `month` is 1-indexed. */
export function getAdMonthName(month: number, lang: "en" | "np"): string {
	const names = lang === "np" ? AD_MONTH_NAMES_NP : AD_MONTH_NAMES;
	return names[month - 1] ?? "";
}

export function formatAdDate(
	year: number,
	month: number,
	day: number,
	lang: "en" | "np" = "en",
): string {
	if (lang === "np") {
		return `${AD_MONTH_NAMES_NP[month - 1]} ${toNepaliDigits(day)}, ${toNepaliDigits(year)}`;
	}
	return `${AD_MONTH_NAMES[month - 1]} ${day}, ${year}`;
}

export function formatAdDateShort(
	year: number,
	month: number,
	day: number,
	lang: "en" | "np" = "en",
): string {
	if (lang === "np") {
		return `${AD_MONTH_NAMES_NP[month - 1]} ${toNepaliDigits(day)}, ${toNepaliDigits(year)}`;
	}
	return `${AD_MONTH_NAMES_SHORT[month - 1]} ${day}, ${year}`;
}

/**
 * Normalises a clock time from either source into the display language.
 *
 * Sun times arrive in two different shapes: the Miti API returns 24h in Nepali
 * numerals with a Devanagari separator ("०५ः२०"), while the offline fallback in
 * sun-times.ts returns 24h in Latin digits ("05:20"). Both are normalised here,
 * so English users stop seeing Nepali numerals and vice versa.
 *
 * Returns the input unchanged if it cannot be parsed, so an unexpected upstream
 * format degrades to "shows something" rather than "shows nothing".
 */
export function formatClockTime(raw: string | null | undefined, lang: "en" | "np"): string {
	if (!raw) return "--:--";

	// U+0903 (ः) is the separator the Miti API uses; also accept ASCII ':'.
	const normalised = toEnglishDigits(raw).replace(/ः/g, ":").trim();
	const match = normalised.match(/^(\d{1,2}):(\d{2})/);
	if (!match) return raw;

	const hours = Number(match[1]);
	const minutes = match[2];
	if (!Number.isFinite(hours) || hours > 23) return raw;

	const displayHour = hours % 12 === 0 ? 12 : hours % 12;

	if (lang === "en") {
		return `${displayHour}:${minutes} ${hours >= 12 ? "PM" : "AM"}`;
	}
	const period = hours < 12 ? "बिहान" : hours < 17 ? "दिउँसो" : "बेलुका";
	return `${toNepaliDigits(displayHour)}:${toNepaliDigits(minutes)} ${period}`;
}
