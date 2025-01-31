import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import Colors from "../../constant/Colors";
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {supabase} from './../../src/service/supabase'

export default function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const router = useRouter();


    const handleSignUp = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert("Erro", "Todos os campos são obrigatórios!");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem!");
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
        } else {
            if (!session) Alert.alert('Please check your inbox for email verification!')  
        }
    };

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require('./../../assets/images/icon.png')} />
            <Text style={styles.title}>Crie sua conta!</Text>

            <TextInput 
                placeholder='Nome Completo' 
                placeholderTextColor="gray" 
                style={styles.textInput} 
                value={name}
                onChangeText={setName}
            />
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
                <Text style={styles.buttonText}>Criar Conta</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{marginTop: 10}} onPress={() => router.push("/authentication/signIn")}>
                <Text>Já tem uma conta? Clique aqui</Text>
            </TouchableOpacity>
           
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
