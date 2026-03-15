import React, { useEffect, useRef, useState } from 'react';
import {
    View, Text, Modal, Animated, TextInput,
    TouchableOpacity, StyleSheet, KeyboardAvoidingView,
    Platform, Pressable,
} from 'react-native';
import { Bookmark } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface Props {
    visible: boolean;
    onClose: () => void;
}

export default function NoteModal({ visible, onClose }: Props) {
    const { theme, currentNote, saveNote, dayInfo, settings, strings } = useApp();
    const isEn = settings.language === 'en';
    const [text, setText] = useState(currentNote);
    const slideAnim = useRef(new Animated.Value(300)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            setText(currentNote);
            Animated.parallel([
                Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
            ]).start();
        } else {
            slideAnim.setValue(300);
            fadeAnim.setValue(0);
        }
    }, [visible, currentNote]);

    const handleSave = () => {
        saveNote(text);
        Animated.parallel([
            Animated.timing(slideAnim, { toValue: 300, duration: 200, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start(() => onClose());
    };

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={handleSave}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Animated.View style={[styles.overlay, { opacity: fadeAnim, backgroundColor: theme.modalOverlay }]}>
                    <Pressable style={styles.overlayPress} onPress={handleSave} />
                    <Animated.View
                        style={[
                            styles.sheet,
                            {
                                backgroundColor: theme.background,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <View style={styles.handle}>
                            <View style={[styles.handleBar, { backgroundColor: theme.border }]} />
                        </View>

                        <View style={styles.header}>
                            <Bookmark size={18} color={theme.accent} />
                            <Text style={[styles.title, { color: theme.text }]}>
                                {isEn ? `${strings.noteFor} ${dayInfo.monthNameNp} ${dayInfo.nepaliDay}` : `${dayInfo.monthNameNp} ${dayInfo.nepaliDay} को नोट`}
                            </Text>
                        </View>

                        <TextInput
                            style={[
                                styles.input,
                                {
                                    color: theme.text,
                                    backgroundColor: theme.surface,
                                    borderColor: theme.border,
                                },
                            ]}
                            value={text}
                            onChangeText={setText}
                            placeholder={strings.notePlaceholder}
                            placeholderTextColor={theme.textTertiary}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            testID="note-input"
                        />

                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={[styles.cancelBtn, { borderColor: theme.border }]}
                                onPress={() => {
                                    Animated.parallel([
                                        Animated.timing(slideAnim, { toValue: 300, duration: 200, useNativeDriver: true }),
                                        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
                                    ]).start(() => onClose());
                                }}
                            >
                                <Text style={[styles.cancelText, { color: theme.textSecondary }]}>{strings.cancel}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.saveBtn, { backgroundColor: theme.accent }]}
                                onPress={handleSave}
                                testID="save-note"
                            >
                                <Text style={styles.saveText}>{strings.save}</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    overlayPress: {
        flex: 1,
    },
    sheet: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingBottom: 40,
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
        gap: 8,
        marginBottom: 16,
    },
    title: {
        fontSize: 17,
        fontWeight: '700' as const,
    },
    input: {
        borderWidth: 1,
        borderRadius: 14,
        padding: 14,
        fontSize: 15,
        minHeight: 120,
        marginBottom: 16,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 14,
        borderWidth: 1,
    },
    cancelText: {
        fontSize: 15,
        fontWeight: '600' as const,
    },
    saveBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 14,
    },
    saveText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600' as const,
    },
});
