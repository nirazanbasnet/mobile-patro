import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { useQuery } from '@tanstack/react-query';
import { fetchCalendarData, getHolidaysFromData } from '@/services/mitiApi';
import { NewCalendarData, EventDetail } from '@/types/miti.types';
import { toNepaliDigits } from '@/utils/nepali';
import { Calendar } from 'lucide-react-native';
import { BS_MONTH_NAMES_EN, BS_MONTH_NAMES_NP } from '@/data/bs-data';
import { getTodayBs } from '@/utils/bs-converter';
import { getFestivalsForMonth } from '@/data/festivals';


interface HolidayItem {
    day: number;
    month: number;
    year: number;
    title: string;
    isHoliday: boolean;
}

export default function UpcomingHolidays() {
    const { settings } = useApp();
    const isEn = settings.language === 'en';
    // Always use today's real date — not affected by calendar selection
    const todayBsDate = useMemo(() => getTodayBs(), []);

    // Fetch current month data
    const { data: currentMonthData } = useQuery<NewCalendarData[]>({
        queryKey: ['miti-calendar-upcoming', todayBsDate.year, todayBsDate.month],
        queryFn: () => fetchCalendarData(todayBsDate.year, todayBsDate.month),
        staleTime: 1000 * 60 * 60 * 24,
    });

    // Fetch next month data
    const nextMonth = todayBsDate.month === 12 ? 1 : todayBsDate.month + 1;
    const nextYear = todayBsDate.month === 12 ? todayBsDate.year + 1 : todayBsDate.year;
    const { data: nextMonthData } = useQuery<NewCalendarData[]>({
        queryKey: ['miti-calendar-upcoming-next', nextYear, nextMonth],
        queryFn: () => fetchCalendarData(nextYear, nextMonth),
        staleTime: 1000 * 60 * 60 * 24,
    });

    const upcomingHolidays = useMemo(() => {
        const holidays: HolidayItem[] = [];

        // Process current month data — from today onwards
        if (currentMonthData) {
            for (let i = todayBsDate.day - 1; i < currentMonthData.length; i++) {
                const dayData = currentMonthData[i];
                const dayHolidays = getHolidaysFromData(dayData);
                dayHolidays.forEach((event: EventDetail) => {
                    holidays.push({
                        day: i + 1,
                        month: todayBsDate.month,
                        year: todayBsDate.year,
                        title: isEn ? (event.title.en || event.title.np || '') : (event.title.np || event.title.en || ''),
                        isHoliday: event.isHoliday,
                    });
                });
            }
        }

        // Process next month data
        if (nextMonthData) {
            for (let i = 0; i < nextMonthData.length && holidays.length < 5; i++) {
                const dayData = nextMonthData[i];
                const dayHolidays = getHolidaysFromData(dayData);
                dayHolidays.forEach((event: EventDetail) => {
                    holidays.push({
                        day: i + 1,
                        month: nextMonth,
                        year: nextYear,
                        title: isEn ? (event.title.en || event.title.np || '') : (event.title.np || event.title.en || ''),
                        isHoliday: event.isHoliday,
                    });
                });
            }
        }

        // Fallback: If still empty for current month, use local festivals data
        if (holidays.length === 0) {
            const currentLocal = getFestivalsForMonth(todayBsDate.year, todayBsDate.month);
            currentLocal.forEach(item => {
                if (item.day >= todayBsDate.day && item.festival.isPublicHoliday) {
                    holidays.push({
                        day: item.day,
                        month: todayBsDate.month,
                        year: todayBsDate.year,
                        title: isEn ? item.festival.name : item.festival.nameNp,
                        isHoliday: true,
                    });
                }
            });
            holidays.sort((a, b) => a.day - b.day);
        }

        return holidays.slice(0, 5);
    }, [currentMonthData, nextMonthData, todayBsDate, nextMonth, nextYear, isEn]);


    if (upcomingHolidays.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Calendar size={20} color="#E91E63" />
                <Text style={styles.title}>
                    {isEn ? 'Upcoming Holidays' : 'आगामी चाडपर्व'}
                </Text>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {upcomingHolidays.map((holiday, index) => (
                    <View key={index} style={styles.holidayCard}>
                        <View style={styles.dateBox}>
                            <Text style={styles.dayText}>
                                {isEn ? holiday.day : toNepaliDigits(holiday.day)}
                            </Text>
                            <Text style={styles.monthText}>
                                {isEn
                                    ? BS_MONTH_NAMES_EN[holiday.month - 1].slice(0, 3)
                                    : BS_MONTH_NAMES_NP[holiday.month - 1].slice(0, 3)}
                            </Text>
                        </View>
                        <Text style={styles.holidayTitle} numberOfLines={2}>
                            {holiday.title}
                        </Text>
                        {holiday.isHoliday && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {isEn ? 'Holiday' : 'बिदा'}
                                </Text>
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        marginHorizontal: 16,
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    scrollContent: {
        gap: 12,
        paddingRight: 16,
    },
    holidayCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 12,
        minWidth: 140,
        borderWidth: 1,
        borderColor: '#FFE4EC',
        alignItems: 'center',
    },
    dateBox: {
        backgroundColor: '#FCE4EC',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignItems: 'center',
        marginBottom: 8,
    },
    dayText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#E91E63',
    },
    monthText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#E91E63',
        textTransform: 'uppercase',
    },
    holidayTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1A1A2E',
        textAlign: 'center',
        marginBottom: 6,
        minHeight: 36,
    },
    badge: {
        backgroundColor: '#E91E63',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#FFF',
    },
});
