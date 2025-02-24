import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Text,
    Image,
    ScrollView,
} from 'react-native';

// Custom Files
import { openWeatherConfig, WeatherProps } from "../store/OpenWeatherConfig";
import colors from "../constants/colors";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";

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
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${openWeatherConfig.apiKey}&units=metric`
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
        <GestureHandlerRootView style={{ flex: 1}}>
            <View style={styles.container}>
                <Text style={styles.header}>
                    3-Hourly Forecast
                </Text>

                <FlatList 
                        data={weather.list.slice(0, 6) || []}
                        horizontal={true}
                        nestedScrollEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.dt.toString()}
                        snapToAlignment="start"
                        decelerationRate="fast"
                        snapToInterval={100}
                        contentContainerStyle={{ paddingHorizontal: 10 }}
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
        </GestureHandlerRootView>
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
    forecastItem: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        marginHorizontal: 8,
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: 12,
    },
    header: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.backgroundColor,
        marginBottom: 10,
        marginLeft: 18,
    },
    icon: {
        width: 70,
        height: 70,
        marginBottom: 5,
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
});