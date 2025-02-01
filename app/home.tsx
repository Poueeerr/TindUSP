import { StyleSheet, View, Alert, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import Colors from '@/constant/Colors';
import { supabase } from './../src/service/supabase';
import { Session } from '@supabase/supabase-js';

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session?.user) router.push('/authentication/signIn');

        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session?.user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        if (data) {
          setUsername(data.username);
        }
        if(username == null){
            setUsername("user")
        }
      } catch (error) {
        router.push('/authentication/signIn')
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Bem vindo, {loading ? 'Carregando...' : username}!
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/profile/profile')}>
        <Text style={styles.buttonText}>Ir para Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 25,
    paddingTop: 100,
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 35,
    textAlign: 'center',
    color: Colors.PRIMARY,
    marginTop: 20,
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
  },
});
