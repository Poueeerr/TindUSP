import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import Colors from '@/constant/Colors';
import { supabase } from './../src/service/supabase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AvatarDisplay from './profile/avatarDisplay';
import Swiper from 'react-native-deck-swiper';
import { useRef } from 'react';

interface UserProfile {
  username: string;
  website: string;
  avatar_url: string;
}

export default function Home() {
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const swiperRef = useRef<Swiper<any>>(null);
  const [loading, setLoading] = useState(true);
  
  function handleRefresh() {
    getAllProfiles(); 
    if (swiperRef.current) {
      swiperRef.current.swipeBack();  
    }
  }

  useEffect(() => {
    getAllProfiles();
  }, []);

  async function getAllProfiles() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('username, website, avatar_url');

      if (error) throw error;
      if (data) setUsers(data);
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Todos os Usuários</Text>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      ) : (
        <Swiper
        cards={users}
        renderCard={(user) => (
          <View style={styles.userContainer}>
            <View style={styles.imageContainer}>
              <AvatarDisplay url={user.avatar_url} size={400} />
      
              <View style={styles.buttonsContainer}>
                <TouchableOpacity 
                  style={styles.dislikeButton} 
                  onPress={() => swiperRef.current?.swipeLeft()}
                >
                  <Icon name="close" size={40} color="#ff6b6b" />
                </TouchableOpacity>
      
                <TouchableOpacity 
                  style={styles.likeButton} 
                  onPress={() => swiperRef.current?.swipeRight()}
                >
                  <Icon name="favorite" size={40} color="#4ef85d" />
                </TouchableOpacity>
              </View>
            </View>
      
            <Text style={styles.username}>{user.username}</Text>
            <Text style={styles.website}>{user.website}</Text>
          </View>
        )}
        backgroundColor="transparent"
        cardIndex={0}
        stackSize={3}
        disableBottomSwipe
        disableTopSwipe
        ref={swiperRef}
        onSwipedAll={handleRefresh} 
        onSwipedLeft={(cardIndex) => console.log(`Usuário ${users[cardIndex].username} rejeitado (esquerda)`)}
        onSwipedRight={(cardIndex) => console.log(`Usuário ${users[cardIndex].username} curtido (direita)`)}
      />
      
      )}

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.push('/profile/profile')}>
          <Icon name="home" size={30} color="#bb2e2e" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: Colors.WHITE,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    color: Colors.PRIMARY,
    marginVertical: 20,
  },
  userContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 100,
  },
  imageContainer: {
    position: 'relative', 
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 20, 
    flexDirection: 'row',
    alignSelf: 'center', 
    gap: 30, 
  },
  dislikeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    padding: 15,
    borderRadius: 50,
  },
  likeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    padding: 15,
    borderRadius: 50,
  },
  username: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
  },
  website: {
    fontSize: 20,
    color: 'gray',
  },
  footer: {
    height: 50,
    width: '100%',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#d3d3d3a9",
  },
});
