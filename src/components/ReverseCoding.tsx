import React, { useEffect, useState } from "react";
import { 
    View,
    StyleSheet, 
    ActivityIndicator,
    Text
} from "react-native";

// Custom Files
import { openWaetherConfig } from "../store/OpenWeatherConfig";

type ReverseCodingProps = {
    lat?: number | null;
    lon?: number | null;
};

const ReverseCoding: React.FC<ReverseCodingProps> = ({ lat, lon }) => {
    const [locationName, setLocationName] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!lat || !lon) return;

        const reverseGeocoding = async () => {
            try {
                const response = await fetch(
                    `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${openWaetherConfig.apiKey}`
                );
                const json = await response.json();

                if (json.length > 0) {
                    setLocationName(json[0].name);
                } else {
                    setLocationName('Unknown location');
                }
            } catch (error) {
                setErrorMsg('Error fetching location');
            } finally {
                setLoading(false);
            }
        };

        reverseGeocoding();
    }, [lat, lon]);

    return (
        <View style={styles.innerContainer}>                
            {loading ? (
                <ActivityIndicator />
            ) : (
                <Text style={styles.paragraph}>
                    {errorMsg ? errorMsg : locationName}
                </Text>
            )}
        </View>
    );
}

export default ReverseCoding;

const styles = StyleSheet.create({
    innerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    paragraph: {
        fontSize: 26,
        fontWeight: '600',
        textAlign: 'center',
    },
});
