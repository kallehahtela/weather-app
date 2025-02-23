import React, { useEffect, useState } from "react";
import { 
    View,
    StyleSheet, 
    ActivityIndicator,
    Text
} from "react-native";

// Custom Files & Icons
import { openWeatherConfig } from "../store/OpenWeatherConfig";
import colors from "../constants/colors";
import { EvilIcons } from '@expo/vector-icons';

type ReverseCodingProps = {
    lat?: number | null;
    lon?: number | null;
};

const ReverseCoding: React.FC<ReverseCodingProps> = ({ lat, lon }) => {
    const [locationName, setLocationName] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        if (!lat || !lon) return;

        const reverseGeocoding = async () => {
            try {
                const response = await fetch(
                    `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${openWeatherConfig.apiKey}`
                );
                const json = await response.json();
                if (isMounted) {
                    setLocationName(
                        json.length > 0 ? json[0].name : 
                        'Unknown location'
                    );
                }
            } catch (error) {
                if (isMounted) setErrorMsg('Error fetching location')
            } finally {
                if (isMounted) setLoading(false)
            }
        };

        reverseGeocoding();

        return () => {
            isMounted = false;
        };
    }, [lat, lon]);

    return (
        <View style={styles.container}>                
            {loading ? (
                <ActivityIndicator />
            ) : (
                <View style={styles.locationContainer}>
                    <EvilIcons 
                        name="location"
                        size={34}
                        color={colors.white}
                    />
                    <Text style={styles.paragraph}>
                        {errorMsg ? errorMsg : locationName}
                    </Text>
                </View>
            )}
        </View>
    );
}

export default ReverseCoding;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    locationContainer: {
        width: '70%',
        height: 60,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 5,
        marginRight: 50,
        marginTop: 50,
    },
    paragraph: {
        fontSize: 26,
        fontWeight: '600',
        textAlign: 'center',
        color: colors.white
    },
});
