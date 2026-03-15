import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, Modal, TextInput, TouchableOpacity,
    StyleSheet, Animated, Pressable, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import type { BsDate } from '@/utils/bs-converter';
import { BS_MONTH_NAMES_EN, BS_MONTH_NAMES_NP } from '@/data/bs-data';
import { toNepaliDigits } from '@/utils/nepali';

interface Props {
    visible: boolean;
    onClose: () => void;
    bsDate: BsDate;
}

export default function CustomHolidayModal({ visible, onClose, bsDate }: Props) {
    const { customHolidays, saveCustomHoliday, deleteCustomHoliday, theme, settings, strings } = useApp();
    const isEn = settings.language === 'en';

    const key = `${bsDate.year}-${bsDate.month}-${bsDate.day}`;
    const existing = customHolidays[key] ?? '';
    const isEditing = !!existing;

    const [name, setName] = useState(existing);
    const slideAnim = useRef(new Animated.Value(400)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            setName(customHolidays[key] ?? '');
            Animated.parallel([
                Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
            ]).start();
        } else {
            slideAnim.setValue(400);
            fadeAnim.setValue(0);
        }
    }, [visible, key]);

    const dismiss = () => {
        Animated.parallel([
            Animated.timing(slideAnim, { toValue: 400, duration: 200, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start(() => onClose());
    };

    const handleSave = () => {
        if (name.trim()) {
            saveCustomHoliday(bsDate, name.trim());
        }
        dismiss();
    };

    const handleDelete = () => {
        deleteCustomHoliday(bsDate);
        dismiss();
    };

    const dateLabel = isEn
        ? `${BS_MONTH_NAMES_EN[bsDate.month - 1]} ${bsDate.day}, ${bsDate.year}`
        : `${BS_MONTH_NAMES_NP[bsDate.month - 1]} ${toNepaliDigits(bsDate.day)}, ${toNepaliDigits(bsDate.year)}`;

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={dismiss}>
            <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={dismiss} />
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <Animated.View
                        style={[
                            styles.sheet,
                            { backgroundColor: theme.background, transform: [{ translateY: slideAnim }] },
                        ]}
                    >
                        {/* Handle */}
                        <View style={styles.handleWrap}>
                            <View style={[styles.handleBar, { backgroundColor: theme.border }]} />
                        </View>

                        {/* Title */}
                        <Text style={[styles.title, { color: theme.text }]}>
                            {isEditing ? strings.editCustomHoliday : strings.addCustomHoliday}
                        </Text>
                        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{dateLabel}</Text>

                        {/* Input */}
                        <Text style={[styles.label, { color: theme.textSecondary }]}>
                            {strings.customHolidayName}
                        </Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: theme.background,
                                    borderColor: theme.border,
                                    color: theme.text,
                                },
                            ]}
                            placeholder={strings.customHolidayPlaceholder}
                            placeholderTextColor={theme.textTertiary}
                            value={name}
                            onChangeText={setName}
                            autoFocus
                            returnKeyType="done"
                            onSubmitEditing={handleSave}
                            maxLength={60}
                        />

                        {/* Actions */}
                        <View style={styles.actions}>
                            {isEditing && (
                                <TouchableOpacity
                                    style={[styles.deleteBtn, { borderColor: '#E8533F' }]}
                                    onPress={handleDelete}
                                    activeOpacity={0.75}
                                >
                                    <Trash2 size={16} color="#E8533F" />
                                    <Text style={[styles.deleteBtnText, { color: '#E8533F' }]}>
                                        {strings.deleteCustomHoliday}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                style={[styles.cancelBtn, { borderColor: theme.border }]}
                                onPress={dismiss}
                                activeOpacity={0.75}
                            >
                                <Text style={[styles.cancelBtnText, { color: theme.textSecondary }]}>
                                    {strings.cancel}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.saveBtn,
                                    { backgroundColor: '#009688', opacity: name.trim() ? 1 : 0.5 },
                                ]}
                                onPress={handleSave}
                                disabled={!name.trim()}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.saveBtnText}>{strings.save}</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </KeyboardAvoidingView>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    sheet: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    handleWrap: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    handleBar: {
        width: 40,
        height: 4,
        borderRadius: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 13,
        marginBottom: 20,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 6,
        letterSpacing: 0.3,
    },
    input: {
        borderWidth: 1.5,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        marginBottom: 20,
    },
    actions: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    deleteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        borderWidth: 1.5,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    deleteBtnText: {
        fontSize: 14,
        fontWeight: '600',
    },
    cancelBtn: {
        flex: 1,
        borderWidth: 1.5,
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
    },
    cancelBtnText: {
        fontSize: 14,
        fontWeight: '600',
    },
    saveBtn: {
        flex: 1,
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
    },
    saveBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFF',
    },
});
