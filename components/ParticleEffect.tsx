import React, { useEffect, useRef, useMemo } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width: SW, height: SH } = Dimensions.get('window');
const PARTICLE_COUNT = 20;

interface Props {
    active: boolean;
    color?: string;
}

interface Particle {
    x: Animated.Value;
    y: Animated.Value;
    opacity: Animated.Value;
    scale: Animated.Value;
    startX: number;
    startY: number;
    size: number;
}

export default function ParticleEffect({ active, color = '#F5C542' }: Props) {
    const particles = useMemo<Particle[]>(() => {
        return Array.from({ length: PARTICLE_COUNT }, () => ({
            x: new Animated.Value(0),
            y: new Animated.Value(0),
            opacity: new Animated.Value(0),
            scale: new Animated.Value(0),
            startX: Math.random() * SW,
            startY: SH + Math.random() * 100,
            size: 4 + Math.random() * 8,
        }));
    }, []);

    useEffect(() => {
        if (!active) {
            particles.forEach(p => {
                p.opacity.setValue(0);
            });
            return;
        }

        const animations = particles.map((p, i) => {
            const delay = i * 150 + Math.random() * 300;
            const duration = 2500 + Math.random() * 1500;
            const drift = (Math.random() - 0.5) * 120;

            return Animated.sequence([
                Animated.delay(delay),
                Animated.parallel([
                    Animated.timing(p.y, {
                        toValue: -(SH * 0.5 + Math.random() * SH * 0.3),
                        duration,
                        useNativeDriver: true,
                    }),
                    Animated.timing(p.x, {
                        toValue: drift,
                        duration,
                        useNativeDriver: true,
                    }),
                    Animated.sequence([
                        Animated.timing(p.opacity, {
                            toValue: 0.7 + Math.random() * 0.3,
                            duration: 400,
                            useNativeDriver: true,
                        }),
                        Animated.timing(p.opacity, {
                            toValue: 0,
                            duration: duration - 400,
                            useNativeDriver: true,
                        }),
                    ]),
                    Animated.sequence([
                        Animated.spring(p.scale, {
                            toValue: 1,
                            tension: 100,
                            friction: 8,
                            useNativeDriver: true,
                        }),
                        Animated.timing(p.scale, {
                            toValue: 0.3,
                            duration: duration - 600,
                            useNativeDriver: true,
                        }),
                    ]),
                ]),
            ]);
        });

        const loop = () => {
            particles.forEach(p => {
                p.x.setValue(0);
                p.y.setValue(0);
                p.opacity.setValue(0);
                p.scale.setValue(0);
            });
            Animated.parallel(animations).start(() => {
                if (active) loop();
            });
        };

        loop();
    }, [active]);

    if (!active) return null;

    return (
        <View style={styles.container} pointerEvents="none">
            {particles.map((p, i) => (
                <Animated.View
                    key={i}
                    style={[
                        styles.particle,
                        {
                            width: p.size,
                            height: p.size,
                            borderRadius: p.size / 2,
                            backgroundColor: color,
                            left: p.startX,
                            top: p.startY,
                            opacity: p.opacity,
                            transform: [
                                { translateX: p.x },
                                { translateY: p.y },
                                { scale: p.scale },
                            ],
                        },
                    ]}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    particle: {
        position: 'absolute',
    },
});
