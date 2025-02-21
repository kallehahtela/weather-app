import React, { useState } from "react";
import { 
    View, 
    TouchableOpacity, 
    StyleSheet, 
    TextInput,
} from "react-native";

// Icons
import { Feather } from '@expo/vector-icons';

const Search = () => {
    const [visible, setVisible] = useState(false);

    return (
        <View style={styles.container}>
            {visible && (
                <TextInput 
                    style={styles.input}
                    placeholder="Search here..."
                />
            )}

            <TouchableOpacity 
                style={styles.btnContainer}
                onPress={() => setVisible(prev => !prev)}
            >
                <Feather 
                    name='search'
                    size={24}
                    color={'#000'}
                />
            </TouchableOpacity>
        </View>
    );
}

export default Search;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 20,
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 250,
        margin: 20,
    },
    input :{
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    btnContainer: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 25,
        marginLeft: 10,
    },
});