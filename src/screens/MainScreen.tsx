import React, { useEffect, useState } from "react";
import { 
    View, 
    StyleSheet, 
    TouchableWithoutFeedback, 
    Keyboard,
    ActivityIndicator,
    ViewBase,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from 'expo-location';

// Custom Components
import Search from "../components/Search";
import CurrentWeather from "../components/CurrentWeather";
import ReverseCoding from "../components/ReverseCoding";
import colors from "../constants/colors";
import HourlyForecast from "../components/HourlyForecast";

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
                    <View style={styles.searchContainer}>
                        <Search />
                    </View>
                    
                    {loading ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <>
                            <View>
                                <ReverseCoding 
                                    lat={location?.coords.latitude} 
                                    lon={location?.coords.longitude} 
                                />
                            </View>

                            <View style={styles.currWeatherContainer}>
                                {location?.coords && (
                                    <CurrentWeather 
                                        lat={location.coords.latitude}
                                        lon={location.coords.longitude}
                                    />
                                )}
                            </View>

                            <View style={styles.forecastContainer}>
                                {location?.coords && (
                                    <HourlyForecast 
                                        lat={location.coords.latitude}
                                        lon={location.coords.longitude}
                                    />
                                )}
                            </View>
                        </>
                    )}
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

export default MainScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
    },
    searchContainer: {
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
    },
    currWeatherContainer: {
        height: 300,
         marginHorizontal: 10,
    },
    forecastContainer: {
        flex: 1,
        minHeight: 250,
        paddingBottom: 10,
    },
});
