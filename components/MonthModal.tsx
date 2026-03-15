import React, { useEffect, useRef } from 'react';
import {
    View, Text, Modal, Animated, TouchableOpacity,
    StyleSheet, Dimensions, Pressable, ScrollView,
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { getDaysInBsMonth, BS_DAY_NAMES_SHORT_NP, BS_MONTH_NAMES_NP, BS_MONTH_NAMES_EN } from '@/data/bs-data';
import { toNepaliDigits } from '@/utils/nepali';
import { BS_DAY_NAMES_SHORT_EN } from '@/constants/translations';
import { getDayOfWeek, isValidBsDate, getTodayBs } from '@/utils/bs-converter';
import { getFestival, getFestivalsForMonth } from '@/data/festivals';
import type { Festival } from '@/data/festivals';

interface Props {
    visible: boolean;
    onClose: () => void;
}

export default function MonthModal({ visible, onClose }: Props) {
    const { dayInfo, currentBsDate, goToDate, theme, notes, settings, strings, customHolidays } = useApp();
    const isEn = settings.language === 'en';
    const slideAnim = useRef(new Animated.Value(300)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [viewYear, setViewYear] = React.useState(currentBsDate.year);
    const [viewMonth, setViewMonth] = React.useState(currentBsDate.month);

    // Ref for scroll view to jump to today's event
    const scrollViewRef = useRef<ScrollView>(null);
    const todayRowY = useRef<number>(0);
    const listY = useRef<number>(0);


    const today = getTodayBs();
    const isViewingCurrentMonth = viewYear === today.year && viewMonth === today.month;

    useEffect(() => {
        if (visible) {
            setViewYear(currentBsDate.year);
            setViewMonth(currentBsDate.month);
            Animated.parallel([
                Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
            ]).start(() => {
                // Small delay to ensure all onLayouts have fired and scroll content is ready
                setTimeout(() => {
                    if (todayRowY.current > 0) {
                        const targetY = listY.current + todayRowY.current;
                        scrollViewRef.current?.scrollTo({ y: targetY - 20, animated: true });
                    }
                }, 100);
            });

        } else {
            slideAnim.setValue(300);
            fadeAnim.setValue(0);
            todayRowY.current = 0;
        }
    }, [visible]);

    const handleClose = () => {
        Animated.parallel([
            Animated.timing(slideAnim, { toValue: 300, duration: 200, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start(() => onClose());
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

    const monthFestivals = React.useMemo(() => {
        const map = new Map<number, Festival>();
        const list = getFestivalsForMonth(viewYear, viewMonth);
        for (const item of list) {
            map.set(item.day, item.festival);
        }
        return map;
    }, [viewYear, viewMonth]);

    // Custom holidays for this view month
    const customHolidayDaysMap = React.useMemo(() => {
        const map = new Map<number, string>();
        Object.keys(customHolidays).forEach(k => {
            const [y, m, d] = k.split('-').map(Number);
            if (y === viewYear && m === viewMonth) map.set(d, customHolidays[k]);
        });
        return map;
    }, [customHolidays, viewYear, viewMonth]);

    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const isSelected = (d: number) =>
        viewYear === currentBsDate.year && viewMonth === currentBsDate.month && d === currentBsDate.day;

    const hasNote = (d: number) => {
        const key = `${viewYear}-${viewMonth}-${d}`;
        return !!notes[key];
    };

    // Merged event list: festivals + custom holidays
    const mergedEventList = React.useMemo(() => {
        const list: { day: number; label: string; isHoliday: boolean; isCustom: boolean; festival?: Festival }[] = [];
        // Add festivals
        monthFestivals.forEach((fest, day) => {
            list.push({ day, label: isEn ? fest.name : fest.nameNp, isHoliday: !!fest.isPublicHoliday, isCustom: false, festival: fest });
        });
        // Add custom holidays (avoid duplicating if same day already has a festival)
        customHolidayDaysMap.forEach((name, day) => {
            const existing = list.find(e => e.day === day);
            if (existing) {
                if (!existing.isHoliday) existing.isHoliday = true;
            } else {
                list.push({ day, label: name, isHoliday: true, isCustom: true });
            }
        });

        // Ensure TODAY is in the list if viewing current month, so we have a target to scroll to
        if (isViewingCurrentMonth) {
            const hasToday = list.some(e => e.day === today.day);
            if (!hasToday) {
                list.push({
                    day: today.day,
                    label: isEn ? 'Today' : 'आज',
                    isHoliday: false,
                    isCustom: false
                });
            }
        }

        list.sort((a, b) => a.day - b.day);
        return list;
    }, [monthFestivals, customHolidayDaysMap, isEn, isViewingCurrentMonth, today.day]);


    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
            <Animated.View style={[styles.overlay, { opacity: fadeAnim, backgroundColor: theme.modalOverlay }]}>
                <Pressable style={styles.overlayPress} onPress={handleClose} />
                <Animated.View
                    style={[
                        styles.sheet,
                        {
                            backgroundColor: theme.background,
                            borderTopLeftRadius: 24,
                            borderTopRightRadius: 24,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <View style={styles.handle}>
                        <View style={[styles.handleBar, { backgroundColor: theme.border }]} />
                    </View>

                    <ScrollView
                        ref={scrollViewRef}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                        bounces={false}
                    >
                        <View style={styles.header}>
                            <TouchableOpacity onPress={goPrevMonth} style={styles.navBtn} testID="month-prev">
                                <ChevronLeft size={20} color={theme.text} />
                            </TouchableOpacity>
                            <Text style={[styles.monthTitle, { color: theme.text }]}>
                                {isEn ? BS_MONTH_NAMES_EN[viewMonth - 1] : BS_MONTH_NAMES_NP[viewMonth - 1]} {isEn ? viewYear : toNepaliDigits(viewYear)}
                            </Text>
                            <TouchableOpacity onPress={goNextMonth} style={styles.navBtn} testID="month-next">
                                <ChevronRight size={20} color={theme.text} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.weekRow}>
                            {(isEn ? BS_DAY_NAMES_SHORT_EN : BS_DAY_NAMES_SHORT_NP).map((name, i) => (
                                <Text
                                    key={i}
                                    style={[
                                        styles.weekDay,
                                        { color: i === 6 ? theme.accent : theme.textTertiary },
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
                                        day && isSelected(day) ? { backgroundColor: theme.accent } : null,
                                    ]}
                                    onPress={() => {
                                        if (day && isValidBsDate(viewYear, viewMonth, day)) {
                                            goToDate({ year: viewYear, month: viewMonth, day });
                                            handleClose();
                                        }
                                    }}
                                    disabled={!day}
                                    testID={day ? `day-${day}` : undefined}
                                >
                                    {day && (
                                        <>
                                            <Text
                                                style={[
                                                    styles.cellText,
                                                    {
                                                        color: isSelected(day)
                                                            ? '#FFFFFF'
                                                            : monthFestivals.has(day) && monthFestivals.get(day)?.isPublicHoliday
                                                                ? '#E8533F'
                                                                : customHolidayDaysMap.has(day)
                                                                    ? '#009688'
                                                                    : i % 7 === 6
                                                                        ? theme.accent
                                                                        : theme.text,
                                                    },
                                                ]}
                                            >
                                                {isEn ? day : toNepaliDigits(day)}
                                            </Text>
                                            {monthFestivals.has(day) && (
                                                <View style={[styles.festivalDot, { backgroundColor: monthFestivals.get(day)?.isPublicHoliday ? '#E8533F' : theme.accentSecondary }]} />
                                            )}
                                            {customHolidayDaysMap.has(day) && !monthFestivals.has(day) && (
                                                <View style={[styles.festivalDot, { backgroundColor: '#009688' }]} />
                                            )}
                                            {hasNote(day) && !monthFestivals.has(day) && !customHolidayDaysMap.has(day) && (
                                                <View style={[styles.noteDot, { backgroundColor: theme.accentSecondary }]} />
                                            )}
                                        </>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        {mergedEventList.length > 0 && (
                            <View 
                                style={[styles.festivalList, { borderTopColor: theme.border }]}
                                onLayout={(e) => { listY.current = e.nativeEvent.layout.y; }}
                            >

                                <Text style={[styles.festivalListTitle, { color: theme.textSecondary }]}>
                                    {isEn ? 'Events this month' : 'यस महिनाका कार्यक्रम'}
                                </Text>
                                {mergedEventList.map((entry, idx) => {
                                    const isTodayRow = isViewingCurrentMonth && entry.day === today.day;
                                    return (
                                        <TouchableOpacity
                                            key={`${entry.isCustom ? 'c' : 'f'}-${entry.day}-${idx}`}
                                            style={[
                                                styles.festivalRow,
                                                isTodayRow && styles.todayEventRow,
                                            ]}
                                            onLayout={isTodayRow ? (e) => { todayRowY.current = e.nativeEvent.layout.y; } : undefined}
                                            onPress={() => {
                                                if (isValidBsDate(viewYear, viewMonth, entry.day)) {
                                                    goToDate({ year: viewYear, month: viewMonth, day: entry.day });
                                                    handleClose();
                                                }
                                            }}
                                        >
                                            <View style={[
                                                styles.festivalDayBadge,
                                                {
                                                    backgroundColor: entry.isCustom
                                                        ? '#00968815'
                                                        : entry.isHoliday
                                                            ? '#E8533F18'
                                                            : theme.accent + '15',
                                                },
                                            ]}>
                                                <Text style={[
                                                    styles.festivalDayText,
                                                    {
                                                        color: entry.isCustom
                                                            ? '#009688'
                                                            : entry.isHoliday
                                                                ? '#E8533F'
                                                                : theme.accent,
                                                    },
                                                ]}>
                                                    {isEn ? entry.day : toNepaliDigits(entry.day)}
                                                </Text>
                                            </View>
                                            <View style={styles.festivalInfo}>
                                                <Text style={[styles.festivalName, { color: theme.text }]} numberOfLines={1}>
                                                    {entry.label}
                                                </Text>
                                                {entry.isCustom ? (
                                                    <Text style={[styles.holidayTag, { color: '#009688' }]}>
                                                        {strings.customHoliday}
                                                    </Text>
                                                ) : entry.isHoliday ? (
                                                    <Text style={styles.holidayTag}>
                                                        {isEn ? 'Public Holiday' : 'सार्वजनिक बिदा'}
                                                    </Text>
                                                ) : null}
                                            </View>
                                            {isTodayRow && (
                                                <View style={styles.todayBadge}>
                                                    <Text style={styles.todayBadgeText}>
                                                        {isEn ? 'Today' : 'आज'}
                                                    </Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}

                        <TouchableOpacity style={[styles.todayBtn, { backgroundColor: theme.accent + '15' }]} onPress={handleClose}>
                            <Text style={[styles.todayBtnText, { color: theme.accent }]}>{strings.close}</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

const CELL_SIZE = (Dimensions.get('window').width - 48) / 7;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    overlayPress: {
        flex: 1,
    },
    sheet: {
        maxHeight: '90%',
    },
    scrollContent: {
        paddingBottom: 40,
        paddingHorizontal: 20,
    },
    handle: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    handleBar: {
        width: 40,
        height: 4,
        borderRadius: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
        marginBottom: 16,
    },
    navBtn: {
        padding: 8,
    },
    monthTitle: {
        fontSize: 18,
        fontWeight: '700' as const,
    },
    weekRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    weekDay: {
        width: CELL_SIZE,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '600' as const,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    cell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: CELL_SIZE / 2,
    },
    cellText: {
        fontSize: 15,
        fontWeight: '500' as const,
    },
    noteDot: {
        position: 'absolute',
        bottom: 4,
        width: 4,
        height: 4,
        borderRadius: 2,
    },
    festivalDot: {
        position: 'absolute' as const,
        bottom: 4,
        width: 4,
        height: 4,
        borderRadius: 2,
    },
    todayBtn: {
        alignSelf: 'center',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
        marginTop: 12,
    },
    todayBtnText: {
        fontSize: 14,
        fontWeight: '600' as const,
    },
    festivalList: {
        borderTopWidth: 1,
        marginTop: 8,
        paddingTop: 10,
    },
    festivalListTitle: {
        fontSize: 12,
        fontWeight: '600' as const,
        marginBottom: 8,
        letterSpacing: 0.3,
    },
    festivalRow: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    todayEventRow: {
        backgroundColor: '#C8E6C9',
        borderColor: '#4CAF50',
        borderWidth: 1,
        paddingHorizontal: 8,
        marginHorizontal: -8,
    },

    festivalDayBadge: {
        width: 30,
        height: 30,
        borderRadius: 8,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    },
    festivalDayText: {
        fontSize: 13,
        fontWeight: '700' as const,
    },
    festivalInfo: {
        flex: 1,
        gap: 1,
    },
    festivalName: {
        fontSize: 13,
        fontWeight: '500' as const,
    },
    holidayTag: {
        fontSize: 10,
        fontWeight: '600' as const,
        color: '#E8533F',
    },
    todayBadge: {
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    todayBadgeText: {
        fontSize: 10,
        fontWeight: '700' as const,
        color: '#FFF',
    },
});
