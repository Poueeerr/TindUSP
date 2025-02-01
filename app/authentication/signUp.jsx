import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert, AppState } from 'react-native';
import Colors from "../../constant/Colors";
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {supabase} from './../../src/service/supabase'

export default function SignUp() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
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

    const handleSignUp = async () => {
        setLoading(true)
        if (!email || !password || !confirmPassword) {
            Alert.alert("Erro", "Todos os campos são obrigatórios!");
            setLoading(false)

            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem!");
            setLoading(false)

            return;
        }

        const {
            data: { session },
            error,
          } = await supabase.auth.signUp({
            email: email,
            password: password,    
          })

        if (error) {
            Alert.alert("Erro ao cadastrar", error.message);
            setLoading(false)

        } else {
            setLoading(false)
            router.push('/authentication/signIn')
        }

    };

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require('./../../assets/images/icon.png')} />
            <Text style={styles.title}>Crie sua conta!</Text>

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
                    onPress={() => (setIsPasswordVisible(!isPasswordVisible))} 
                    style={styles.eyeIcon}
                >
                    <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={24} color="gray" />
                </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
                <TextInput 
                    placeholder='Confirme sua senha' 
                    secureTextEntry={!isConfirmPasswordVisible}  
                    placeholderTextColor="gray" 
                    style={[styles.textInput, styles.passwordInput]} 
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                <TouchableOpacity 
                    onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} 
                    style={styles.eyeIcon}
                >
                    <Ionicons name={isConfirmPasswordVisible ? "eye-off" : "eye"} size={24} color="gray" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>{loading ? 'Carregando ...' : 'Criar Conta'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={{marginTop: 10}} onPress={() => router.push("/authentication/signIn")}>
                <Text>Já tem uma conta? Clique aqui</Text>
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
        fontFamily: 'outfit-bold',
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
