import React, { useEffect, useState } from "react";
import { 
    View, 
    StyleSheet, 
    TouchableWithoutFeedback, 
    Keyboard, 
    Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Location
import * as Location from 'expo-location';

// Custom Files
import Search from "../components/Search";

const MainScreen = () => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);


    useEffect(() => {
        async function getCurrentLocation() {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
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
                    <Text style={styles.paragraph}>
                        {text}
                    </Text>
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