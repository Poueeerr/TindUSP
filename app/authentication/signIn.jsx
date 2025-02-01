import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert, AppState } from 'react-native';
import Colors from "./../../constant/Colors";
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {supabase} from './../../src/service/supabase'

export default function SignIn() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const router = useRouter();

    AppState.addEventListener('change', (state) => {
        if (state === 'active') {
          supabase.auth.startAutoRefresh()
        } else {
          supabase.auth.stopAutoRefresh()
        }
      })

        const handleOAuthLogin = async () => {
              const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
              });
          
              if (error) {
                console.log('Erro ao fazer login com OAuth:', error.message);
                return;
              }
          
              // O usuário foi autenticado com sucesso, você pode redirecioná-lo ou fazer o que for necessário.
              console.log('Usuário autenticado', data);
              router.push('/profile/profile');
        };

    const handleSignIn = async () => {
        setLoading(true)

        if (!email || !password) {
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
            setLoading(false)

            return;
        }
        console.log(email, password)

        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) {
            setLoading(false)
            Alert.alert("Erro ao entrar", error.message);
        } else {
            setLoading(false)
            router.push('/profile/profile')

            Alert.alert("Sucesso!", "Login realizado com sucesso.");
        }
    };

    return (
        <>
        <View style={styles.container}>
            <Image style={styles.image} source={require('./../../assets/images/icon.png')} />
            <Text style={styles.title}>Login</Text>

            <TextInput 
                placeholder='Email' 
                placeholderTextColor="gray" 
                style={styles.textInput} 
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <View style={styles.passwordContainer}>
                <TextInput 
                    placeholder='Senha' 
                    secureTextEntry={!isPasswordVisible}  
                    placeholderTextColor="gray" 
                    style={[styles.textInput, styles.passwordInput]} 
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity 
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)} 
                    style={styles.eyeIcon}
                >
                    <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={24} color="gray" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                <Text style={styles.buttonText}>{loading ? 'Carregando ...' : 'Login'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginTop: 10 }} onPress={() => router.push("/authentication/signUp")}>
                <Text>Não tem uma conta? Cadastre-se!</Text>
            </TouchableOpacity>

              {/* <TouchableOpacity
                            style={styles.touchableLogin}
                            onPress={handleOAuthLogin}
                            accessible={true}
                            accessibilityLabel="Faça login com Google."
                            >
                            <Text style={styles.textLogin}>Login com Google</Text>
                         </TouchableOpacity> */}
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 25,
        paddingTop: 100,
        backgroundColor: Colors.WHITE
    },
    textInput: {
        borderColor: 'gray',
        borderWidth: 1,
        width: "100%",
        padding: 10,
        fontSize: 18,
        marginTop: 20,
        borderRadius: 8,
    },
    image: {
        width: 100,
        height: 100,
        marginTop: 20
    },
    title: {
        fontWeight: 'bold',
        fontSize: 35,
        textAlign: 'center',
        color: Colors.PRIMARY,
        marginTop: 50,
    },
    passwordContainer: {
        position: 'relative',
        width: '100%',
    },
    passwordInput: {
        paddingRight: 40,
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        top: 30,
    },
    button: {
        padding: 15,
        backgroundColor: Colors.PRIMARY,
        width: '100%',
        borderRadius: 15,
        marginTop: 25,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
