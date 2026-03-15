const NEPALI_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

export function toNepaliDigits(num: number): string {
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

export function formatAdDate(year: number, month: number, day: number): string {
	return `${AD_MONTH_NAMES[month - 1]} ${day}, ${year}`;
}

export function formatAdDateShort(
	year: number,
	month: number,
	day: number,
): string {
	return `${AD_MONTH_NAMES_SHORT[month - 1]} ${day}, ${year}`;
}
