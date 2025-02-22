import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Text,
    FlatList,
    Image,
    ScrollView,
} from 'react-native';

// Custom Files
import { openWaetherConfig, WeatherProps } from "../store/OpenWeatherConfig";
import colors from "../constants/colors";

const HourlyForecast: React.FC<WeatherProps> = ({ lat, lon }) => {
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        if (!lat || !lon) {
            setWeather(null);
            setErrorMsg('No location data');
            return;
        }

        const fetchHourlyForecast = async () => {
            setLoading(true);
            setWeather(null);
            setErrorMsg(null);

            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${openWaetherConfig.apiKey}&units=metric`
                );

                const data = await response.json();

                if (!response.ok) {
                    setErrorMsg(data.message || 'Error fetching hourly forecast');
                    return;
                }

                setWeather(data);
            } catch (error) {
                setErrorMsg('Failed to load hourly forecast');
            } finally {
                setLoading(false);
            }
        };

        fetchHourlyForecast();
    }, [lat, lon]);

    if (loading) {
        return (
            <View>
                <ActivityIndicator size="large" color={colors.white} />
            </View>
        );
    }

    if (errorMsg) return <Text>{errorMsg}</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>
                Hourly Forecast
            </Text>

            <FlatList 
                data={weather.list.slice(0, 6)} // Get next 6 hours
                horizontal
                scrollEnabled={true}
                keyExtractor={(item) => item.dt.toString()}
                renderItem={({ item }) => {
                    const time = new Date(item.dt * 1000).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    });

                    return (
                        <View style={styles.forecastItem}>
                            <Text style={styles.time}>{time}</Text>
                            <Image 
                                source={{
                                    uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
                                }}
                                style={styles.icon}
                            />
                            <Text style={styles.temp}>
                                {Math.round(item.main.temp)}°C
                            </Text>
                        </View>
                    );
                }}
            />

        </View>
    );
};

export default HourlyForecast;

const styles = StyleSheet.create({
    container: {
        width: '90%',
        height: 250,
        marginHorizontal: 20,
        padding: 10,
        backgroundColor: colors.white,
        borderRadius: 10,
    },
    header: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.backgroundColor,
        marginBottom: 10,
        marginLeft: 18,
    },
    forecastItem: {
        alignItems: "center",
        justifyContent: 'center',
        padding: 10,
        marginHorizontal: 5,
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: 10,
    },
    time: {
        fontSize: 14,
        color: colors.backgroundColor,
    },
    temp: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.backgroundColor,
    },
    icon: {
        width: 50,
        height: 50,
    },
});