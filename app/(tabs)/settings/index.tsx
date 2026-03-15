import React from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    Sun, Globe, Sunrise, Sparkles, Info, MessageCircle, Languages,
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { ThemeMode } from '@/constants/themes';
import { Language } from '@/constants/translations';
import { StatusBar } from 'expo-status-bar';

// Theme is now always light, no options needed
const THEME_OPTIONS: { mode: ThemeMode; label: string; labelNp: string; icon: typeof Sun }[] = [
    { mode: 'light', label: 'Light', labelNp: 'उज्यालो', icon: Sun },
];

export default function SettingsScreen() {
    const { settings, updateSettings, strings } = useApp();
    const insets = useSafeAreaInsets();
    
    // Light theme colors
    const themeColors = {
        background: '#FFF5F7',
        surface: '#FFF',
        text: '#1A1A2E',
        textSecondary: '#5C5C6F',
        textTertiary: '#9CA3AF',
        accent: '#E91E63',
        border: '#FFE4EC',
    };

    const renderToggle = (
        label: string,
        value: boolean,
        onChange: (val: boolean) => void,
        icon: React.ReactNode,
        testId: string,
    ) => (
        <View style={[styles.row, { borderBottomColor: themeColors.border }]}>
            <View style={styles.rowLeft}>
                {icon}
                <Text style={[styles.rowLabel, { color: themeColors.text }]}>{label}</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onChange}
                trackColor={{ false: themeColors.border, true: themeColors.accent + '60' }}
                thumbColor={value ? themeColors.accent : themeColors.textTertiary}
                testID={testId}
            />
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
            <StatusBar style="dark" />
            <ScrollView
                contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.screenTitle, { color: themeColors.text }]}>{strings.settings}</Text>

                <Text style={[styles.sectionTitle, { color: themeColors.textTertiary }]}>{strings.language}</Text>
                <View style={[styles.themeRow, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
                    {([['np', strings.nepali], ['en', strings.english]] as [Language, string][]).map(([lang, label]) => {
                        const isActive = settings.language === lang;
                        return (
                            <TouchableOpacity
                                key={lang}
                                style={[
                                    styles.themeOption,
                                    isActive && { backgroundColor: themeColors.accent + '18' },
                                ]}
                                onPress={() => updateSettings({ language: lang })}
                                testID={`lang-${lang}`}
                            >
                                <Languages size={18} color={isActive ? themeColors.accent : themeColors.textTertiary} />
                                <Text
                                    style={[
                                        styles.themeLabel,
                                        { color: isActive ? themeColors.accent : themeColors.textSecondary },
                                    ]}
                                >
                                    {label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Theme section removed - app now uses light theme only */}

                <Text style={[styles.sectionTitle, { color: themeColors.textTertiary }]}>{strings.display}</Text>
                <View style={[styles.section, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
                    {renderToggle(
                        strings.showEnglishDate,
                        settings.showEnglishDate,
                        (val) => updateSettings({ showEnglishDate: val }),
                        <Globe size={18} color={themeColors.textSecondary} />,
                        'toggle-english',
                    )}
                    {renderToggle(
                        strings.showSunTimes,
                        settings.showSunTimes,
                        (val) => updateSettings({ showSunTimes: val }),
                        <Sunrise size={18} color={themeColors.textSecondary} />,
                        'toggle-sun',
                    )}
                    {renderToggle(
                        strings.festivalAnimation,
                        settings.showFestivalAnimation,
                        (val) => updateSettings({ showFestivalAnimation: val }),
                        <Sparkles size={18} color={themeColors.textSecondary} />,
                        'toggle-festival',
                    )}
                </View>

                <Text style={[styles.sectionTitle, { color: themeColors.textTertiary }]}>{strings.about}</Text>
                <View style={[styles.section, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
                    <View style={[styles.row, { borderBottomColor: themeColors.border }]}>
                        <View style={styles.rowLeft}>
                            <Info size={18} color={themeColors.textSecondary} />
                            <Text style={[styles.rowLabel, { color: themeColors.text }]}>{strings.nepaliCalendar}</Text>
                        </View>
                        <Text style={[styles.versionText, { color: themeColors.textTertiary }]}>v1.0.0</Text>
                    </View>
                    <TouchableOpacity style={styles.row}>
                        <View style={styles.rowLeft}>
                            <MessageCircle size={18} color={themeColors.textSecondary} />
                            <Text style={[styles.rowLabel, { color: themeColors.text }]}>{strings.feedback}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <Text style={[styles.footer, { color: themeColors.textTertiary }]}>
                    {strings.beautyOfToday}
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    screenTitle: {
        fontSize: 28,
        fontWeight: '800' as const,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700' as const,
        textTransform: 'uppercase' as const,
        letterSpacing: 1,
        marginBottom: 8,
        marginTop: 20,
        paddingHorizontal: 4,
    },
    themeRow: {
        flexDirection: 'row',
        borderRadius: 16,
        borderWidth: 1,
        padding: 4,
        gap: 4,
    },
    themeOption: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 4,
    },
    themeLabel: {
        fontSize: 11,
        fontWeight: '600' as const,
    },
    section: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    rowLabel: {
        fontSize: 15,
        fontWeight: '500' as const,
    },
    versionText: {
        fontSize: 13,
    },
    footer: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 13,
        fontStyle: 'italic' as const,
    },
});
