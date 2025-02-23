import React, { useEffect, useState } from "react";
import { 
    View,
    StyleSheet,
    ActivityIndicator,
    Text,
} from 'react-native';

// Custom Files
import { openWeatherConfig, WeatherProps } from '../store/OpenWeatherConfig';
import colors from "../constants/colors";
 
const CurrentWeather: React.FC<WeatherProps> = ({ lat, lon }) => {
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        if (!lat || !lon) {
            setWeather(null);
            setErrorMsg("No location data");
            return;
        }

        const fetchCurrentWeather = async () => {
            setLoading(true);
            setWeather(null);
            setErrorMsg(null);

            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${openWeatherConfig.apiKey}`
                );
                const data = await response.json();

                if (!response.ok) {
                    setErrorMsg(data.message || 'Error fetching weather');
                    return;
                }

                setWeather(data);
            } catch (error) {
                setErrorMsg('Failed to load weather');
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentWeather();
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
            <View style={styles.temp}>
                <Text style={styles.tempValue}>{Math.ceil(weather?.main?.temp)}</Text>
                <Text style={styles.degree}>°C</Text>
            </View>

            <View style={styles.descContainer}>
                <Text style={styles.desc}>
                    {weather?.weather?.[0]?.description || "No description"}
                </Text>
            </View>
        </View>
    );
};

export default CurrentWeather;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 200,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 50,
    },
    temp: {
        flexDirection: 'row',
        alignSelf: 'center',
    },
    tempValue: {
        fontSize: 110,
        fontWeight: 'bold',
        color: colors.white,
    },
    degree: {
        fontSize: 22,
        fontWeight: '500',
        color: colors.white,
        marginTop: 23,
    },
    descContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    desc: {
        fontSize: 17,
        color: colors.white,
        textAlign: 'center',
    },
});
