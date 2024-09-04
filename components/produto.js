import { Pressable, Text, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export function Produto({ data, onDelete, selected, onPress }) {
    return (
        <Pressable
            style={[styles.container, selected && styles.selected]} // Adiciona a borda se selecionado
            onPress={onPress} // Adiciona função de clique
        >
            <View style={styles.quantidadeContainer}>
                <Text style={styles.quantidade}>
                    {data.quantidade}
                </Text>
            </View>
            <Text style={styles.text}>
                {data.nome}
            </Text>
            <MaterialIcons name="delete" size={24} color="#192918" onPress={onDelete} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 22,
        backgroundColor: "#CCDDCB",
        padding: 15,
        paddingRight: 20,
        width: 330,
        alignSelf: 'center',
        borderRadius: 25,
        gap: 12,
        flexDirection: "row",
        alignItems: "center",
    },
    selected: {
        borderWidth: 2,
        borderColor: '#25AD19', // Cor da borda quando selecionado
    },
    text: {
        fontFamily: 'Poppins-Regular',
        flex: 1,
    },
    quantidadeContainer: {
        backgroundColor: '#AFC5AA', // Background apenas da quantidade
        borderRadius: 12,
        paddingLeft: 17,
        paddingRight: 17,
        paddingTop: 10,
        paddingBottom: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    quantidade: {
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        color: '#000', // Cor do texto da quantidade
    },
});
