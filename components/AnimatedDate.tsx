import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { useApp } from '@/contexts/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AnimatedDate() {
    const { dayInfo, theme, settings } = useApp();
    const slideAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const prevDay = useRef(dayInfo.nepaliDay);

    useEffect(() => {
        if (prevDay.current !== dayInfo.nepaliDay) {
            const direction = dayInfo.bsDate.day > parseInt(prevDay.current) || prevDay.current === '३०' ? 1 : -1;
            prevDay.current = dayInfo.nepaliDay;

            slideAnim.setValue(direction * 60);
            fadeAnim.setValue(0);
            scaleAnim.setValue(0.85);

            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 80,
                    friction: 12,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 80,
                    friction: 10,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [dayInfo.nepaliDay]);

    useEffect(() => {
        fadeAnim.setValue(0);
        scaleAnim.setValue(0.9);
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 60,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const dateSize = Math.min(SCREEN_WIDTH * 0.55, 260);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.dateContainer,
                    {
                        opacity: fadeAnim,
                        transform: [
                            { translateY: slideAnim },
                            { scale: scaleAnim },
                        ],
                    },
                ]}
            >
                <Text
                    style={[
                        styles.dateNumber,
                        {
                            color: '#E91E63',
                            fontSize: dateSize,
                            lineHeight: dateSize * 1.1,
                        },
                    ]}
                >
                    {dayInfo.nepaliDay}
                </Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    glowLayer: {
        position: 'absolute',
    },
    dateNumber: {
        fontWeight: '600' as const,
        letterSpacing: -4,
    },
});