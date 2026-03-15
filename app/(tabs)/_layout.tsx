import { Tabs } from 'expo-router';
import { CalendarDays, PartyPopper, ArrowRightLeft, Settings } from 'lucide-react-native';
import React from 'react';

export default function TabLayout() {
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
                    title: 'MobilePatro',
                    tabBarIcon: ({ color, size }) => <CalendarDays size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="festivals"
                options={{
                    title: 'Festivals',
                    tabBarIcon: ({ color, size }) => <PartyPopper size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="converter"
                options={{
                    title: 'Date Converter',
                    tabBarIcon: ({ color, size }) => <ArrowRightLeft size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}