import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
    View, Text, StyleSheet, PanResponder, Animated as RNAnimated,
    TouchableOpacity, ScrollView, Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ChevronLeft, ChevronRight, Settings, RotateCcw, Sparkles } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import AnimatedDate from '@/components/AnimatedDate';
import DailyInfo from '@/components/DailyInfo';
import MonthModal from '@/components/MonthModal';
import NoteModal from '@/components/NoteModal';
import ParticleEffect from '@/components/ParticleEffect';
import DateDetailModal from '@/components/DateDetailModal';
import CustomHolidayModal from '@/components/CustomHolidayModal';
import SmartAddModal from '@/components/SmartAddModal';
import { isMajorFestival } from '@/data/festivals';
import { StatusBar } from 'expo-status-bar';
import { getDaysInBsMonth, BS_DAY_NAMES_SHORT_NP, BS_MONTH_NAMES_NP, BS_MONTH_NAMES_EN } from '@/data/bs-data';
import { toNepaliDigits } from '@/utils/nepali';
import { BS_DAY_NAMES_SHORT_EN } from '@/constants/translations';
import { getDayOfWeek, isValidBsDate } from '@/utils/bs-converter';
import { useQuery } from '@tanstack/react-query';
import { fetchCalendarData } from '@/services/mitiApi';
import type { NewCalendarData } from '@/types/miti.types';
import { router } from 'expo-router';


const SWIPE_THRESHOLD = 50;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CELL_SIZE = Math.floor((SCREEN_WIDTH - 64) / 7);

export default function HomeScreen() {
    const {
        theme, dayInfo, settings, currentBsDate,
        goToNextDay, goToPrevDay, goToToday, goToDate, isToday, strings, updateSettings,
        customHolidays,
    } = useApp();
    const insets = useSafeAreaInsets();
    const [monthModalVisible, setMonthModalVisible] = useState(false);
    const [noteModalVisible, setNoteModalVisible] = useState(false);
    const [dateDetailVisible, setDateDetailVisible] = useState(false);
    const [customHolidayModalVisible, setCustomHolidayModalVisible] = useState(false);
    const [smartAddVisible, setSmartAddVisible] = useState(false);
    const [customHolidayTarget, setCustomHolidayTarget] = useState<{ year: number; month: number; day: number }>(currentBsDate);


    // Monthly view state
    const [viewYear, setViewYear] = useState(currentBsDate.year);
    const [viewMonth, setViewMonth] = useState(currentBsDate.month);

    // Keep view synced with selected date roughly
    React.useEffect(() => {
        setViewYear(currentBsDate.year);
        setViewMonth(currentBsDate.month);
    }, [currentBsDate.year, currentBsDate.month]);

    const isEn = settings.language === 'en';
    const panX = useRef(new RNAnimated.Value(0)).current;
    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Use refs to avoid stale closures inside PanResponder
    const dateDetailRef = useRef(setDateDetailVisible);
    const noteModalRef = useRef(setNoteModalVisible);
    const goToNextDayRef = useRef(goToNextDay);
    const goToPrevDayRef = useRef(goToPrevDay);
    useEffect(() => { dateDetailRef.current = setDateDetailVisible; });
    useEffect(() => { noteModalRef.current = setNoteModalVisible; });
    useEffect(() => { goToNextDayRef.current = goToNextDay; });
    useEffect(() => { goToPrevDayRef.current = goToPrevDay; });

    const triggerHaptic = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, []);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) > 10,
            onPanResponderGrant: () => {
                longPressTimer.current = setTimeout(() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    noteModalRef.current(true);
                }, 600);
            },
            onPanResponderMove: (_, gs) => {
                if (Math.abs(gs.dx) > 10 && longPressTimer.current) {
                    clearTimeout(longPressTimer.current);
                    longPressTimer.current = null;
                }
                panX.setValue(gs.dx * 0.3);
            },
            onPanResponderRelease: (_, gs) => {
                if (longPressTimer.current) {
                    clearTimeout(longPressTimer.current);
                    longPressTimer.current = null;
                }

                if (gs.dx < -SWIPE_THRESHOLD) {
                    triggerHaptic();
                    goToNextDayRef.current();
                } else if (gs.dx > SWIPE_THRESHOLD) {
                    triggerHaptic();
                    goToPrevDayRef.current();
                } else if (Math.abs(gs.dx) < 5 && Math.abs(gs.dy) < 5) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    dateDetailRef.current(true);
                }

                RNAnimated.spring(panX, {
                    toValue: 0,
                    tension: 120,
                    friction: 14,
                    useNativeDriver: true,
                }).start();
            },
            onPanResponderTerminate: () => {
                if (longPressTimer.current) {
                    clearTimeout(longPressTimer.current);
                    longPressTimer.current = null;
                }
                RNAnimated.spring(panX, {
                    toValue: 0,
                    tension: 120,
                    friction: 14,
                    useNativeDriver: true,
                }).start();
            },
        })
    ).current;

    const goToSettings = () => {
        router.push('/settings');
    };

    const goNextMonth = () => {
        if (viewMonth === 12) {
            setViewMonth(1);
            setViewYear(y => y + 1);
        } else {
            setViewMonth(m => m + 1);
        }
    };

    const goPrevMonth = () => {
        if (viewMonth === 1) {
            setViewMonth(12);
            setViewYear(y => y - 1);
        } else {
            setViewMonth(m => m - 1);
        }
    };

    const daysInMonth = getDaysInBsMonth(viewYear, viewMonth);
    const firstDayOfWeek = getDayOfWeek(viewYear, viewMonth, 1);

    // Fetch Miti month data for holiday highlighting
    const { data: mitiMonthData } = useQuery<NewCalendarData[]>({
        queryKey: ['calendar', viewYear, viewMonth],
        queryFn: () => fetchCalendarData(viewYear, viewMonth),
        staleTime: 1000 * 60 * 60,
    });

    // Build holiday set from Miti API
    const mitiHolidayDays = useMemo(() => {
        const set = new Set<number>();
        if (mitiMonthData) {
            mitiMonthData.forEach((d, idx) => {
                if (d.eventDetails?.some((e) => e.isHoliday)) {
                    set.add(idx + 1);
                }
            });
        }
        return set;
    }, [mitiMonthData]);

    // Build custom holiday set for current view month
    const customHolidayDays = useMemo(() => {
        const set = new Set<number>();
        Object.keys(customHolidays).forEach(k => {
            const [y, m, d] = k.split('-').map(Number);
            if (y === viewYear && m === viewMonth) set.add(d);
        });
        return set;
    }, [customHolidays, viewYear, viewMonth]);

    const cells: (number | null)[] = [];

    for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const isSelected = (d: number) =>
        viewYear === currentBsDate.year && viewMonth === currentBsDate.month && d === currentBsDate.day;

    const showParticles = settings.showFestivalAnimation &&
        isMajorFestival(currentBsDate.year, currentBsDate.month, currentBsDate.day);

    const particleColor = dayInfo.festival?.particleColor ?? '#F5C542';

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]} testID="home-screen">
            <StatusBar style={theme.statusBarStyle} />

            {showParticles && <ParticleEffect active color={particleColor} />}

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <Text style={[styles.headerTitle, { color: '#E91E63' }]}>MobilePatro</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={() => setSmartAddVisible(true)} style={[styles.themeToggle, { borderColor: '#FFE4EC', marginRight: 12 }]}>
                        <Sparkles size={20} color="#FF9800" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={goToSettings} style={[styles.themeToggle, { borderColor: '#FFE4EC' }]}>
                        <Settings size={20} color="#E91E63" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                {/* Inline Calendar Map */}
                <View style={styles.calendarCard}>
                    <View style={styles.calendarHeader}>
                        <TouchableOpacity onPress={goPrevMonth} style={styles.navBtn}>
                            <ChevronLeft size={24} color="#2196F3" />
                        </TouchableOpacity>
                        <Text style={[styles.monthTitle, { color: '#1A1A2E' }]}>
                            {isEn ? BS_MONTH_NAMES_EN[viewMonth - 1] : BS_MONTH_NAMES_NP[viewMonth - 1]} {isEn ? viewYear : toNepaliDigits(viewYear)}
                        </Text>
                        <TouchableOpacity onPress={goNextMonth} style={styles.navBtn}>
                            <ChevronRight size={24} color="#2196F3" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.weekRow}>
                        {(isEn ? BS_DAY_NAMES_SHORT_EN : BS_DAY_NAMES_SHORT_NP).map((name, i) => (
                            <Text
                                key={i}
                                style={[
                                    styles.weekDay,
                                    { color: '#9CA3AF' },
                                ]}
                            >
                                {name}
                            </Text>
                        ))}
                    </View>

                    <View style={styles.grid}>
                        {cells.map((day, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[
                                    styles.cell,
                                    day && isSelected(day) ? styles.selectedCell : null,
                                ]}
                                onPress={() => {
                                    if (day && isValidBsDate(viewYear, viewMonth, day)) {
                                        triggerHaptic();
                                        goToDate({ year: viewYear, month: viewMonth, day });
                                        setDateDetailVisible(true);
                                    }
                                }}
                                onLongPress={() => {
                                    if (day && isValidBsDate(viewYear, viewMonth, day)) {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                        setCustomHolidayTarget({ year: viewYear, month: viewMonth, day });
                                        setCustomHolidayModalVisible(true);
                                    }
                                }}
                                delayLongPress={400}
                                disabled={!day}
                            >
                                {day ? (
                                    <>
                                        <Text
                                            style={[
                                                styles.cellText,
                                                isSelected(day) ? styles.selectedCellText : null,
                                                !isSelected(day) && mitiHolidayDays.has(day) ? { color: '#E91E63' } : null,
                                                !isSelected(day) && !mitiHolidayDays.has(day) && customHolidayDays.has(day) ? { color: '#009688' } : null,
                                            ]}
                                        >
                                            {isEn ? day : toNepaliDigits(day)}
                                        </Text>
                                        {customHolidayDays.has(day) && (
                                            <View style={styles.customHolidayDot} />
                                        )}
                                    </>
                                ) : null}
                            </TouchableOpacity>
                        ))}
                    </View>

                </View>

                {/* Date Highlight Area */}
                <View style={styles.dateInfoBox}>
                    {/* Today label OR Go-to-Today button */}
                    {isToday ? (
                        <Text style={styles.todayLabel}>
                            {isEn ? 'Today' : 'आज'}
                        </Text>
                    ) : (
                        <TouchableOpacity onPress={goToToday} style={styles.goTodayBtn} activeOpacity={0.75}>
                            <RotateCcw size={14} color="#E91E63" />
                            <Text style={styles.goTodayText}>
                                {isEn ? 'Go to Today' : 'आजमा जानुहोस्'}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {/* English Date */}
                    <Text style={styles.englishDate}>
                        {dayInfo.englishDateStr}, {dayInfo.dayNameNp}
                    </Text>

                    <RNAnimated.View
                        style={[styles.dateArea, { transform: [{ translateX: panX }] }]}
                        {...panResponder.panHandlers}
                    >
                        <AnimatedDate />
                    </RNAnimated.View>
                </View>
            </ScrollView>

            <MonthModal visible={monthModalVisible} onClose={() => setMonthModalVisible(false)} />
            <NoteModal visible={noteModalVisible} onClose={() => setNoteModalVisible(false)} />
            <DateDetailModal visible={dateDetailVisible} onClose={() => setDateDetailVisible(false)} />
            <CustomHolidayModal
                visible={customHolidayModalVisible}
                onClose={() => setCustomHolidayModalVisible(false)}
                bsDate={customHolidayTarget}
            />
            <SmartAddModal
                visible={smartAddVisible}
                onClose={() => setSmartAddVisible(false)}
            />
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
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    themeToggle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    calendarCard: {
        marginHorizontal: 16,
        padding: 8,
        backgroundColor: '#FFF',
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    calendarHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    navBtn: {
        padding: 4,
    },
    monthTitle: {
        fontSize: 14,
        fontWeight: '700' as const,
    },
    weekRow: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    weekDay: {
        width: CELL_SIZE,
        textAlign: 'center',
        fontSize: 11,
        fontWeight: '600' as const,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    cell: {
        width: CELL_SIZE,
        height: CELL_SIZE - 4,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: (CELL_SIZE - 4) / 2,
    },
    selectedCell: {
        backgroundColor: '#FCE4EC',
    },
    cellText: {
        fontSize: 13,
        color: '#1A1A2E',
        fontWeight: '400' as const,
    },
    selectedCellText: {
        color: '#E91E63',
        fontWeight: '700' as const,
    },
    dateInfoBox: {
        alignItems: 'center',
        marginTop: 14,
        paddingHorizontal: 16,
    },
    todayLabel: {
        fontSize: 20,
        fontWeight: '700' as const,
        color: '#1A1A2E',
        marginBottom: 8,
    },
    englishDate: {
        fontSize: 15,
        fontWeight: '500' as const,
        color: '#E91E63',
        marginBottom: 8,
    },
    dateArea: {
        alignItems: 'center',
    },
    nepaliDateFull: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: '#1A1A2E',
        marginTop: 4,
        letterSpacing: 0.5,
    },
    goTodayBtn: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 6,
        backgroundColor: '#FCE4EC',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 4,
    },
    goTodayText: {
        fontSize: 13,
        fontWeight: '600' as const,
        color: '#E91E63',
    },
    customHolidayDot: {
        position: 'absolute' as const,
        bottom: 3,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#009688',
    },
});
