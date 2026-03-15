import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Sunrise, Sunset, Moon, Sparkles, CalendarCheck } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const MICRO_INFO_INTERVAL = 5000;

interface MicroInfo {
    text: string;
    icon: string;
}

function getMicroInfoCards(dayInfo: ReturnType<typeof useApp>['dayInfo'], isEn: boolean): MicroInfo[] {
    const cards: MicroInfo[] = [];
    
    // Use Miti tithi data if available, otherwise fallback to local
    const tithiName = isEn 
        ? (dayInfo.mitiTithi?.title?.en || dayInfo.tithi.nameEn || dayInfo.tithi.name)
        : (dayInfo.mitiTithi?.title?.np || dayInfo.tithi.name);
    
    cards.push({
        text: isEn
            ? `${dayInfo.tithi.pakshaEn ?? dayInfo.tithi.paksha} Paksha • ${tithiName}`
            : `${dayInfo.tithi.paksha} पक्ष • ${tithiName}`,
        icon: 'moon',
    });
    cards.push({
        text: isEn ? `${dayInfo.lunarEmoji} Lunar Phase` : `${dayInfo.lunarEmoji} चन्द्रमा कला`,
        icon: 'lunar',
    });
    
    // Show Miti events/holidays
    if (dayInfo.mitiHolidays && dayInfo.mitiHolidays.length > 0) {
        dayInfo.mitiHolidays.forEach(holiday => {
            cards.push({
                text: isEn ? (holiday.title?.en || '') : (holiday.title?.np || ''),
                icon: 'festival',
            });
        });
    } else if (dayInfo.festival) {
        cards.push({
            text: isEn ? dayInfo.festival.name : dayInfo.festival.nameNp,
            icon: 'festival',
        });
    }
    
    // Show other events
    if (dayInfo.mitiEvents && dayInfo.mitiEvents.length > 0) {
        dayInfo.mitiEvents.filter(e => !e.isHoliday).slice(0, 2).forEach(event => {
            cards.push({
                text: isEn ? (event.title?.en || '') : (event.title?.np || ''),
                icon: 'calendar',
            });
        });
    }
    
    return cards;
}

export default function DailyInfo() {
    const { dayInfo, settings, strings } = useApp();
    const isEn = settings.language === 'en';
    
    // Light theme colors
    const themeColors = {
        accent: '#E91E63',
        accentSecondary: '#FCE4EC',
        text: '#1A1A2E',
        textSecondary: '#5C5C6F',
        textTertiary: '#9CA3AF',
        surface: '#FFF',
        border: '#FFE4EC',
    };
    const [microIndex, setMicroIndex] = useState(0);
    const microFade = useRef(new Animated.Value(1)).current;
    const microCards = getMicroInfoCards(dayInfo, isEn);

    const animateMicroTransition = useCallback(() => {
        Animated.timing(microFade, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setMicroIndex(prev => (prev + 1) % microCards.length);
            Animated.timing(microFade, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        });
    }, [microCards.length]);

    useEffect(() => {
        if (microCards.length <= 1) return;
        const interval = setInterval(animateMicroTransition, MICRO_INFO_INTERVAL);
        return () => clearInterval(interval);
    }, [microCards.length, animateMicroTransition]);

    useEffect(() => {
        setMicroIndex(0);
        microFade.setValue(1);
    }, [dayInfo.bsDate.day, dayInfo.bsDate.month, dayInfo.bsDate.year]);

    const currentMicro = microCards[microIndex % microCards.length];

    return (
        <View style={styles.container}>
            {/* Miti Holidays */}
            {dayInfo.mitiHolidays && dayInfo.mitiHolidays.length > 0 && (
                <View style={styles.festivalContainer}>
                    {dayInfo.mitiHolidays.map((holiday, index) => (
                        <View key={index} style={[
                            styles.festivalBadge,
                            { backgroundColor: '#E8533F18' },
                        ]}>
                            <Sparkles size={14} color="#E8533F" />
                            <Text style={[styles.festivalText, { color: '#E8533F' }]}>
                                {isEn ? (holiday.title?.en || '') : (holiday.title?.np || '')}
                            </Text>
                        </View>
                    ))}
                    <View style={styles.holidayChip}>
                        <CalendarCheck size={11} color="#E8533F" />
                        <Text style={styles.holidayChipText}>
                            {isEn ? 'Public Holiday' : 'सार्वजनिक बिदा'}
                        </Text>
                    </View>
                </View>
            )}
            
            {/* Fallback to local festival if no Miti holidays */}
            {dayInfo.festival && (!dayInfo.mitiHolidays || dayInfo.mitiHolidays.length === 0) && (
                <View style={styles.festivalContainer}>
                    <View style={[
                        styles.festivalBadge,
                        { backgroundColor: dayInfo.festival.isPublicHoliday ? '#E8533F18' : themeColors.accentSecondary },
                    ]}>
                        <Sparkles size={14} color={dayInfo.festival.isPublicHoliday ? '#E8533F' : themeColors.accent} />
                        <Text style={[
                            styles.festivalText,
                            { color: dayInfo.festival.isPublicHoliday ? '#E8533F' : themeColors.accent },
                        ]}>
                            {isEn ? dayInfo.festival.name : dayInfo.festival.nameNp}
                        </Text>
                    </View>
                    {dayInfo.festival.isPublicHoliday && (
                        <View style={styles.holidayChip}>
                            <CalendarCheck size={11} color="#E8533F" />
                            <Text style={styles.holidayChipText}>
                                {isEn ? 'Public Holiday' : 'सार्वजनिक बिदा'}
                            </Text>
                        </View>
                    )}
                </View>
            )}

            <View style={[styles.infoRow, { borderColor: themeColors.border }]}>
                <View style={styles.infoItem}>
                    <Moon size={16} color={themeColors.textSecondary} />
                    <Text style={[styles.infoLabel, { color: themeColors.textTertiary }]}>{strings.tithi}</Text>
                    <Text style={[styles.infoValue, { color: themeColors.text }]}>
                        {isEn 
                            ? (dayInfo.mitiTithi?.title?.en || dayInfo.tithi.nameEn || dayInfo.tithi.name)
                            : (dayInfo.mitiTithi?.title?.np || dayInfo.tithi.name)
                        }
                    </Text>
                </View>
            </View>

            {settings.showSunTimes && (
                <View style={styles.sunRow}>
                    <View style={[styles.sunCard, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
                        <Sunrise size={18} color="#F59E0B" />
                        <View style={styles.sunTextCol}>
                            <Text style={[styles.sunLabel, { color: themeColors.textTertiary }]}>{strings.sunrise}</Text>
                            <Text style={[styles.sunTime, { color: themeColors.text }]}>{dayInfo.sunTimes.sunrise}</Text>
                        </View>
                    </View>
                    <View style={[styles.sunCard, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
                        <Sunset size={18} color="#EF4444" />
                        <View style={styles.sunTextCol}>
                            <Text style={[styles.sunLabel, { color: themeColors.textTertiary }]}>{strings.sunset}</Text>
                            <Text style={[styles.sunTime, { color: themeColors.text }]}>{dayInfo.sunTimes.sunset}</Text>
                        </View>
                    </View>
                </View>
            )}

            {microCards.length > 1 && (
                <Animated.View style={[styles.microCard, { backgroundColor: themeColors.surface, borderColor: themeColors.border, opacity: microFade }]}>
                    <Text style={[styles.microText, { color: themeColors.textSecondary }]}>
                        {currentMicro?.text}
                    </Text>
                    <View style={styles.microDots}>
                        {microCards.map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.microDot,
                                    {
                                        backgroundColor: i === (microIndex % microCards.length) ? themeColors.accent : themeColors.border,
                                    },
                                ]}
                            />
                        ))}
                    </View>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        gap: 12,
    },
    festivalContainer: {
        alignItems: 'center',
        gap: 6,
    },
    festivalBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    holidayChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    holidayChipText: {
        fontSize: 11,
        fontWeight: '600' as const,
        color: '#E8533F',
    },
    festivalText: {
        fontSize: 14,
        fontWeight: '600' as const,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    infoLabel: {
        fontSize: 13,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '600' as const,
    },
    sunRow: {
        flexDirection: 'row',
        gap: 12,
    },
    sunCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        gap: 10,
    },
    sunTextCol: {
        gap: 2,
    },
    sunLabel: {
        fontSize: 11,
    },
    sunTime: {
        fontSize: 15,
        fontWeight: '600' as const,
    },
    microCard: {
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        alignItems: 'center',
        gap: 8,
    },
    microText: {
        fontSize: 14,
        textAlign: 'center',
    },
    microDots: {
        flexDirection: 'row',
        gap: 4,
    },
    microDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
    },
});