import React, { useState, useRef } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Modal, 
    TouchableOpacity, 
    TextInput, 
    ActivityIndicator, 
    KeyboardAvoidingView, 
    Platform,
    ScrollView,
    Alert
} from 'react-native';
import { X, Sparkles, Calendar, Bell, ChevronRight, Save, Mic } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { parseSmartEvent, SmartEvent } from '@/services/aiService';
import { requestNotificationPermissions, scheduleEventReminder } from '@/services/notificationService';
import { bsToAd } from '@/utils/bs-converter';

interface SmartAddModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function SmartAddModal({ visible, onClose }: SmartAddModalProps) {
    const { currentBsDate, saveSmartEvent, saveNote, strings, theme } = useApp();
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<SmartEvent | null>(null);
    const inputRef = useRef<TextInput>(null);

    const handleParse = async () => {
        if (!input.trim()) return;
        
        setLoading(true);
        try {
            const result = await parseSmartEvent(input, currentBsDate);
            setPreview(result);
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to parse event");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!preview) return;

        try {
            // 1. Save structured SmartEvent to AppContext
            saveSmartEvent(preview);
            
            // Also save a plain note for compatibility
            saveNote(preview.title + (preview.remindAtTime ? ` (${preview.remindAtTime})` : ''));

            // 2. Schedule notification if enabled
            if (preview.reminderEnabled) {
                const hasPermission = await requestNotificationPermissions();
                if (hasPermission) {
                    // Convert BS date to AD for notification trigger
                    const ad = bsToAd(preview.date.year, preview.date.month, preview.date.day);
                    
                    let scheduleDate = new Date(ad.year, ad.month - 1, ad.day);
                    
                    if (preview.remindAtTime) {
                        const [hours, mins] = preview.remindAtTime.split(':').map(Number);
                        scheduleDate.setHours(hours, mins, 0, 0);
                    } else {
                        // Default to 9 AM on that day
                        scheduleDate.setHours(9, 0, 0, 0);
                    }

                    await scheduleEventReminder(
                        preview.title,
                        `Reminder: ${preview.title}`,
                        scheduleDate
                    );
                }
            }

            Alert.alert(
                strings.language === 'en' ? "Success" : "सफल", 
                strings.language === 'en' ? "Event added successfully!" : "घटना थपियो!"
            );
            handleClose();
        } catch (error: any) {
            Alert.alert("Error", "Failed to save event");
        }
    };

    const handleClose = () => {
        setInput('');
        setPreview(null);
        onClose();
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <Sparkles size={20} color="#FF9800" />
                            <Text style={styles.headerTitle}>
                                {strings.smartAdd}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                            <X size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
                        <Text style={styles.label}>
                            {strings.whatsHappening}
                        </Text>
                        
                        <View style={styles.inputContainer}>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    ref={inputRef}
                                    style={styles.input}
                                    placeholder={strings.smartAddInputPlaceholder}
                                    value={input}
                                    onChangeText={setInput}
                                    multiline
                                    numberOfLines={3}
                                    autoFocus
                                />
                                <View style={styles.actionRow}>
                                    <TouchableOpacity style={styles.micBtn} onPress={() => Alert.alert("Voice Assistant", "Using your system keyboard's mic is the easiest way to speak! Try tapping the mic icon on your keyboard.")}>
                                        <Mic size={22} color="#FF9800" />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={[styles.parseBtn, !input.trim() && styles.disabledBtn]} 
                                        onPress={handleParse} 
                                        disabled={loading || !input.trim()}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color="#FFF" size="small" />
                                        ) : (
                                            <Sparkles size={20} color="#FFF" />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <Text style={styles.hintText}>
                            {strings.typingVoiceHint}
                        </Text>

                        {preview && (
                            <View style={styles.previewCard}>
                                <Text style={styles.previewHeader}>
                                    {strings.parsedAITitle}
                                </Text>
                                
                                <View style={styles.previewRow}>
                                    <Calendar size={18} color="#FF9800" />
                                    <Text style={styles.previewVal}>
                                        {preview.date.year}/{preview.date.month}/{preview.date.day}
                                    </Text>
                                </View>

                                <View style={styles.previewRow}>
                                    <Sparkles size={18} color="#FF9800" />
                                    <Text style={styles.previewTitle}>{preview.title}</Text>
                                </View>

                                {preview.remindAtTime && (
                                    <View style={styles.previewRow}>
                                        <Bell size={18} color="#FF9800" />
                                        <Text style={styles.previewVal}>{preview.remindAtTime}</Text>
                                    </View>
                                )}

                                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                                    <Save size={20} color="#FFF" />
                                    <Text style={styles.saveBtnText}>
                                        {strings.language === 'en' ? 'Confirm & Add' : 'निश्चित गरि थप्नुहोस्'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        maxHeight: '80%',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    closeBtn: {
        padding: 4,
    },
    content: {
        padding: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 12,
    },
    inputContainer: {
        marginBottom: 8,
    },
    inputWrapper: {
        backgroundColor: '#F8F9FA',
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    input: {
        fontSize: 16,
        color: '#1A1A2E',
        minHeight: 100,
        textAlignVertical: 'top',
        paddingTop: 8,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 10,
    },
    micBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF9F0',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#FFE0B2',
    },
    parseBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FF9800',
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledBtn: {
        backgroundColor: '#E9ECEF',
    },
    hintText: {
        fontSize: 12,
        color: '#888',
        lineHeight: 18,
        marginBottom: 24,
    },
    previewCard: {
        backgroundColor: '#FFF9F0',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#FFE0B2',
    },
    previewHeader: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#FF9800',
        textTransform: 'uppercase',
        marginBottom: 16,
    },
    previewRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    previewVal: {
        fontSize: 16,
        color: '#1A1A2E',
        fontWeight: '500',
    },
    previewTitle: {
        fontSize: 16,
        color: '#1A1A2E',
        fontWeight: '600',
        flex: 1,
    },
    saveBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: '#4CAF50',
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 10,
    },
    saveBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
