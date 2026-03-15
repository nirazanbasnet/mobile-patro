import { NewCalendarData, EventDetail, TithiDetails, PanchangaDetails } from '@/types/miti.types';

const MITI_API_BASE_URL = 'https://data.miti.bikram.io/data';

export async function fetchCalendarData(year: number, month: number): Promise<NewCalendarData[]> {
    const monthStr = month.toString().padStart(2, '0');
    const res = await fetch(`${MITI_API_BASE_URL}/${year}/${monthStr}.json`);
    if (!res.ok) {
        throw new Error(`Failed to fetch calendar data: ${res.status}`);
    }
    const data = await res.json();
    return data;
}

export async function fetchDayData(year: number, month: number, day: number): Promise<NewCalendarData | null> {
    try {
        const monthData = await fetchCalendarData(year, month);
        return monthData[day - 1] || null;
    } catch (error) {
        console.error('Error fetching day data:', error);
        return null;
    }
}

export function getTithiFromData(data: NewCalendarData | null): TithiDetails | null {
    return data?.tithiDetails || null;
}

export function getPanchangaFromData(data: NewCalendarData | null): PanchangaDetails | null {
    return data?.panchangaDetails || null;
}

export function getSunriseSunset(data: NewCalendarData | null): { sunrise: string | null; sunset: string | null } {
    const times = data?.panchangaDetails?.times;
    return {
        sunrise: times?.sunrise || null,
        sunset: times?.sunset || null,
    };
}

export function getEventsFromData(data: NewCalendarData | null): EventDetail[] {
    return data?.eventDetails || [];
}

export function getHolidaysFromData(data: NewCalendarData | null): EventDetail[] {
    return data?.eventDetails?.filter((event: EventDetail) => event.isHoliday) || [];
}

export function isHoliday(data: NewCalendarData | null): boolean {
    return data?.eventDetails?.some((event: EventDetail) => event.isHoliday) || false;
}
