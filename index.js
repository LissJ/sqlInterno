// index.js
import { View, Button, StyleSheet, TextInput, Alert, FlatList, TouchableOpacity, Image, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { usarBD } from './hooks/usarBD';
import { Produto } from './components/produto';

export function Index() {
    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [pesquisa, setPesquisa] = useState('');
    const [produtos, setProdutos] = useState([]);
    const [selectedId, setSelectedId] = useState(null); // Novo estado para controlar a seleção

    const produtosBD = usarBD();

    // Função para criar um novo produto
    async function create() {
        if (isNaN(quantidade)) {
            return Alert.alert('Quantidade', 'A quantidade precisa ser um número!');
        }
        try {
            const item = await produtosBD.create({
                nome,
                quantidade: Number(quantidade),
            });
            Alert.alert('Produto cadastrado com o ID: ' + item.idProduto);
            setId(item.idProduto);
            listar();
        } catch (error) {
            console.log(error);
        }
    }

    // Função para atualizar um produto existente
    async function update() {
        if (isNaN(quantidade)) {
            return Alert.alert('Quantidade', 'A quantidade precisa ser um número!');
        }
        try {
            await produtosBD.update(id, {
                nome,
                quantidade: Number(quantidade),
            });
            Alert.alert('Produto atualizado com o ID: ' + id);
            setId('');
            setNome('');
            setQuantidade('');
            setSelectedId(null); // Limpar seleção
            listar();
        } catch (error) {
            console.log(error);
        }
    }

    // Função para listar produtos do banco de dados
    async function listar() {
        try {
            const captura = await produtosBD.read(pesquisa);
            setProdutos(captura);
        } catch (error) {
            console.log(error);
        }
    }

    // Função para remover um produto
    async function remove(id) {
        try {
            await produtosBD.remove(id);
            setId('');
            setNome('');
            setQuantidade('');
            setSelectedId(null); // Limpar seleção
            await listar();
        } catch (error) {
            console.log(error);
        }
    }

    // Função para selecionar um item e preencher os campos de texto
    const handleSelect = (item) => {
        setId(item.id);
        setNome(item.nome);
        setQuantidade(item.quantidade.toString());
        setSelectedId(item.id); // Atualiza o estado de seleção
    };

    useEffect(() => {
        listar();
    }, [pesquisa]);

    return (
        <View style={styles.container}>
            <View style={styles.headerGrocery}>
                <Image style={styles.iconGrocery} source={require('./assets/groceryicon.png')}></Image>
                <Text style={styles.tituloGrocery}>
                    Grocery
                </Text>
            </View>
            <TextInput
                style={styles.texto}
                placeholder="Nome"
                onChangeText={setNome}
                value={nome}
            />
            <TextInput
                style={styles.texto}
                placeholder="Quantidade"
                onChangeText={setQuantidade}
                value={quantidade}
                keyboardType="numeric"
            />
            <Button title={id ? "Atualizar" : "Salvar"} onPress={id ? update : create} />
            <Button title="Limpar" onPress={() => { setId(''); setNome(''); setQuantidade(''); setSelectedId(null); }} />
            <TextInput
                style={styles.texto}
                placeholder="Pesquisar"
                onChangeText={setPesquisa}
            />
            <FlatList
                contentContainerStyle={styles.listContent}
                data={produtos}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <Produto
                        data={item}
                        onDelete={() => remove(item.id)}
                        selected={item.id === selectedId} // Passa o estado de seleção
                        onPress={() => handleSelect(item)} // Adiciona função de seleção
                    />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#587B55',
        justifyContent: 'center',
        padding: 32,
        gap: 16,
    },
    headerGrocery: {
        backgroundColor: '#2E4828',
        width: '50%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconGrocery: {
        width: 42,
        height: 53,
    },
    texto: {
        height: 54,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: "#999",
        paddingHorizontal: 16,
    },
    listContent: {
        gap: 16,
    },
});
