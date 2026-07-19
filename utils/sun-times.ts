const KTM_LAT = 27.7172;
const KTM_LNG = 85.324;

function dayOfYear(year: number, month: number, day: number): number {
	const date = new Date(year, month - 1, day);
	const start = new Date(year, 0, 1);
	return (
		Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
	);
}

function toRad(deg: number): number {
	return (deg * Math.PI) / 180;
}

function toDeg(rad: number): number {
	return (rad * 180) / Math.PI;
}

export interface SunTimes {
	sunrise: string;
	sunset: string;
	sunriseHour: number;
	sunsetHour: number;
}

export function getSunTimes(
	year: number,
	month: number,
	day: number,
): SunTimes {
	const doy = dayOfYear(year, month, day);

	const declination = -23.45 * Math.cos(toRad((360 / 365) * (doy + 10)));
	const latRad = toRad(KTM_LAT);
	const declRad = toRad(declination);

	const cosHA = -(Math.tan(latRad) * Math.tan(declRad));
	const clampedCosHA = Math.max(-1, Math.min(1, cosHA));
	const haDeg = toDeg(Math.acos(clampedCosHA));

	const solarNoon = 12 - (KTM_LNG - 82.5) / 15 + 0.17;

	const sunriseDecimal = solarNoon - haDeg / 15;
	const sunsetDecimal = solarNoon + haDeg / 15;

	// Emit 24h "HH:MM" and leave localisation to formatClockTime, so this matches
	// the shape the Miti API returns and both sources format identically.
	const formatTime = (decimal: number): string => {
		let hours = Math.floor(decimal);
		let minutes = Math.round((decimal - hours) * 60);
		if (minutes === 60) {
			hours += 1;
			minutes = 0;
		}
		return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
	};

	return {
		sunrise: formatTime(sunriseDecimal),
		sunset: formatTime(sunsetDecimal),
		sunriseHour: sunriseDecimal,
		sunsetHour: sunsetDecimal,
	};
}
