import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'पृष्ठ भेटिएन' }} />
            <View style={styles.container}>
                <Text style={styles.title}>यो पृष्ठ अवस्थित छैन।</Text>
                <Link href="/" style={styles.link}>
                    <Text style={styles.linkText}>गृहपृष्ठमा जानुहोस्</Text>
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
