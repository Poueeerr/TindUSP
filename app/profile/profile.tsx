import { useState, useEffect } from 'react';
import { supabase } from '../../src/service/supabase';
import { useRouter } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';
import Account from './Account'; 
import { Session } from '@supabase/supabase-js';
import Colors from '@/constant/Colors';

export default function Profile() {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/authentication/signIn'); // Redireciona para login se não houver sessão
      }
      setSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        router.push('/authentication/signIn'); // Redireciona para login se não houver sessão
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (!session) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={{flex: 1, backgroundColor: Colors.WHITE}}>
      <Account session={session} key={session.user.id} />
    </View>
  );
}
