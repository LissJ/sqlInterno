// produto.js
import { Pressable, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export function Produto({ data, onDelete, selected, onPress }) {
    return (
        <Pressable
            style={[styles.container, selected && styles.selected]} // Adiciona a borda se selecionado
            onPress={onPress} // Adiciona função de clique
        >
            <Text style={styles.text}>
                {data.quantidade} - {data.nome}
            </Text>
            <MaterialIcons name="delete" size={24} color="red" onPress={onDelete} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#CECECE",
        padding: 24,
        borderRadius: 5,
        gap: 12,
        flexDirection: "row",
    },
    selected: {
        borderWidth: 2,
        borderColor: "blue", // Cor da borda quando selecionado
    },
    text: {
        flex: 1,
    },
});
