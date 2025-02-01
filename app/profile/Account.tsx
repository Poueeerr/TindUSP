import React, { useState, useEffect } from 'react'
import { supabase } from '../../src/service/supabase'
import { StyleSheet, View, Alert, Text, TextInput, TouchableOpacity } from 'react-native'
import { Session } from '@supabase/supabase-js'
import Colors from '@/constant/Colors'
import Avatar from './avatar'
import { router } from 'expo-router'
import Icon from 'react-native-vector-icons/MaterialIcons';


export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [website, setWebsite] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string
    website: string
    avatar_url: string
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      Alert.alert("Alterações Salvas")
      setLoading(false)
    }
  }

  return (
    <>
     <TouchableOpacity 
        style={styles.iconContainer} 
        onPress={() => router.push('/home')}
      >
        <Icon name="home" size={30} color="#fff" style={styles.icon} />
      </TouchableOpacity>
    <View style={styles.container}>
       
      <Text style={styles.title}>Perfil</Text>
      <Avatar
        size={150}
        url={avatarUrl}
        onUpload={(url) => {
          const updatedUrl = url ?? '' 
          setAvatarUrl(updatedUrl)
          updateProfile({ username, website, avatar_url: updatedUrl })
      }}
      />

      <TextInput    
        style={[styles.textInput, { color: 'gray' }]} 
        value={session?.user?.email} 
        editable={false} 
      />
      <TextInput 
        style={styles.textInput} 
        placeholder='Username' 
        placeholderTextColor="gray"
        value={username || ''} 
        onChangeText={setUsername} 
      />
      <TextInput 
        style={styles.textInput} 
        placeholder='Instagram @' 
        placeholderTextColor="gray"
        value={website || ''} 
        onChangeText={setWebsite} 
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => updateProfile({ username, website, avatar_url: avatarUrl })}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Carregando ...' : 'Atualizar'}</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => supabase.auth.signOut()}
      >
        <Text style={styles.buttonText}>LogOut</Text>
        
      </TouchableOpacity>
    </View>
    </>

  );
  
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 25,
    paddingTop: 10,
    backgroundColor: Colors.WHITE,
  },
  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    padding: 10,
    fontSize: 18,
    marginTop: 20,
    borderRadius: 8,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 20,
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
  },icon: {
    color: Colors.PRIMARY,
  },iconContainer: {
    padding: 20
  },
});
