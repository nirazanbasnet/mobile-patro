import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Settings, ArrowLeftRight, ChevronDown, X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { bsToAd, adToBs } from '@/utils/bs-converter';
import { BS_MONTH_NAMES_EN, BS_MONTH_NAMES_NP, getDaysInBsMonth, MIN_BS_YEAR, MAX_BS_YEAR } from '@/data/bs-data';
import { toNepaliDigits, formatAdDate } from '@/utils/nepali';
import { router } from 'expo-router';

const MIN_AD_YEAR = 1913;
const MAX_AD_YEAR = 2034;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ConverterScreen() {
    const { settings, currentBsDate } = useApp();
    const insets = useSafeAreaInsets();
    const isEn = settings.language === 'en';

    const [isBsToAd, setIsBsToAd] = useState(true);

    // BS State
    const [bsYear, setBsYear] = useState(currentBsDate.year);
    const [bsMonth, setBsMonth] = useState(currentBsDate.month);
    const [bsDay, setBsDay] = useState(currentBsDate.day);

    // Wait until mounting to compute AD corresponding to today
    const currentAd = useMemo(() => bsToAd(currentBsDate.year, currentBsDate.month, currentBsDate.day), [currentBsDate]);

    // AD State
    const [adYear, setAdYear] = useState(currentAd.year);
    const [adMonth, setAdMonth] = useState(currentAd.month);
    const [adDay, setAdDay] = useState(currentAd.day);

    // Modal state
    const [pickerVisible, setPickerVisible] = useState(false);
    const [pickerMode, setPickerMode] = useState<'year' | 'month' | 'day'>('year');
    const [pickerTarget, setPickerTarget] = useState<'bs' | 'ad'>('bs');

    const goToSettings = () => {
        router.push('/settings');
    };

    const openPicker = (mode: 'year' | 'month' | 'day', target: 'bs' | 'ad') => {
        setPickerMode(mode);
        setPickerTarget(target);
        setPickerVisible(true);
    };

    const handleSelect = (value: number) => {
        if (pickerTarget === 'bs') {
            if (pickerMode === 'year') setBsYear(value);
            else if (pickerMode === 'month') setBsMonth(value);
            else if (pickerMode === 'day') setBsDay(value);
        } else {
            if (pickerMode === 'year') setAdYear(value);
            else if (pickerMode === 'month') setAdMonth(value);
            else if (pickerMode === 'day') setAdDay(value);
        }
        setPickerVisible(false);
    };

    const getPickerOptions = () => {
        if (pickerTarget === 'bs') {
            if (pickerMode === 'year') return bsYearOptions;
            if (pickerMode === 'month') return bsMonthOptions;
            return bsDayOptions;
        } else {
            if (pickerMode === 'year') return adYearOptions;
            if (pickerMode === 'month') return adMonthOptions;
            return adDayOptions;
        }
    };

    const getCurrentValue = () => {
        if (pickerTarget === 'bs') {
            if (pickerMode === 'year') return bsYear;
            if (pickerMode === 'month') return bsMonth;
            return bsDay;
        } else {
            if (pickerMode === 'year') return adYear;
            if (pickerMode === 'month') return adMonth;
            return adDay;
        }
    };

    const getPickerTitle = () => {
        const target = pickerTarget === 'bs' ? (isEn ? 'BS' : 'वि.सं.') : (isEn ? 'AD' : 'ई.सं.');
        const mode = pickerMode === 'year' ? (isEn ? 'Year' : 'वर्ष') :
            pickerMode === 'month' ? (isEn ? 'Month' : 'महिना') : (isEn ? 'Day' : 'दिन');
        return `${target} ${mode} ${isEn ? 'Select' : 'छान्नुहोस्'}`;
    };

    // Computations
    const convertedDate = useMemo(() => {
        if (isBsToAd) {
            const ad = bsToAd(bsYear, bsMonth, bsDay);
            const dateStr = formatAdDate(ad.year, ad.month, ad.day);
            const adDateObj = new Date(ad.year, ad.month - 1, ad.day);
            const dayName = adDateObj.toLocaleDateString('en-US', { weekday: 'long' });
            return {
                mainLine: dateStr,
                subLine: `${isEn ? bsYear : toNepaliDigits(bsYear)} ${isEn ? BS_MONTH_NAMES_EN[bsMonth - 1] : BS_MONTH_NAMES_NP[bsMonth - 1]} ${isEn ? bsDay : toNepaliDigits(bsDay)}, ${dayName}`
            };
        } else {
            const bs = adToBs(adYear, adMonth, adDay);
            const adDateObj = new Date(adYear, adMonth - 1, adDay);
            const dayName = adDateObj.toLocaleDateString('en-US', { weekday: 'long' });
            return {
                mainLine: `${isEn ? bs.year : toNepaliDigits(bs.year)} ${isEn ? BS_MONTH_NAMES_EN[bs.month - 1] : BS_MONTH_NAMES_NP[bs.month - 1]} ${isEn ? bs.day : toNepaliDigits(bs.day)}`,
                subLine: `${formatAdDate(adYear, adMonth, adDay)}, ${dayName}`
            };
        }
    }, [isBsToAd, bsYear, bsMonth, bsDay, adYear, adMonth, adDay, isEn]);


    // Options generation
    const bsYearOptions = Array.from({ length: MAX_BS_YEAR - MIN_BS_YEAR + 1 }, (_, i) => MIN_BS_YEAR + i);
    const bsMonthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
    const bsDayOptions = Array.from({ length: getDaysInBsMonth(bsYear, bsMonth) }, (_, i) => i + 1);

    const adYearOptions = Array.from({ length: MAX_AD_YEAR - MIN_AD_YEAR + 1 }, (_, i) => MIN_AD_YEAR + i);
    const adMonthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
    const daysInAdMonth = new Date(adYear, adMonth, 0).getDate();
    const adDayOptions = Array.from({ length: daysInAdMonth }, (_, i) => i + 1);

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <Text style={styles.headerTitle}>Date converter</Text>
                <TouchableOpacity onPress={goToSettings} style={styles.themeToggle}>
                    <Settings size={20} color="#E91E63" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Conversion Direction Toggle */}
                <View style={styles.directionToggleRow}>
                    <TouchableOpacity
                        style={[styles.directionBtn, isBsToAd ? styles.directionBtnActive : styles.directionBtnInactive]}
                        onPress={() => setIsBsToAd(true)}
                    >
                        <Text style={[styles.directionText, isBsToAd ? styles.directionTextActive : styles.directionTextInactive]}>
                            BS → AD
                        </Text>
                    </TouchableOpacity>

                    <ArrowLeftRight size={20} color="#9CA3AF" />

                    <TouchableOpacity
                        style={[styles.directionBtn, !isBsToAd ? styles.directionBtnActive : styles.directionBtnInactive]}
                        onPress={() => setIsBsToAd(false)}
                    >
                        <Text style={[styles.directionText, !isBsToAd ? styles.directionTextActive : styles.directionTextInactive]}>
                            AD → BS
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Pickers Card */}
                <View style={styles.pickersCard}>

                    <View style={styles.pickerHeadersRow}>
                        <Text style={styles.pickerHeaderLabel}>{isEn ? 'Year' : 'वर्ष'}</Text>
                        <Text style={styles.pickerHeaderLabel}>{isEn ? 'Month' : 'महिना'}</Text>
                        <Text style={styles.pickerHeaderLabel}>{isEn ? 'Day' : 'दिन'}</Text>
                    </View>

                    <View style={styles.pickersRow}>
                        <TouchableOpacity
                            style={styles.pickerButton}
                            onPress={() => openPicker('year', isBsToAd ? 'bs' : 'ad')}
                        >
                            <Text style={styles.pickerButtonText}>
                                {isBsToAd
                                    ? (isEn ? String(bsYear) : toNepaliDigits(bsYear))
                                    : (isEn ? String(adYear) : toNepaliDigits(adYear))
                                }
                            </Text>
                            <ChevronDown size={16} color="#9CA3AF" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.pickerButton, { flex: 1.2 }]}
                            onPress={() => openPicker('month', isBsToAd ? 'bs' : 'ad')}
                        >
                            <Text style={styles.pickerButtonText}>
                                {isBsToAd
                                    ? (isEn ? BS_MONTH_NAMES_EN[bsMonth - 1] : BS_MONTH_NAMES_NP[bsMonth - 1])
                                    : new Date(2000, adMonth - 1, 1).toLocaleString('en-US', { month: 'long' })
                                }
                            </Text>
                            <ChevronDown size={16} color="#9CA3AF" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.pickerButton}
                            onPress={() => openPicker('day', isBsToAd ? 'bs' : 'ad')}
                        >
                            <Text style={styles.pickerButtonText}>
                                {isBsToAd
                                    ? (isEn ? String(bsDay) : toNepaliDigits(bsDay))
                                    : (isEn ? String(adDay) : toNepaliDigits(adDay))
                                }
                            </Text>
                            <ChevronDown size={16} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Date Picker Modal */}
                <Modal
                    visible={pickerVisible}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setPickerVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{getPickerTitle()}</Text>
                                <TouchableOpacity onPress={() => setPickerVisible(false)} style={styles.closeButton}>
                                    <X size={24} color="#1A1A2E" />
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={getPickerOptions()}
                                keyExtractor={(item) => String(item)}
                                renderItem={({ item }) => {
                                    const isSelected = item === getCurrentValue();
                                    let label = String(item);
                                    if (pickerMode === 'month') {
                                        if (pickerTarget === 'bs') {
                                            label = isEn ? BS_MONTH_NAMES_EN[item - 1] : BS_MONTH_NAMES_NP[item - 1];
                                        } else {
                                            label = new Date(2000, item - 1, 1).toLocaleString('en-US', { month: 'long' });
                                        }
                                    } else if (pickerMode !== 'year' && !isEn) {
                                        label = toNepaliDigits(item);
                                    }
                                    return (
                                        <TouchableOpacity
                                            style={[styles.optionItem, isSelected && styles.optionItemSelected]}
                                            onPress={() => handleSelect(item)}
                                        >
                                            <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                                                {label}
                                            </Text>
                                            {isSelected && (
                                                <View style={styles.checkmark}>
                                                    <Text style={styles.checkmarkText}>✓</Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    );
                                }}
                                contentContainerStyle={styles.optionsList}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    </View>
                </Modal>

                {/* Triangle Pointer indicating result */}
                <View style={styles.pointerContainer}>
                    <ChevronDown size={24} color="#1A1A2E" />
                </View>

                {/* Result Card */}
                <View style={styles.resultCard}>
                    <Text style={styles.resultMain}>
                        {convertedDate.mainLine}
                    </Text>
                    <Text style={styles.resultSub}>
                        {convertedDate.subLine}
                    </Text>
                </View>

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
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
        alignItems: 'center',
    },
    directionToggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        width: '100%',
        marginBottom: 24,
        marginTop: 8,
    },
    directionBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    directionBtnActive: {
        backgroundColor: '#E91E63',
    },
    directionBtnInactive: {
        backgroundColor: '#F0F0F0',
    },
    directionText: {
        fontSize: 16,
        fontWeight: '600' as const,
    },
    directionTextActive: {
        color: '#FFF',
    },
    directionTextInactive: {
        color: '#9CA3AF',
    },
    pickersCard: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#FFE4EC',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        backgroundColor: '#FFF',
    },
    pickerHeadersRow: {
        flexDirection: 'row',
        marginBottom: 8,
        paddingHorizontal: 8,
    },
    pickerHeaderLabel: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500' as const,
        color: '#9CA3AF',
    },
    pickersRow: {
        flexDirection: 'row',
        gap: 8,
    },
    pickerButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E8E5DE',
        borderRadius: 8,
        height: 50,
        paddingHorizontal: 12,
        backgroundColor: '#FAFAF7',
    },
    pickerButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A2E',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '70%',
        paddingBottom: 32,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    closeButton: {
        padding: 4,
    },
    optionsList: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 4,
    },
    optionItemSelected: {
        backgroundColor: '#FCE4EC',
    },
    optionText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1A1A2E',
    },
    optionTextSelected: {
        color: '#E91E63',
        fontWeight: '700',
    },
    checkmark: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E91E63',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkmarkText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
    pointerContainer: {
        marginBottom: 16,
    },
    resultCard: {
        width: '100%',
        borderWidth: 1.5,
        borderColor: '#FCE4EC',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#FFF',
        shadowColor: "#E91E63",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    resultMain: {
        fontSize: 26,
        fontWeight: '700' as const,
        textAlign: 'center',
        color: '#E91E63',
    },
    resultSub: {
        fontSize: 14,
        fontWeight: '500' as const,
        textAlign: 'center',
        color: '#5C5C6F',
    },
});
