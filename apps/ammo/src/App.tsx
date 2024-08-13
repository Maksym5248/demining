import React from 'react';

import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Colors, DebugInstructions, Header, LearnMoreLinks, ReloadInstructions } from 'react-native/Libraries/NewAppScreen';

import { Section } from './Section';
import { Theme } from './styles';
import { ThemeProvider } from './styles/theme';

export function App(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
        <ThemeProvider theme={Theme}>
            <SafeAreaView style={backgroundStyle}>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={backgroundStyle.backgroundColor} />
                <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
                    <Header />
                    <View
                        style={{
                            backgroundColor: isDarkMode ? Colors.black : Colors.white,
                        }}>
                        <Section title="Step One">
                            <Text style={styles.highlight}>App.tsx</Text>
                        </Section>
                        <Section title="See Your Changes">
                            <ReloadInstructions />
                        </Section>
                        <Section title="Debug">
                            <DebugInstructions />
                        </Section>
                        <LearnMoreLinks />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    highlight: {
        fontWeight: '700',
    },
});
