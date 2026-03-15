import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { X, Sparkles, ShoppingBag, ListChecks, AlertCircle, RefreshCw } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { generateRitualGuide, RitualGuide } from '@/services/aiService';

interface RitualGuideModalProps {
    visible: boolean;
    onClose: () => void;
    tithi: string;
}

export default function RitualGuideModal({ visible, onClose, tithi }: RitualGuideModalProps) {
    const { settings, strings, theme } = useApp();
    const [loading, setLoading] = useState(false);
    const [guide, setGuide] = useState<RitualGuide | null>(null);
    const [error, setError] = useState<string | null>(null);

    const isEn = settings.language === 'en';

    useEffect(() => {
        if (visible && tithi) {
            fetchGuide();
        }
    }, [visible, tithi]);

    const fetchGuide = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await generateRitualGuide(tithi, settings.language);
            setGuide(data);
        } catch (err: any) {
            setError(err.message || 'Failed to generate guide');
        } finally {
            setLoading(false);
        }
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.content, { backgroundColor: '#FFFAF0' }]}>
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <Sparkles size={20} color="#FF9800" />
                            <Text style={styles.headerTitle}>
                                {guide?.title || (isEn ? 'AI Ritual Guide' : 'एआई संस्कार विधि')}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X size={24} color="#1A1A2E" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        {loading ? (
                            <View style={styles.centerContainer}>
                                <ActivityIndicator size="large" color="#FF9800" />
                                <Text style={styles.loadingText}>{strings.loadingRitual}</Text>
                            </View>
                        ) : error ? (
                            <View style={styles.centerContainer}>
                                <AlertCircle size={48} color="#E8533F" />
                                <Text style={styles.errorText}>{error}</Text>
                                <TouchableOpacity style={styles.retryBtn} onPress={fetchGuide}>
                                    <RefreshCw size={16} color="#FFF" />
                                    <Text style={styles.retryText}>{strings.retryRitual}</Text>
                                </TouchableOpacity>
                            </View>
                        ) : guide ? (
                            <>
                                <View style={styles.section}>
                                    <View style={styles.sectionHeader}>
                                        <ShoppingBag size={20} color="#FF9800" />
                                        <Text style={styles.sectionTitle}>{strings.ritualItems}</Text>
                                    </View>
                                    <View style={styles.itemsGrid}>
                                        {guide.items.map((item, idx) => (
                                            <View key={idx} style={styles.itemBadge}>
                                                <Text style={styles.itemText}>{item}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>


                                <View style={styles.section}>
                                    <View style={styles.sectionHeader}>
                                        <ListChecks size={20} color="#FF9800" />
                                        <Text style={styles.sectionTitle}>{strings.ritualSteps}</Text>
                                    </View>
                                    {guide.steps.map((step, idx) => (
                                        <View key={idx} style={styles.stepContainer}>
                                            <View style={styles.stepNumber}>
                                                <Text style={styles.stepNumberText}>{idx + 1}</Text>
                                            </View>
                                            <Text style={styles.stepText}>{step}</Text>
                                        </View>
                                    ))}
                                </View>


                                <View style={styles.disclaimerBox}>
                                    <AlertCircle size={14} color="#666" />
                                    <Text style={styles.disclaimerText}>{strings.aiDisclaimer}</Text>
                                </View>
                            </>
                        ) : null}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 10, 0.4)',
        justifyContent: 'flex-end',
    },
    content: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        height: '90%',
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0EAD6',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#5D4037',
    },
    closeBtn: {
        padding: 4,
    },
    scrollContent: {
        padding: 24,
    },
    centerContainer: {
        paddingVertical: 60,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    loadingText: {
        fontSize: 16,
        color: '#8D6E63',
        fontWeight: '500',
    },
    errorText: {
        fontSize: 14,
        color: '#E8533F',
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    retryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF9800',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        gap: 8,
        marginTop: 10,
    },
    retryText: {
        color: '#FFF',
        fontWeight: '600',
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#5D4037',
    },
    itemsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    itemBadge: {
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FFE0B2',
        shadowColor: '#5D4037',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    itemText: {
        fontSize: 14,
        color: '#6D4C41',
        fontWeight: '500',
    },
    stepContainer: {
        flexDirection: 'row',
        gap: 14,
        marginBottom: 20,
    },
    stepNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FFE0B2',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    stepNumberText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#E65100',
    },
    stepText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 22,
        color: '#4E342E',
    },
    disclaimerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#F5F5F5',
        padding: 12,
        borderRadius: 12,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    disclaimerText: {
        flex: 1,
        fontSize: 11,
        color: '#757575',
        fontStyle: 'italic',
    },
});
