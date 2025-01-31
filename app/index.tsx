import Colors from "../constant/Colors";
import { Image, Text, View, TouchableOpacity } from "react-native";
import styles from "./style";
import React from "react";
import { useRouter } from "expo-router";
import {supabase} from './../src/service/supabase'
import { useEffect, useState } from "react";
import { Session } from '@supabase/supabase-js'

export default function Index() {
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])
  if(session){
    //router.push('/profile') //ATIVAR DEPOIS PRA VERIFICAR SESSION!!!!!
  }
  return (
    <>
      <View style={{ flex: 1, backgroundColor: Colors.WHITE }}>
        <Text style={styles.textTitle}>Bem-vinde ao TindUSP</Text>
        <Image
          source={require("./../assets/images/landing.png")}
          style={styles.imageLogo}
        />
        <View style={styles.containerDescription}>
          <Text style={styles.TextDescription}>
            A melhor forma de conhecer novas pessoas na Universidade de São Paulo!
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/authentication/signUp")}
            accessible={true}
            accessibilityLabel="Pronto para começar? Clique aqui para se inscrever."
          >
            <Text style={styles.buttonText}>Pronto para começar?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.touchableLogin}
            onPress={() => router.push("/authentication/signIn")}
            accessible={true}
            accessibilityLabel="Já tem uma conta? Clique aqui para entrar."
          >
            <Text style={styles.textLogin}>Já tem uma conta?</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Desenvolvido por Felipe Skubs</Text>
      </View>
    </>
  );
}
