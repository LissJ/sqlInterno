import { View, StyleSheet, TextInput, Alert, FlatList, Image, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { usarBD } from './hooks/usarBD';
import { Produto } from './components/produto';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync(); // Mantém a tela SplashScreen

export function Index() {
    const [fontsLoaded] = useFonts({
        'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
        'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
        'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
        'Poppins-ExtraBold': require('./assets/fonts/Poppins-ExtraBold.ttf'),
        'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'),
        'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
    });

    useEffect(() => {
        async function prepare() {
            try {
                await new Promise(resolve => setTimeout(resolve, 5000));
                await SplashScreen.hideAsync();
            } catch (erro) {
                console.error(erro);
            }
        }
        prepare();
    }, []);

    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [pesquisa, setPesquisa] = useState('');
    const [produtos, setProdutos] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    const produtosBD = usarBD();

    const formatText = (text) => {
        // Converte a primeira letra para maiúscula
        const formattedText = text.charAt(0).toUpperCase() + text.slice(1);

        // Limita o comprimento do texto a 12 caracteres
        return formattedText.length > 18 ? formattedText.slice(0, 18) + '...' : formattedText;
    };

    async function create() {
        if (!nome || !quantidade) {
            return Alert.alert('Grocery', 'É necessário adicionar valores nos campos de nome e quantidade!');
        }

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

    async function update() {
        if (!nome || !quantidade) {
            return Alert.alert('Grocery', 'É necessário adicionar valores nos campos de Nome e Quantidade!');
        }

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
            setSelectedId(null);
            listar();
        } catch (error) {
            console.log(error);
        }
    }

    async function listar() {
        try {
            const captura = await produtosBD.read(pesquisa);
            setProdutos(captura);
        } catch (error) {
            console.log(error);
        }
    }

    async function remove(id) {
        Alert.alert(
            'Confirmação',
            'Você tem certeza que deseja deletar este item?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Deletar',
                    onPress: async () => {
                        try {
                            await produtosBD.remove(id);
                            setId('');
                            setNome('');
                            setQuantidade('');
                            setSelectedId(null);
                            listar();
                        } catch (error) {
                            console.log(error);
                        }
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    }

    const handleSelect = (item) => {
        setId(item.id);
        setNome(item.nome);
        setQuantidade(item.quantidade.toString());
        setSelectedId(item.id);
    };

    useEffect(() => {
        listar();
    }, [pesquisa]);

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.headerGrocery}>
                    <Image style={styles.iconGrocery} source={require('./assets/groceryicon.png')}></Image>
                    <Text style={styles.tituloGrocery}>
                        Grocery
                    </Text>
                </View>
                <View style={styles.bemVindo}>
                    <Text style={styles.olaUsuario}>
                        <Text style={styles.ola}>
                            Olá
                        </Text>
                        <Text style={styles.usuario}>
                            , usuário!
                        </Text>
                    </Text>
                    <Text style={styles.adicione}>
                        Adicione seus itens aqui.
                    </Text>
                </View>

                <View style={styles.mainBranco}>
                    <View style={styles.adicionar}>
                        <Text style={styles.addItem}>
                            + Adicionar item
                        </Text>
                    </View>

                    <TextInput
                        style={[styles.input, styles.textInputFont]}
                        placeholder="Nome"
                        onChangeText={setNome}
                        placeholderTextColor={'#fff'}
                        value={nome}
                    />
                    <TextInput
                        style={[styles.input, styles.textInputFont]}
                        placeholder="Quantidade"
                        onChangeText={setQuantidade}
                        value={quantidade}
                        placeholderTextColor={'#fff'}
                        keyboardType="numeric"
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.limparButton} onPress={() => { setId(''); setNome(''); setQuantidade(''); setSelectedId(null); }}>
                            <Text style={styles.buttonText}>Limpar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.salvarButton} onPress={id ? update : create}>
                            <Text style={styles.buttonText}>{id ? "Atualizar" : "Salvar"}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.linha}></View>
                    <TextInput
                        style={[styles.pesquisaInput, styles.textInputFontPesquisa]}
                        placeholder="Pesquisar..."
                        onChangeText={setPesquisa}
                    />
                    <FlatList
                        contentContainerStyle={styles.listContent}
                        data={produtos}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            <Produto
                                data={{
                                    ...item,
                                    nome: formatText(item.nome) // Aplica a formatação ao nome do produto
                                }}
                                onDelete={() => remove(item.id)}
                                selected={item.id === selectedId}
                                onPress={() => handleSelect(item)}
                            />
                        )}
                        scrollEnabled={false}  // Desativa o scroll
                    />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#587B55',
    },
    headerGrocery: {
        marginTop: '13%',
        backgroundColor: '#2E4828',
        width: '60%',
        padding: 15,
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
    },
    tituloGrocery: {
        marginLeft: '7%',
        fontFamily: 'Poppins-Bold',
        fontSize: 18,
        color: '#fff',
    },
    iconGrocery: {
        marginLeft: '25%',
        width: 23,
        height: 29.04,
    },
    bemVindo: {
        padding: 20,
    },
    olaUsuario: {
        marginTop: '3%',
        marginLeft: 45,
        fontFamily: 'Poppins-Regular',
        color: '#fff',
    },
    ola: {
        fontFamily: 'Poppins-Regular',
        fontSize: 19,
    },
    usuario: {
        fontFamily: 'Poppins-Bold',
        color: '#fff',
        fontSize: 19,
    },
    adicione: {
        marginLeft: 45,
        fontFamily: 'Poppins-Light',
        fontSize: 16,
        color: '#fff',
        marginBottom: '3%',
    },
    mainBranco: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 65,
        flex: 1,
    },
    adicionar: {
        flexDirection: 'row',
        marginTop: '5%',
        marginBottom: '5%',
        marginLeft: 45,
    },
    addItem: {
        fontFamily: 'Poppins-Medium',
        fontSize: 17,
    },
    input: {
        height: 54,
        borderWidth: 1,
        borderRadius: 37,
        paddingHorizontal: 16,
        marginBottom: 15,
        width: 330,
        alignSelf: 'center',
        backgroundColor: '#3F5F3D',
        borderColor: '#3F5F3D',
    },
    textInputFont: {
        color: '#fff',
        paddingLeft: 30,
        fontFamily: 'Poppins-Regular', // Adiciona a fonte Poppins aos TextInput
    },
    textInputFontPesquisa: {
        color: '#000',
        paddingLeft: 30,
        fontFamily: 'Poppins-Regular', // Adiciona a fonte Poppins aos TextInput
    },
    buttonContainer: {
        marginRight: '15%',
        marginLeft: '15%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    limparButton: {
        backgroundColor: '#457E40',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 35,
        width: 163,
        height: 55,
    },
    salvarButton: {
        marginLeft: '1%',
        backgroundColor: '#0B3A07',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 35,
        width: 163,
        height: 55,
    },
    linha: {
        height: 1.1,
        borderRadius: 15,
        marginTop: 8,
        marginBottom: 20,
        width: 330,
        alignSelf: 'center',
        backgroundColor: '#0B3A07',
    },
    buttonText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 15,
        color: '#fff',
        textAlign: 'center',
    },
    pesquisaInput: {
        height: 54,
        borderWidth: 1,
        borderRadius: 24,
        borderColor: "#D9E2E4",
        paddingHorizontal: 16,
        width: 330,
        alignSelf: 'center',
        // marginBottom: -10,
        backgroundColor: '#E4F1E3',
    },
    listContent: {
        // marginTop: 8,
        gap: 5,
        marginBottom: '10%',
    },
});