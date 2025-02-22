import React, { useState } from "react";
import { 
    View, 
    TouchableOpacity, 
    StyleSheet, 
    TextInput,
} from "react-native";

// Icons
import { Feather } from '@expo/vector-icons';
import colors from "../constants/colors";

const Search = () => {
    const [visible, setVisible] = useState(false);

    return (
        <View style={styles.container}>
            {visible && (
                <TextInput 
                    style={styles.input}
                    placeholder="Search here..."
                    placeholderTextColor={colors.white}
                />
            )}

            <TouchableOpacity 
                style={styles.btnContainer}
                onPress={() => setVisible(prev => !prev)}
            >
                <Feather 
                    name='search'
                    size={24}
                    color={colors.white}
                />
            </TouchableOpacity>
        </View>
    );
}

export default Search;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '80%',
    },
    input :{
        flex: 1,
        height: 40,
        borderWidth: 2,
        borderColor: colors.white,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    btnContainer: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: colors.white,
        borderWidth: 2,
        borderRadius: 25,
        marginLeft: 10,
    },
});