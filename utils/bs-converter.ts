import {
	BS_CALENDAR_DATA,
	BS_REFERENCE,
	getDaysInBsMonth,
	MIN_BS_YEAR,
	MAX_BS_YEAR,
} from "@/data/bs-data";

export interface BsDate {
	year: number;
	month: number;
	day: number;
}

export interface AdDate {
	year: number;
	month: number;
	day: number;
}

function isLeapYear(year: number): boolean {
	return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function daysInAdMonth(year: number, month: number): number {
	const days = [
		31, // January
		isLeapYear(year) ? 29 : 28, // February
		31, // March
		30, // April
		31, // May
		30, // June
		31, // July
		31, // August
		30, // September
		31, // October
		30, // November
		31, // December
	];
	return days[month - 1];
}

function countAdDaysFromReference(ad: AdDate): number {
	const ref = BS_REFERENCE;
	let totalDays = 0;

	if (
		ad.year > ref.adYear ||
		(ad.year === ref.adYear && ad.month > ref.adMonth) ||
		(ad.year === ref.adYear && ad.month === ref.adMonth && ad.day >= ref.adDay)
	) {
		let y = ref.adYear;
		let m = ref.adMonth;
		let d = ref.adDay;

		while (y < ad.year || m < ad.month || d < ad.day) {
			const dim = daysInAdMonth(y, m);
			const daysLeftInMonth = dim - d;

			if (y === ad.year && m === ad.month) {
				totalDays += ad.day - d;
				break;
			}

			totalDays += daysLeftInMonth + 1;
			d = 1;
			m++;
			if (m > 12) {
				m = 1;
				y++;
			}
		}
	} else {
		let y = ad.year;
		let m = ad.month;
		let d = ad.day;

		while (y < ref.adYear || m < ref.adMonth || d < ref.adDay) {
			const dim = daysInAdMonth(y, m);
			const daysLeftInMonth = dim - d;

			if (y === ref.adYear && m === ref.adMonth) {
				totalDays += ref.adDay - d;
				break;
			}

			totalDays += daysLeftInMonth + 1;
			d = 1;
			m++;
			if (m > 12) {
				m = 1;
				y++;
			}
		}
		totalDays = -totalDays;
	}

	return totalDays;
}

export function adToBs(adYear: number, adMonth: number, adDay: number): BsDate {
	const totalDays = countAdDaysFromReference({
		year: adYear,
		month: adMonth,
		day: adDay,
	});

	let bsYear = BS_REFERENCE.bsYear;
	let bsMonth = BS_REFERENCE.bsMonth;
	let bsDay = BS_REFERENCE.bsDay;
	let remaining = totalDays;

	if (remaining >= 0) {
		while (remaining > 0) {
			const daysInMonth = getDaysInBsMonth(bsYear, bsMonth);
			const daysLeftInMonth = daysInMonth - bsDay;

			if (remaining <= daysLeftInMonth) {
				bsDay += remaining;
				remaining = 0;
			} else {
				remaining -= daysLeftInMonth + 1;
				bsDay = 1;
				bsMonth++;
				if (bsMonth > 12) {
					bsMonth = 1;
					bsYear++;
				}
			}
		}
	} else {
		remaining = Math.abs(remaining);
		while (remaining > 0) {
			if (remaining < bsDay) {
				bsDay -= remaining;
				remaining = 0;
			} else {
				remaining -= bsDay;
				bsMonth--;
				if (bsMonth < 1) {
					bsMonth = 12;
					bsYear--;
				}
				bsDay = getDaysInBsMonth(bsYear, bsMonth);
			}
		}
	}

	return { year: bsYear, month: bsMonth, day: bsDay };
}

export function bsToAd(bsYear: number, bsMonth: number, bsDay: number): AdDate {
	let totalDays = 0;

	let y = BS_REFERENCE.bsYear;
	let m = BS_REFERENCE.bsMonth;
	let d = BS_REFERENCE.bsDay;

	const forward =
		bsYear > y ||
		(bsYear === y && bsMonth > m) ||
		(bsYear === y && bsMonth === m && bsDay >= d);

	if (forward) {
		while (y < bsYear || m < bsMonth || d < bsDay) {
			const dim = getDaysInBsMonth(y, m);
			const left = dim - d;

			if (y === bsYear && m === bsMonth) {
				totalDays += bsDay - d;
				break;
			}

			totalDays += left + 1;
			d = 1;
			m++;
			if (m > 12) {
				m = 1;
				y++;
			}
		}
	} else {
		while (y > bsYear || m > bsMonth || d > bsDay) {
			if (y === bsYear && m === bsMonth) {
				totalDays -= d - bsDay;
				break;
			}
			totalDays -= d;
			m--;
			if (m < 1) {
				m = 12;
				y--;
			}
			d = getDaysInBsMonth(y, m);
		}
	}

	let adYear = BS_REFERENCE.adYear;
	let adMonth = BS_REFERENCE.adMonth;
	let adDay = BS_REFERENCE.adDay;

	if (totalDays >= 0) {
		adDay += totalDays;
		while (adDay > daysInAdMonth(adYear, adMonth)) {
			adDay -= daysInAdMonth(adYear, adMonth);
			adMonth++;
			if (adMonth > 12) {
				adMonth = 1;
				adYear++;
			}
		}
	} else {
		let rem = Math.abs(totalDays);
		while (rem > 0) {
			if (rem < adDay) {
				adDay -= rem;
				rem = 0;
			} else {
				rem -= adDay;
				adMonth--;
				if (adMonth < 1) {
					adMonth = 12;
					adYear--;
				}
				adDay = daysInAdMonth(adYear, adMonth);
			}
		}
	}

	return { year: adYear, month: adMonth, day: adDay };
}

export function isValidBsDate(
	year: number,
	month: number,
	day: number,
): boolean {
	if (year < MIN_BS_YEAR || year > MAX_BS_YEAR) return false;
	if (month < 1 || month > 12) return false;
	if (day < 1 || day > getDaysInBsMonth(year, month)) return false;
	return true;
}

export function getTodayBs(): BsDate {
	const now = new Date();
	return adToBs(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function getDayOfWeek(
	bsYear: number,
	bsMonth: number,
	bsDay: number,
): number {
	const ad = bsToAd(bsYear, bsMonth, bsDay);
	const date = new Date(ad.year, ad.month - 1, ad.day);
	return date.getDay();
}

export function addDaysToBs(bs: BsDate, days: number): BsDate {
	const ad = bsToAd(bs.year, bs.month, bs.day);
	const date = new Date(ad.year, ad.month - 1, ad.day);
	date.setDate(date.getDate() + days);
	return adToBs(date.getFullYear(), date.getMonth() + 1, date.getDate());
}
