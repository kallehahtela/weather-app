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
        <View style={styles.outerContainer}>
            {/* Temperature and short text for curr weather */}
            <View style={styles.innerContainer}>
                <View style={styles.temp}>
                    <Text style={styles.tempValue}>{Math.round(weather?.main?.temp)}</Text>
                    <Text style={styles.degree}>°C</Text>
                </View>

                <View style={styles.descContainer}>
                    <Text style={styles.desc}>
                        {weather?.weather?.[0]?.description || "No description"}
                    </Text>
                </View>
            </View>

            {/* Other Details */}
            <View style={styles.detailContainer}>
                <Text style={styles.detailText}>Feels like: {Math.round(weather?.main?.feels_like)}°C</Text>
                <Text style={styles.detailText}>Humidity: {weather?.main?.humidity} %</Text>
                <Text style={styles.detailText}>Wind Speed: {weather?.wind?.speed} m/s</Text>
                <Text style={styles.detailText}>Sea Level: {weather.main.sea_level} m</Text>
            </View>
        </View>
    );
};

export default CurrentWeather;

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    innerContainer: {
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
        fontSize: 18,
        color: colors.white,
        textAlign: 'center',
    },
    detailContainer: {
        flex: 1,
        flexDirection: 'column',
        marginHorizontal: 15,
    },
    detailText: {
        color: colors.white,
        fontSize: 18,
        marginBottom: 4,
    },
});
