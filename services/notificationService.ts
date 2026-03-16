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

export const scheduleEventReminder = async (title: string, body: string, date: Date) => {
    // Basic safety check: don't schedule for the past
    if (date.getTime() <= Date.now()) {
        return null;
    }

    // In a real app, you might want to schedule it e.g. 1 hour before
    // For now, we schedule at the exact time parsed
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
