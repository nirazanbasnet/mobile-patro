import { Tabs } from 'expo-router';
import { CalendarDays, PartyPopper, ArrowRightLeft, Settings } from 'lucide-react-native';
import React from 'react';
import { useApp } from '@/contexts/AppContext';

export default function TabLayout() {
    const { strings } = useApp();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#E91E63',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarStyle: {
                    backgroundColor: '#FFF',
                    borderTopColor: '#FFE4EC',
                    borderTopWidth: 1,
                },
            }}
        >
            <Tabs.Screen
                name="(home)"
                options={{
                    title: strings.nepaliCalendar,
                    tabBarIcon: ({ color, size }) => <CalendarDays size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="festivals"
                options={{
                    title: strings.festivals,
                    tabBarIcon: ({ color, size }) => <PartyPopper size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="converter"
                options={{
                    title: strings.dateConverter,
                    tabBarIcon: ({ color, size }) => <ArrowRightLeft size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: strings.settings,
                    tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}