import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X, Sun, Moon, Calendar, Star, Flag, Trash2, Sparkles } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { toNepaliDigits } from '@/utils/nepali';
import { BS_MONTH_NAMES_EN, BS_MONTH_NAMES_NP } from '@/data/bs-data';
import RitualGuideModal from './RitualGuideModal';



interface DateDetailModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function DateDetailModal({ visible, onClose }: DateDetailModalProps) {
    const { settings, currentBsDate, dayInfo, customHolidays, deleteCustomHoliday, strings } = useApp();
    const [guideVisible, setGuideVisible] = React.useState(false);
    const isEn = settings.language === 'en';


    const customHolidayKey = `${currentBsDate.year}-${currentBsDate.month}-${currentBsDate.day}`;
    const customHolidayName = customHolidays[customHolidayKey] ?? null;



    const tithiName = dayInfo.mitiTithi
        ? (isEn ? dayInfo.mitiTithi.title?.en : dayInfo.mitiTithi.title?.np) || dayInfo.tithi.name
        : dayInfo.tithi.name;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>
                            {isEn ? 'Date Details' : 'मिति विवरण'}
                        </Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X size={24} color="#1A1A2E" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Main Date */}
                        <View style={styles.dateBox}>
                            <Text style={styles.bigDate}>
                                {isEn ? currentBsDate.day : toNepaliDigits(currentBsDate.day)}
                            </Text>
                            <Text style={styles.monthYear}>
                                {isEn
                                    ? `${BS_MONTH_NAMES_EN[currentBsDate.month - 1]} ${currentBsDate.year}`
                                    : `${BS_MONTH_NAMES_NP[currentBsDate.month - 1]} ${toNepaliDigits(currentBsDate.year)}`
                                }
                            </Text>
                            <Text style={styles.englishDate}>
                                {dayInfo.englishDateStr} • {dayInfo.dayNameNp}
                            </Text>
                        </View>

                        {/* Tithi */}
                        <View style={styles.infoCard}>
                            <View style={styles.infoRow}>
                                <Star size={20} color="#E91E63" />
                                <View style={styles.infoContent}>
                                    <View style={styles.tithiHeader}>
                                        <View>
                                            <Text style={styles.infoLabel}>{isEn ? 'Tithi' : 'तिथि'}</Text>
                                            <Text style={styles.infoValue}>{tithiName}</Text>
                                        </View>
                                        <TouchableOpacity 
                                            style={styles.ritualBtn}
                                            onPress={() => setGuideVisible(true)}
                                            activeOpacity={0.7}
                                        >
                                            <Sparkles size={16} color="#FFF" />
                                            <Text style={styles.ritualBtnText}>{strings.viewRitualGuide}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {dayInfo.mitiTithi?.display && (
                                        <Text style={styles.infoSub}>{isEn ? dayInfo.mitiTithi.display.en : dayInfo.mitiTithi.display.np}</Text>
                                    )}
                                </View>
                            </View>
                        </View>


                        {/* Sunrise/Sunset */}
                        {dayInfo.sunTimes && (
                            <View style={styles.infoCard}>
                                <View style={styles.timesRow}>
                                    <View style={styles.timeItem}>
                                        <Sun size={20} color="#F59E0B" />
                                        <Text style={styles.timeLabel}>{isEn ? 'Sunrise' : 'सूर्योदय'}</Text>
                                        <Text style={styles.timeValue}>{dayInfo.sunTimes.sunrise || '--:--'}</Text>
                                    </View>
                                    <View style={styles.timeDivider} />
                                    <View style={styles.timeItem}>
                                        <Moon size={20} color="#6366F1" />
                                        <Text style={styles.timeLabel}>{isEn ? 'Sunset' : 'सूर्यास्त'}</Text>
                                        <Text style={styles.timeValue}>{dayInfo.sunTimes.sunset || '--:--'}</Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Custom Holiday */}
                        {customHolidayName && (
                            <View style={styles.infoCard}>
                                <View style={styles.infoRow}>
                                    <Flag size={20} color="#009688" />
                                    <View style={styles.infoContent}>
                                        <Text style={styles.infoLabel}>{strings.customHoliday}</Text>
                                        <Text style={[styles.infoValue, { color: '#009688' }]}>{customHolidayName}</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.deleteHolidayBtn}
                                        onPress={() => deleteCustomHoliday(currentBsDate)}
                                        activeOpacity={0.7}
                                    >
                                        <Trash2 size={16} color="#E8533F" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {/* Events */}
                        {dayInfo.mitiEvents && dayInfo.mitiEvents.length > 0 && (
                            <View style={styles.infoCard}>
                                <View style={styles.infoRow}>
                                    <Calendar size={20} color="#10B981" />
                                    <View style={styles.infoContent}>
                                        <Text style={styles.infoLabel}>{isEn ? 'Events' : 'कार्यक्रमहरू'}</Text>
                                        {dayInfo.mitiEvents.map((event, index) => (
                                            <View key={index} style={styles.eventItem}>
                                                <Text style={styles.eventTitle}>
                                                    {isEn ? event.title?.en : event.title?.np}
                                                </Text>
                                                {event.isHoliday && (
                                                    <View style={styles.holidayBadge}>
                                                        <Text style={styles.holidayText}>{isEn ? 'Holiday' : 'बिदा'}</Text>
                                                    </View>
                                                )}
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Panchanga Details */}
                        {dayInfo.mitiData?.panchangaDetails && (
                            <View style={styles.infoCard}>
                                <Text style={styles.cardTitle}>{isEn ? 'Panchanga' : 'पञ्चाङ्ग'}</Text>
                                {dayInfo.mitiData.panchangaDetails.nakshatra && (
                                    <View style={styles.panchangaRow}>
                                        <Text style={styles.panchangaLabel}>{isEn ? 'Nakshatra' : 'नक्षत्र'}</Text>
                                        <Text style={styles.panchangaValue}>{dayInfo.mitiData.panchangaDetails.nakshatra.np}</Text>
                                    </View>
                                )}
                                {dayInfo.mitiData.panchangaDetails.yog && (
                                    <View style={styles.panchangaRow}>
                                        <Text style={styles.panchangaLabel}>{isEn ? 'Yog' : 'योग'}</Text>
                                        <Text style={styles.panchangaValue}>{dayInfo.mitiData.panchangaDetails.yog.np}</Text>
                                    </View>
                                )}
                                {dayInfo.mitiData.panchangaDetails.karans && (
                                    <View style={styles.panchangaRow}>
                                        <Text style={styles.panchangaLabel}>{isEn ? 'Karan' : 'करण'}</Text>
                                        <Text style={styles.panchangaValue}>{dayInfo.mitiData.panchangaDetails.karans.first.np}</Text>
                                    </View>
                                )}
                                {dayInfo.mitiData.panchangaDetails.pakshya && (
                                    <View style={styles.panchangaRow}>
                                        <Text style={styles.panchangaLabel}>{isEn ? 'Pakshya' : 'पक्ष'}</Text>
                                        <Text style={styles.panchangaValue}>{isEn ? dayInfo.mitiData.panchangaDetails.pakshya.en : dayInfo.mitiData.panchangaDetails.pakshya.np}</Text>
                                    </View>
                                )}
                            </View>
                        )}

                        <View style={{ height: 30 }} />
                    </ScrollView>
                </View>

                <RitualGuideModal 
                    visible={guideVisible}
                    onClose={() => setGuideVisible(false)}
                    tithi={tithiName}
                />
            </View>
        </Modal>

    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    content: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '85%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    closeBtn: {
        padding: 4,
    },
    dateBox: {
        alignItems: 'center',
        paddingVertical: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    bigDate: {
        fontSize: 72,
        fontWeight: '800',
        color: '#E91E63',
    },
    monthYear: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1A1A2E',
        marginTop: 4,
    },
    englishDate: {
        fontSize: 14,
        color: '#9CA3AF',
        marginTop: 8,
    },
    infoCard: {
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        backgroundColor: '#FAFAF7',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFE4EC',
    },
    infoRow: {
        flexDirection: 'row',
        gap: 12,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A2E',
    },
    infoSub: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 4,
    },
    timesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    timeItem: {
        alignItems: 'center',
        gap: 4,
    },
    timeLabel: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    timeValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    timeDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#E5E7EB',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A2E',
        marginBottom: 12,
    },
    eventItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    eventTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1A1A2E',
        flex: 1,
    },
    holidayBadge: {
        backgroundColor: '#E91E63',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 8,
    },
    holidayText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#FFF',
    },
    panchangaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    panchangaLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    panchangaValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1A1A2E',
    },
    deleteHolidayBtn: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#FFF1F0',
    },
    tithiHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    ritualBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FF9800',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    ritualBtnText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '700',
    },
});

