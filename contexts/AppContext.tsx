import { useEffect, useState, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';
import { ThemeMode, ThemeColors, getThemeColors } from '@/constants/themes';
import { Language, t } from '@/constants/translations';
import { getTodayBs, addDaysToBs, BsDate, bsToAd, getDayOfWeek } from '@/utils/bs-converter';
import { getTithi, TithiInfo, getLunarPhaseEmoji } from '@/utils/tithi';
import { getSunTimes, SunTimes } from '@/utils/sun-times';
import { getFestival } from '@/data/festivals';
import { BS_MONTH_NAMES_NP, BS_DAY_NAMES_NP, BS_MONTH_NAMES_EN, BS_DAY_NAMES_EN } from '@/data/bs-data';
import { toNepaliDigits, formatAdDate } from '@/utils/nepali';
import type { Festival } from '@/data/festivals';
import { fetchCalendarData, fetchDayData, getSunriseSunset, getEventsFromData, getHolidaysFromData, isHoliday } from '@/services/mitiApi';
import { NewCalendarData, EventDetail, TithiDetails } from '@/types/miti.types';

const SETTINGS_KEY = '@nepali_cal_settings';
const NOTES_KEY = '@nepali_cal_notes';
const CUSTOM_HOLIDAYS_KEY = '@nepali_cal_custom_holidays';


export interface AppSettings {
    themeMode: ThemeMode;
    showEnglishDate: boolean;
    showSunTimes: boolean;
    showFestivalAnimation: boolean;
    language: Language;
}

const DEFAULT_SETTINGS: AppSettings = {
    themeMode: 'auto',
    showEnglishDate: true,
    showSunTimes: true,
    showFestivalAnimation: true,
    language: 'np',
};

export interface DayInfo {
    bsDate: BsDate;
    adDate: { year: number; month: number; day: number };
    dayOfWeek: number;
    dayNameNp: string;
    monthNameNp: string;
    nepaliDay: string;
    nepaliYear: string;
    englishDateStr: string;
    tithi: TithiInfo;
    lunarEmoji: string;
    sunTimes: SunTimes;
    festival: Festival | null;
    mitiData: NewCalendarData | null;
    mitiTithi: TithiDetails | null;
    mitiEvents: EventDetail[];
    mitiHolidays: EventDetail[];
    isMitiHoliday: boolean;
}

function computeDayInfo(bsDate: BsDate, language: Language, mitiData: NewCalendarData | null = null): DayInfo {
    const ad = bsToAd(bsDate.year, bsDate.month, bsDate.day);
    const dow = getDayOfWeek(bsDate.year, bsDate.month, bsDate.day);
    const tithi = getTithi(ad.year, ad.month, ad.day);
    const sunTimes = getSunTimes(ad.year, ad.month, ad.day);
    const festival = getFestival(bsDate.year, bsDate.month, bsDate.day);
    const isEn = language === 'en';

    // Use Miti API data if available
    const mitiSunTimes = mitiData ? getSunriseSunset(mitiData) : null;
    const finalSunTimes: SunTimes = mitiSunTimes?.sunrise && mitiSunTimes?.sunset ? {
        sunrise: mitiSunTimes.sunrise,
        sunset: mitiSunTimes.sunset,
        sunriseHour: 0,
        sunsetHour: 0,
    } : sunTimes;

    return {
        bsDate,
        adDate: ad,
        dayOfWeek: dow,
        dayNameNp: isEn ? BS_DAY_NAMES_EN[dow] : BS_DAY_NAMES_NP[dow],
        monthNameNp: isEn ? BS_MONTH_NAMES_EN[bsDate.month - 1] : BS_MONTH_NAMES_NP[bsDate.month - 1],
        nepaliDay: isEn ? String(bsDate.day) : toNepaliDigits(bsDate.day),
        nepaliYear: isEn ? String(bsDate.year) : toNepaliDigits(bsDate.year),
        englishDateStr: formatAdDate(ad.year, ad.month, ad.day),
        tithi,
        lunarEmoji: getLunarPhaseEmoji(tithi.index),
        sunTimes: finalSunTimes,
        festival,
        mitiData,
        mitiTithi: mitiData?.tithiDetails || null,
        mitiEvents: mitiData ? getEventsFromData(mitiData) : [],
        mitiHolidays: mitiData ? getHolidaysFromData(mitiData) : [],
        isMitiHoliday: mitiData ? isHoliday(mitiData) : false,
    };
}

export const [AppProvider, useApp] = createContextHook(() => {
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
    const [notes, setNotes] = useState<Record<string, string>>({});
    const [customHolidays, setCustomHolidays] = useState<Record<string, string>>({});
    const [currentBsDate, setCurrentBsDate] = useState<BsDate>(getTodayBs);

    const [dayInfo, setDayInfo] = useState<DayInfo>(() => computeDayInfo(getTodayBs(), 'np'));
    const midnightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const queryClient = useQueryClient();

    // Force light theme always
    const theme: ThemeColors = getThemeColors('light', false);

    // Fetch Miti calendar data for current month
    const mitiCalendarQuery = useQuery<NewCalendarData[]>({
        queryKey: ['miti-calendar', currentBsDate.year, currentBsDate.month],
        queryFn: () => fetchCalendarData(currentBsDate.year, currentBsDate.month),
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
        networkMode: 'offlineFirst',
    });

    // Get current day data from Miti
    const currentMitiData = mitiCalendarQuery.data?.[currentBsDate.day - 1] || null;

    const settingsQuery = useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            const stored = await AsyncStorage.getItem(SETTINGS_KEY);
            return stored ? (JSON.parse(stored) as AppSettings) : DEFAULT_SETTINGS;
        },
    });

    const notesQuery = useQuery({
        queryKey: ['notes'],
        queryFn: async () => {
            const stored = await AsyncStorage.getItem(NOTES_KEY);
            return stored ? (JSON.parse(stored) as Record<string, string>) : {};
        },
    });

    const customHolidaysQuery = useQuery({
        queryKey: ['customHolidays'],
        queryFn: async () => {
            const stored = await AsyncStorage.getItem(CUSTOM_HOLIDAYS_KEY);
            return stored ? (JSON.parse(stored) as Record<string, string>) : {};
        },
    });


    const saveSettingsMutation = useMutation({
        mutationFn: async (newSettings: AppSettings) => {
            await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
            return newSettings;
        },
    });

    const saveNotesMutation = useMutation({
        mutationFn: async (newNotes: Record<string, string>) => {
            await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(newNotes));
            return newNotes;
        },
    });

    const saveCustomHolidaysMutation = useMutation({
        mutationFn: async (newHolidays: Record<string, string>) => {
            await AsyncStorage.setItem(CUSTOM_HOLIDAYS_KEY, JSON.stringify(newHolidays));
            return newHolidays;
        },
    });


    useEffect(() => {
        if (settingsQuery.data) {
            setSettings(settingsQuery.data);
        }
    }, [settingsQuery.data]);

    useEffect(() => {
        if (notesQuery.data) {
            setNotes(notesQuery.data);
        }
    }, [notesQuery.data]);

    useEffect(() => {
        if (customHolidaysQuery.data) {
            setCustomHolidays(customHolidaysQuery.data);
        }
    }, [customHolidaysQuery.data]);

    useEffect(() => {
        setDayInfo(computeDayInfo(currentBsDate, settings.language, currentMitiData));
    }, [currentBsDate, settings.language, currentMitiData]);

    // Prefetch next and previous months
    useEffect(() => {
        if (currentBsDate.month === 12) {
            queryClient.prefetchQuery({
                queryKey: ['miti-calendar', currentBsDate.year + 1, 1],
                queryFn: () => fetchCalendarData(currentBsDate.year + 1, 1),
            });
        } else {
            queryClient.prefetchQuery({
                queryKey: ['miti-calendar', currentBsDate.year, currentBsDate.month + 1],
                queryFn: () => fetchCalendarData(currentBsDate.year, currentBsDate.month + 1),
            });
        }
        
        if (currentBsDate.month === 1) {
            queryClient.prefetchQuery({
                queryKey: ['miti-calendar', currentBsDate.year - 1, 12],
                queryFn: () => fetchCalendarData(currentBsDate.year - 1, 12),
            });
        } else {
            queryClient.prefetchQuery({
                queryKey: ['miti-calendar', currentBsDate.year, currentBsDate.month - 1],
                queryFn: () => fetchCalendarData(currentBsDate.year, currentBsDate.month - 1),
            });
        }
    }, [currentBsDate.year, currentBsDate.month, queryClient]);

    useEffect(() => {
        const scheduleMidnightUpdate = () => {
            const now = new Date();
            const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
            const msUntilMidnight = tomorrow.getTime() - now.getTime();
            midnightTimer.current = setTimeout(() => {
                setCurrentBsDate(getTodayBs());
                scheduleMidnightUpdate();
            }, msUntilMidnight);
        };
        scheduleMidnightUpdate();
        return () => {
            if (midnightTimer.current) clearTimeout(midnightTimer.current);
        };
    }, []);

    const updateSettings = useCallback((partial: Partial<AppSettings>) => {
        setSettings(prev => {
            const updated = { ...prev, ...partial };
            saveSettingsMutation.mutate(updated);
            return updated;
        });
    }, []);

    const goToNextDay = useCallback(() => {
        setCurrentBsDate(prev => addDaysToBs(prev, 1));
    }, []);

    const goToPrevDay = useCallback(() => {
        setCurrentBsDate(prev => addDaysToBs(prev, -1));
    }, []);

    const goToToday = useCallback(() => {
        setCurrentBsDate(getTodayBs());
    }, []);

    const goToDate = useCallback((bs: BsDate) => {
        setCurrentBsDate(bs);
    }, []);

    const noteKey = `${currentBsDate.year}-${currentBsDate.month}-${currentBsDate.day}`;
    const currentNote = notes[noteKey] ?? '';

    const saveNote = useCallback((text: string) => {
        setNotes(prev => {
            const key = `${currentBsDate.year}-${currentBsDate.month}-${currentBsDate.day}`;
            const updated = { ...prev };
            if (text.trim()) {
                updated[key] = text;
            } else {
                delete updated[key];
            }
            saveNotesMutation.mutate(updated);
            return updated;
        });
    }, [currentBsDate]);

    const saveCustomHoliday = useCallback((bsDate: BsDate, name: string) => {
        setCustomHolidays(prev => {
            const key = `${bsDate.year}-${bsDate.month}-${bsDate.day}`;
            const updated = { ...prev, [key]: name };
            saveCustomHolidaysMutation.mutate(updated);
            return updated;
        });
    }, []);

    const deleteCustomHoliday = useCallback((bsDate: BsDate) => {
        setCustomHolidays(prev => {
            const key = `${bsDate.year}-${bsDate.month}-${bsDate.day}`;
            const updated = { ...prev };
            delete updated[key];
            saveCustomHolidaysMutation.mutate(updated);
            return updated;
        });
    }, []);

    const isToday = (() => {
        const today = getTodayBs();
        return currentBsDate.year === today.year &&
            currentBsDate.month === today.month &&
            currentBsDate.day === today.day;
    })();

    const strings = t(settings.language);

    return {
        theme,
        settings,
        updateSettings,
        dayInfo,
        currentBsDate,
        goToNextDay,
        goToPrevDay,
        goToToday,
        goToDate,
        isToday,
        currentNote,
        saveNote,
        notes,
        customHolidays,
        saveCustomHoliday,
        deleteCustomHoliday,
        strings,
        isLoading: settingsQuery.isLoading || mitiCalendarQuery.isLoading,
        mitiCalendarData: mitiCalendarQuery.data,
        mitiCalendarError: mitiCalendarQuery.error,
    };

});
