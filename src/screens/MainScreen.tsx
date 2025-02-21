import React, { useEffect, useState } from "react";
import { 
    View, 
    StyleSheet, 
    TouchableWithoutFeedback, 
    Keyboard,
    Text,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Constants from 'expo-constants'

// Location
import * as Location from 'expo-location';

// Custom Files
import Search from "../components/Search";

type LocationData = {
    name: string;
};

const openWaetherConfig = {
    // API key cannot be empty
    // That's why we use ! operator on extra
    apiKey: Constants.expoConfig?.extra!.APIKEY,
};

const MainScreen = () => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [locationName, setLocationName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const reverseGeocoding = async (lat: number, lon: number) => {
        try {
            const response = await fetch(
                `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${openWaetherConfig.apiKey}`
            );
            const json: LocationData[] = await response.json();

            if (json.length > 0) {
                // Extracts the city name
                setLocationName(json[0].name);
            } else {
                setLocationName('Unknown location');
            }
        } catch (error) {
            console.log('Error fetching location:', error);
            setLocationName('Error fetching location')
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        async function getCurrentLocation() {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                setLoading(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            
            // Call reverse geocoding once location is obtained
            if (location && location.coords) {
                reverseGeocoding(
                    location.coords.latitude, 
                    location.coords.longitude
                );
            }
        }

        getCurrentLocation();
    }, []);

    let text = 'Waiting...';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    return (
        <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.innerContainer}>
                    <Search />
                        
                    {loading ? (
                        <ActivityIndicator />
                    ) : (
                        <Text style={styles.paragraph}>
                            {
                            errorMsg ? errorMsg : `${locationName}`
                            }
                        </Text>
                    )}
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

export default MainScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },
    paragraph: {
        fontSize: 18,
        textAlign: 'center',
    }
});