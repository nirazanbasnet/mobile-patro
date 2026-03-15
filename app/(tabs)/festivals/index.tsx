import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Settings, Calendar, PartyPopper } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { useQuery } from '@tanstack/react-query';
import { fetchCalendarData, getHolidaysFromData } from '@/services/mitiApi';
import { toNepaliDigits } from '@/utils/nepali';
import { BS_MONTH_NAMES_NP, BS_MONTH_NAMES_EN } from '@/data/bs-data';
import { router } from 'expo-router';
import { NewCalendarData, EventDetail } from '@/types/miti.types';
import { getTodayBs } from '@/utils/bs-converter';
import { getFestivalsForMonth } from '@/data/festivals';



interface FestivalDisplay {
    month: number;
    day: number;
    title: string;
    titleEn: string;
    isHoliday: boolean;
    monthName: string;
    daysRemaining: number;
    fullDate: string;
    isToday?: boolean;
}


export default function FestivalsScreen() {
    const { settings, currentBsDate } = useApp();
    const insets = useSafeAreaInsets();
    const isEn = settings.language === 'en';

    // Tab State: 0 for Month Events, 1 for Upcoming Holidays
    const [activeTab, setActiveTab] = useState(0);
    const [viewYear, setViewYear] = useState(currentBsDate.year);
    const [viewMonth, setViewMonth] = useState(currentBsDate.month);

    // Always use today's real date for "Upcoming" and highlighting
    const today = useMemo(() => getTodayBs(), []);


    // Calculate next month for fetching
    const nextMonth = currentBsDate.month === 12 ? 1 : currentBsDate.month + 1;
    const nextYear = currentBsDate.month === 12 ? currentBsDate.year + 1 : currentBsDate.year;

    const goToSettings = () => {
        router.push('/settings');
    };

    // Fetch Miti calendar data for the viewed month
    const { data: calendarData } = useQuery<NewCalendarData[]>({
        queryKey: ['miti-calendar-festivals', viewYear, viewMonth],
        queryFn: () => fetchCalendarData(viewYear, viewMonth),
        staleTime: 1000 * 60 * 60 * 24,
    });

    // Fetch current month for upcoming holidays
    const { data: currentMonthData } = useQuery<NewCalendarData[]>({
        queryKey: ['miti-calendar-current', currentBsDate.year, currentBsDate.month],
        queryFn: () => fetchCalendarData(currentBsDate.year, currentBsDate.month),
        staleTime: 1000 * 60 * 60 * 24,
    });

    // Fetch next month for upcoming holidays
    const { data: nextMonthData } = useQuery<NewCalendarData[]>({
        queryKey: ['miti-calendar-next', nextYear, nextMonth],
        queryFn: () => fetchCalendarData(nextYear, nextMonth),
        staleTime: 1000 * 60 * 60 * 24,
    });

    const allFestivals = useMemo((): FestivalDisplay[] => {
        if (!calendarData) return [];
        
        const festivals: FestivalDisplay[] = [];
        
        calendarData.forEach((dayData, index) => {
            const day = index + 1;
            const events = dayData.eventDetails || [];
            
            events.forEach((event: EventDetail) => {
                const monthName = isEn 
                    ? BS_MONTH_NAMES_EN[viewMonth - 1] 
                    : BS_MONTH_NAMES_NP[viewMonth - 1];
                
                // Calculate days remaining
                const daysRemaining = (viewMonth - currentBsDate.month) * 30 + (day - currentBsDate.day);
                
                festivals.push({
                    month: viewMonth,
                    day,
                    title: event.title?.np || '',
                    titleEn: event.title?.en || '',
                    isHoliday: event.isHoliday,
                    monthName,
                    daysRemaining,
                    fullDate: dayData.calendarInfo?.dates?.bs?.full?.np || `${viewYear}-${viewMonth}-${day}`,
                });
            });
        });

        // Ensure TODAY is shown in Month Events list
        if (viewYear === today.year && viewMonth === today.month) {
            const hasToday = festivals.some(f => f.day === today.day);
            if (!hasToday) {
                festivals.push({
                    month: viewMonth,
                    day: today.day,
                    title: 'आजको दिन',
                    titleEn: 'Today',
                    isHoliday: false,
                    monthName: isEn ? BS_MONTH_NAMES_EN[viewMonth - 1] : BS_MONTH_NAMES_NP[viewMonth - 1],
                    daysRemaining: 0,
                    fullDate: `${viewYear}-${viewMonth}-${today.day}`,
                    isToday: true,
                });
            }
        }

        festivals.sort((a, b) => a.day - b.day);
        
        // Mark items as isToday
        return festivals.map(f => ({
            ...f,
            isToday: viewYear === today.year && viewMonth === today.month && f.day === today.day
        }));
    }, [calendarData, viewMonth, viewYear, currentBsDate.month, currentBsDate.day, isEn, today]);


    // Upcoming holidays from current and next month
    const upcomingHolidays = useMemo((): FestivalDisplay[] => {
        const holidays: FestivalDisplay[] = [];

        // Process current month data
        if (currentMonthData) {
            currentMonthData.forEach((dayData, index) => {
                const day = index + 1;
                if (day >= today.day) {
                    const dayHolidays = getHolidaysFromData(dayData);
                    dayHolidays.forEach((event: EventDetail) => {
                        holidays.push({
                            month: today.month,
                            day,
                            title: event.title?.np || '',
                            titleEn: event.title?.en || '',
                            isHoliday: event.isHoliday,
                            monthName: isEn ? BS_MONTH_NAMES_EN[today.month - 1] : BS_MONTH_NAMES_NP[today.month - 1],
                            daysRemaining: day - today.day,
                            fullDate: dayData.calendarInfo?.dates?.bs?.full?.np || `${today.year}-${today.month}-${day}`,
                            isToday: day === today.day,
                        });
                    });
                }
            });
        }


        // Process next month data
        if (nextMonthData) {
            nextMonthData.forEach((dayData, index) => {
                const day = index + 1;
                const dayHolidays = getHolidaysFromData(dayData);
                dayHolidays.forEach((event: EventDetail) => {
                    holidays.push({
                        month: nextMonth,
                        day,
                        title: event.title?.np || '',
                        titleEn: event.title?.en || '',
                        isHoliday: event.isHoliday,
                        monthName: isEn ? BS_MONTH_NAMES_EN[nextMonth - 1] : BS_MONTH_NAMES_NP[nextMonth - 1],
                        daysRemaining: (30 - currentBsDate.day) + day,
                        fullDate: dayData.calendarInfo?.dates?.bs?.full?.np || `${nextYear}-${nextMonth}-${day}`,
                    });
                });
            });
        }

        // Fallback for current month if empty
        if (holidays.length === 0 && currentBsDate.year === today.year) {
            const currentLocal = getFestivalsForMonth(today.year, today.month);
            currentLocal.forEach(item => {
                if (item.day >= today.day && item.festival.isPublicHoliday) {
                    holidays.push({
                        month: today.month,
                        day: item.day,
                        title: item.festival.nameNp,
                        titleEn: item.festival.name,
                        isHoliday: true,
                        monthName: isEn ? BS_MONTH_NAMES_EN[today.month - 1] : BS_MONTH_NAMES_NP[today.month - 1],
                        daysRemaining: item.day - today.day,
                        fullDate: `${today.year}-${today.month}-${item.day}`,
                    });
                }
            });
            holidays.sort((a, b) => a.day - b.day);
        }

        return holidays.slice(0, 10);
    }, [currentMonthData, nextMonthData, today, nextMonth, nextYear, isEn, currentBsDate.year]);



    const displayFestivals = activeTab === 0 ? allFestivals : upcomingHolidays;

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <Text style={styles.headerTitle}>Festivals</Text>
                <TouchableOpacity onPress={goToSettings} style={styles.themeToggle}>
                    <Settings size={20} color="#E91E63" />
                </TouchableOpacity>
            </View>

            {/* Segmented Control */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 0 && styles.activeTabButton]}
                    onPress={() => setActiveTab(0)}
                >
                    <Calendar size={16} color={activeTab === 0 ? '#E91E63' : '#9CA3AF'} />
                    <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>
                        {isEn ? 'Month Events' : 'मासिक कार्यक्रम'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 1 && styles.activeTabButton]}
                    onPress={() => setActiveTab(1)}
                >
                    <PartyPopper size={16} color={activeTab === 1 ? '#E91E63' : '#9CA3AF'} />
                    <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>
                        {isEn ? 'Upcoming Holidays' : 'आगामी बिदा'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Month Navigation - only show for Month Events tab */}
            {activeTab === 0 && (
                <View style={styles.monthNavRow}>
                    <TouchableOpacity 
                        onPress={() => {
                            if (viewMonth === 1) {
                                setViewMonth(12);
                                setViewYear(y => y - 1);
                            } else {
                                setViewMonth(m => m - 1);
                            }
                        }}
                        style={styles.monthNavBtn}
                    >
                        <Text style={styles.monthNavText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.monthNavTitle}>
                        {isEn ? BS_MONTH_NAMES_EN[viewMonth - 1] : BS_MONTH_NAMES_NP[viewMonth - 1]} {isEn ? viewYear : toNepaliDigits(viewYear)}
                    </Text>
                    <TouchableOpacity 
                        onPress={() => {
                            if (viewMonth === 12) {
                                setViewMonth(1);
                                setViewYear(y => y + 1);
                            } else {
                                setViewMonth(m => m + 1);
                            }
                        }}
                        style={styles.monthNavBtn}
                    >
                        <Text style={styles.monthNavText}>→</Text>
                    </TouchableOpacity>
                </View>
            )}

            <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
                {displayFestivals.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>
                            {isEn ? 'No events for this month' : 'यस महिनामा कुनै कार्यक्रमहरू छैनन्।'}
                        </Text>
                    </View>
                ) : (
                    displayFestivals.map((f: FestivalDisplay, i: number) => (
                        <View key={i} style={[styles.card, f.isToday && styles.todayCard]}>


                            <View style={[styles.dateBadge, f.isHoliday && styles.holidayBadge]}>
                                <Text style={[styles.badgeDay, f.isHoliday && styles.holidayBadgeText]}>
                                    {isEn ? f.day : toNepaliDigits(f.day)}
                                </Text>
                                <Text style={[styles.badgeMonth, f.isHoliday && styles.holidayBadgeText]}>
                                    {f.monthName}
                                </Text>
                            </View>

                            <View style={styles.infoCol}>
                                <View style={styles.topInfoRow}>
                                    <Text style={[styles.festNameNp, f.isHoliday && styles.holidayText]} numberOfLines={1}>
                                        {isEn ? f.titleEn : f.title}
                                    </Text>
                                    {f.daysRemaining >= 0 && viewMonth === currentBsDate.month && (
                                        <Text style={styles.daysLeft}>
                                            {isEn ? `${f.daysRemaining} days left` : `${toNepaliDigits(f.daysRemaining)} दिन बाँकी`}
                                        </Text>
                                    )}
                                </View>

                                <Text style={styles.festNameEn}>
                                    {isEn ? f.title : f.titleEn}
                                </Text>

                                <View style={styles.bottomInfoRow}>
                                    <Text style={styles.fullDateStr}>
                                        {f.fullDate}
                                    </Text>
                                    {f.isHoliday && (
                                        <View style={styles.holidayTagBox}>
                                            <Text style={styles.holidayTag}>
                                                {isEn ? 'Public Holiday' : 'सार्वजनिक बिदा'}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF5F7',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800' as const,
        letterSpacing: -0.5,
        color: '#1A1A2E',
    },
    themeToggle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FFE4EC',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
    },
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        borderRadius: 12,
        padding: 4,
        marginBottom: 16,
        backgroundColor: '#F0F0F0',
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        gap: 6,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    activeTabButton: {
        backgroundColor: '#FFF',
        borderColor: '#E8E5DE',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    tabText: {
        fontSize: 15,
        fontWeight: '600' as const,
        color: '#9CA3AF',
    },
    activeTabText: {
        color: '#1A1A2E',
    },
    monthNavRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    monthNavBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#FFE4EC',
    },
    monthNavText: {
        fontSize: 18,
        color: '#E91E63',
        fontWeight: '600' as const,
    },
    monthNavTitle: {
        fontSize: 18,
        fontWeight: '700' as const,
        color: '#1A1A2E',
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#9CA3AF',
        textAlign: 'center',
    },
    card: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FFE4EC',
        marginBottom: 12,
        gap: 16,
        backgroundColor: '#FFF',
    },
    todayCard: {
        backgroundColor: '#E8F5E9',
        borderColor: '#81C784',
        borderWidth: 2,
    },

    dateBadge: {
        width: 60,
        height: 70,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e5e5e5',
    },
    holidayBadge: {
        backgroundColor: '#E8533F18',
    },
    badgeDay: {
        fontSize: 24,
        fontWeight: '700' as const,
        color: '#404040',
    },
    holidayBadgeText: {
        color: '#E8533F',
    },
    badgeMonth: {
        fontSize: 12,
        fontWeight: '500' as const,
        marginTop: -2,
        color: '#404040',
    },
    infoCol: {
        flex: 1,
        justifyContent: 'center',
        gap: 4,
    },
    topInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    festNameNp: {
        fontSize: 18,
        fontWeight: '700' as const,
        flex: 1,
        color: '#1A1A2E',
    },
    holidayText: {
        color: '#E8533F',
    },
    daysLeft: {
        fontSize: 13,
        fontWeight: '600' as const,
        color: '#1A1A2E',
    },
    festNameEn: {
        fontSize: 14,
        fontWeight: '500' as const,
        color: '#5C5C6F',
    },
    bottomInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    fullDateStr: {
        fontSize: 12,
        flex: 1,
        color: '#9CA3AF',
    },
    holidayTagBox: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: '#FFF0F3',
    },
    holidayTag: {
        fontSize: 10,
        fontWeight: '700' as const,
        color: '#E91E63',
    },
});
