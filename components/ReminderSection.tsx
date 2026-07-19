import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Bell, Plus, Trash2, Clock } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { toNepaliDigits } from '@/utils/nepali';
import type { Reminder } from '@/contexts/AppContext';

/**
 * Preset times, so adding a reminder stays a two-tap action. Reminders rarely
 * need minute precision, and a wheel picker would mean a new dependency plus a
 * nested modal — both of which React Native handles poorly inside a bottom sheet.
 */
const TIME_PRESETS = [
    { value: '09:00', labelKey: 'timeMorning' as const },
    { value: '12:00', labelKey: 'timeNoon' as const },
    { value: '18:00', labelKey: 'timeEvening' as const },
];

/**
 * Renders "09:00" as "9:00 AM" (en) or "९:०० बिहान" (np).
 *
 * `includePeriod` is off inside the preset chips, where the period word is
 * already the chip's own label and would otherwise read "बिहान / ९:०० बिहान".
 */
function formatTime(
    time: string,
    isEn: boolean,
    strings: ReturnType<typeof useApp>['strings'],
    includePeriod = true,
) {
    const [hours, minutes] = time.split(':').map(Number);
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    const mm = String(minutes).padStart(2, '0');

    if (isEn) {
        const clock = `${displayHour}:${mm}`;
        return includePeriod ? `${clock} ${hours >= 12 ? 'PM' : 'AM'}` : clock;
    }

    const clock = `${toNepaliDigits(displayHour)}:${toNepaliDigits(mm)}`;
    if (!includePeriod) return clock;
    const period = hours < 12 ? strings.timeMorning : hours < 17 ? strings.timeNoon : strings.timeEvening;
    return `${clock} ${period}`;
}

export default function ReminderSection() {
    const { currentBsDate, reminders, addReminder, deleteReminder, settings, strings } = useApp();
    const isEn = settings.language === 'en';

    const [expanded, setExpanded] = React.useState(false);
    const [title, setTitle] = React.useState('');
    const [time, setTime] = React.useState(TIME_PRESETS[0].value);
    const [leadDays, setLeadDays] = React.useState(1); // default: the day before
    const [saving, setSaving] = React.useState(false);

    const dayKey = `${currentBsDate.year}-${currentBsDate.month}-${currentBsDate.day}`;
    const dayReminders: Reminder[] = reminders[dayKey] ?? [];

    const resetForm = () => {
        setTitle('');
        setTime(TIME_PRESETS[0].value);
        setLeadDays(1);
        setExpanded(false);
    };

    const handleSave = async () => {
        const trimmed = title.trim();
        if (!trimmed) {
            Alert.alert(strings.error, strings.reminderEmpty);
            return;
        }

        setSaving(true);
        try {
            const result = await addReminder(currentBsDate, { title: trimmed, time, leadDays });
            if (!result.ok) {
                Alert.alert(strings.error, strings.reminderPastTime);
                return;
            }
            resetForm();
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <Bell size={20} color="#7C3AED" />
                <Text style={styles.headerTitle}>{strings.reminders}</Text>
                {!expanded && (
                    <TouchableOpacity
                        style={styles.addBtn}
                        onPress={() => setExpanded(true)}
                        activeOpacity={0.7}
                        accessibilityLabel={strings.addReminder}
                    >
                        <Plus size={16} color="#FFF" />
                    </TouchableOpacity>
                )}
            </View>

            {dayReminders.length === 0 && !expanded && (
                <Text style={styles.emptyText}>{strings.noReminders}</Text>
            )}

            {dayReminders.map(reminder => (
                <View key={reminder.id} style={styles.reminderRow}>
                    <View style={styles.reminderBody}>
                        <Text style={styles.reminderTitle}>{reminder.title}</Text>
                        <View style={styles.reminderMeta}>
                            <Clock size={12} color="#7C3AED" />
                            <Text style={styles.reminderMetaText}>
                                {reminder.leadDays === 1 ? strings.oneDayBefore : strings.onTheDay}
                                {' · '}
                                {formatTime(reminder.time, isEn, strings)}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => deleteReminder(currentBsDate, reminder.id)}
                        activeOpacity={0.7}
                        accessibilityLabel={strings.delete}
                    >
                        <Trash2 size={16} color="#E8533F" />
                    </TouchableOpacity>
                </View>
            ))}

            {expanded && (
                <View style={styles.form}>
                    <Text style={styles.fieldLabel}>{strings.reminderQuestion}</Text>
                    <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                        placeholder={strings.reminderPlaceholder}
                        placeholderTextColor="#B0B0B0"
                        autoFocus
                        returnKeyType="done"
                        onSubmitEditing={handleSave}
                    />

                    <Text style={styles.fieldLabel}>{strings.notifyMe}</Text>
                    <View style={styles.segmented}>
                        {[
                            { value: 1, label: strings.oneDayBefore },
                            { value: 0, label: strings.onTheDay },
                        ].map(option => (
                            <TouchableOpacity
                                key={option.value}
                                style={[styles.segment, leadDays === option.value && styles.segmentActive]}
                                onPress={() => setLeadDays(option.value)}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[
                                        styles.segmentText,
                                        leadDays === option.value && styles.segmentTextActive,
                                    ]}
                                >
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.fieldLabel}>{strings.reminderTime}</Text>
                    <View style={styles.chipRow}>
                        {TIME_PRESETS.map(preset => (
                            <TouchableOpacity
                                key={preset.value}
                                style={[styles.chip, time === preset.value && styles.chipActive]}
                                onPress={() => setTime(preset.value)}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.chipText, time === preset.value && styles.chipTextActive]}>
                                    {strings[preset.labelKey]}
                                </Text>
                                <Text style={[styles.chipTime, time === preset.value && styles.chipTextActive]}>
                                    {formatTime(preset.value, isEn, strings, false)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={resetForm} activeOpacity={0.7}>
                            <Text style={styles.cancelText}>{strings.cancel}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                            onPress={handleSave}
                            disabled={saving}
                            activeOpacity={0.7}
                        >
                            {saving ? (
                                <ActivityIndicator size="small" color="#FFF" />
                            ) : (
                                <Text style={styles.saveText}>{strings.save}</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        backgroundColor: '#FAF8FF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E9E0FF',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    addBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#7C3AED',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 13,
        color: '#9CA3AF',
        marginTop: 10,
    },
    reminderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#EFE8FF',
    },
    reminderBody: {
        flex: 1,
    },
    reminderTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A2E',
    },
    reminderMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    reminderMetaText: {
        fontSize: 12,
        color: '#7C3AED',
        fontWeight: '500',
    },
    deleteBtn: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#FFF1F0',
    },
    form: {
        marginTop: 14,
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: '#EFE8FF',
    },
    fieldLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E9E0FF',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
        color: '#1A1A2E',
        marginBottom: 16,
    },
    segmented: {
        flexDirection: 'row',
        backgroundColor: '#F1EBFF',
        borderRadius: 10,
        padding: 3,
        marginBottom: 16,
    },
    segment: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    segmentActive: {
        backgroundColor: '#7C3AED',
    },
    segmentText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    segmentTextActive: {
        color: '#FFF',
    },
    chipRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 20,
    },
    chip: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E9E0FF',
        backgroundColor: '#FFF',
        alignItems: 'center',
        gap: 2,
    },
    chipActive: {
        backgroundColor: '#7C3AED',
        borderColor: '#7C3AED',
    },
    chipText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1A1A2E',
    },
    chipTime: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    chipTextActive: {
        color: '#FFF',
    },
    actions: {
        flexDirection: 'row',
        gap: 10,
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
    },
    cancelText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    saveBtn: {
        flex: 2,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#7C3AED',
    },
    saveBtnDisabled: {
        opacity: 0.6,
    },
    saveText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFF',
    },
});
