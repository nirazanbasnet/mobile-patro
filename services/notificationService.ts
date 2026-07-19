import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Check if running in Expo Go
const isExpoGo = !Constants.expoConfig?.extra?.eas?.projectId;

// Configure how notifications are handled when the app is foregrounded
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const requestNotificationPermissions = async () => {
    // Skip permission request in Expo Go on Android to avoid warnings
    if (Platform.OS === 'android' && isExpoGo) {
        console.log('Running in Expo Go - skipping notification permissions');
        return false;
    }
    
    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        return finalStatus === 'granted';
    } catch (error) {
        console.log('Notification permissions not available:', error);
        return false;
    }
};

/**
 * Resolves the moment a reminder should fire.
 *
 * `adDate` is the Gregorian date of the event itself (month is 1-indexed, as
 * returned by bsToAd). `leadDays` shifts the notification earlier — 1 means
 * "the day before" — and `time` is "HH:mm" on that shifted day.
 *
 * Returns null when the resulting moment is already in the past, which is the
 * caller's signal that the reminder cannot be scheduled.
 */
export const resolveReminderFireDate = (
    adDate: { year: number; month: number; day: number },
    time: string,
    leadDays: number,
): Date | null => {
    const [hours, minutes] = time.split(':').map(Number);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;

    // Construct then shift, so month/year rollover is handled by Date itself
    // (e.g. 1 day before Baisakh 1 lands on the previous Gregorian month).
    const fireAt = new Date(adDate.year, adDate.month - 1, adDate.day, hours, minutes, 0, 0);
    fireAt.setDate(fireAt.getDate() - leadDays);

    return fireAt.getTime() > Date.now() ? fireAt : null;
};

export const scheduleEventReminder = async (title: string, body: string, date: Date) => {
    // Basic safety check: don't schedule for the past
    if (date.getTime() <= Date.now()) {
        return null;
    }

    try {
        const identifier = await Notifications.scheduleNotificationAsync({
            content: {
                title: title,
                body: body,
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date,
            },
        });
        
        return identifier;
    } catch (error) {
        console.log('Failed to schedule notification:', error);
        return null;
    }
};

export const cancelNotification = async (id: string) => {
    await Notifications.cancelScheduledNotificationAsync(id);
};

export const cancelAllNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
};
