import React, { useEffect, useState } from "react";
import { 
    View, 
    StyleSheet, 
    TouchableWithoutFeedback, 
    Keyboard,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from 'expo-location';

// Custom Components
import Search from "../components/Search";
import CurrentWeather from "../components/CurrentWeather";
import ReverseCoding from "../components/ReverseCoding";

const MainScreen = () => {
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);

    useEffect(() => {
        const getCurrentLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                setLoading(false);
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc);
            setLoading(false);
        };

        getCurrentLocation();
    }, []);

    return (
        <TouchableWithoutFeedback 
            onPress={Keyboard.dismiss} 
            accessible={false}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.innerContainer}>
                    <Search />
                    
                    {loading ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <>
                            <ReverseCoding 
                                lat={location?.coords.latitude} 
                                lon={location?.coords.longitude} 
                            />
                            <View style={styles.currWeatherCard}>
                                {location?.coords && (
                                    <CurrentWeather 
                                        lat={location.coords.latitude}
                                        lon={location.coords.longitude}
                                    />
                                )}
                            </View>
                        </>
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
        position: 'relative',
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },
    currWeatherCard: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        padding: 20,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 15,
        height: 200,
    }
});
