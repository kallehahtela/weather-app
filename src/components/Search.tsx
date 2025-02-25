import React, { useEffect, useState } from "react";
import { 
    View, 
    TouchableOpacity, 
    StyleSheet, 
    TextInput,
    ActivityIndicator,
    Text,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView
} from "react-native";

// Icons & Custom Files
import { Feather } from '@expo/vector-icons';
import colors from "../constants/colors";
import { openWeatherConfig } from '../store/OpenWeatherConfig';

const Search: React.FC = () => {
    const [text, setText] = useState<string | null>(null);
    const [results, setResults] = useState<any[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [fetching, setFetching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // Fetch location data from OpenWeather API
    const directGeocoding = async () => {
        if (!text) return; // Prevent calling API with empty input

        setFetching(true);
        try {
            const response = await fetch(
                `http://api.openweathermap.org/geo/1.0/direct?q=${text}&limit=5&appid=${openWeatherConfig.apiKey}`
            );
            const json = await response.json();
            setResults(json); // Store results in state
            setErrorMsg(null);
            setShowResults(true); // Show results
        } catch (error) {
            setErrorMsg('Error fetching city data');
            setResults([]);
        } finally {
            setFetching(false);
        }
    };

    // Call API after user stops typing (Debouncing)
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (text) directGeocoding();
        }, 500); // Delay the API call by 500ms

        return () => clearTimeout(delayDebounceFn); // Cleanup function
    }, [text]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"} 
                style={styles.container}
            >
                {/* Search Bar */}
                <View style={styles.searchBar}>
                    <Feather 
                        name='search'
                        size={24}
                        color={colors.backgroundColor}
                        style={styles.searchIcon}
                    />
                    <TextInput 
                        style={styles.input}
                        placeholder='Search for a city...'
                        placeholderTextColor={colors.backgroundColor}
                        onChangeText={setText}
                        value={text || ''}
                        onFocus={() => setShowResults(true)}
                        onBlur={() => setTimeout(() => setShowResults(false), 200)} // Hide results when losing focus
                    />
                    {fetching && 
                        <ActivityIndicator 
                            size='small' 
                            color={colors.backgroundColor} 
                            style={styles.loadingIndicator} 
                        />}
                </View>

                {/* Search Results Overlay */}
                {showResults && (
                    <View style={styles.resultsContainer}>
                        {errorMsg && 
                        <Text style={styles.error}>
                            {errorMsg}
                        </Text>}
                        <FlatList
                            data={results}
                            keyExtractor={(item, index) => 
                                index.toString()
                            }
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    style={styles.resultItem} 
                                    onPress={() => {
                                        console.log(
                                            "Selected:", item.name
                                        );
                                        setShowResults(false);
                                        setText(item.name); // Set selected city
                                    }}
                                >
                                    <Text style={styles.resultText}>
                                        {item.name}, {item.country}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Search;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.white,
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 40,
        width: '100%',
        backgroundColor: colors.white,
        zIndex: 2,
    },
    searchIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: colors.backgroundColor,
    },
    loadingIndicator: {
        marginLeft: 10,
    },
    resultsContainer: {
        position: 'absolute',
        top: 50,
        width: '100%',
        backgroundColor: '#cacaca',
        borderRadius: 10,
        paddingVertical: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    resultItem: {
        padding: 10,
        marginHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.white,
    },
    resultText: {
        color: colors.white,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 5,
    },
});
