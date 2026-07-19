import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useApp } from '@/contexts/AppContext';

export default function NotFoundScreen() {
    const { strings } = useApp();

    return (
        <>
            <Stack.Screen options={{ title: strings.notFoundTitle }} />
            <View style={styles.container}>
                <Text style={styles.title}>{strings.notFoundBody}</Text>
                <Link href="/" style={styles.link}>
                    <Text style={styles.linkText}>{strings.goHome}</Text>
                </Link>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#FAFAF7',
    },
    title: {
        fontSize: 20,
        fontWeight: '700' as const,
        color: '#1A1A2E',
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    linkText: {
        fontSize: 14,
        color: '#E8533F',
    },
});
