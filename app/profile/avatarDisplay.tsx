import { useState, useEffect } from 'react'
import { supabase } from '../../src/service/supabase'
import { StyleSheet, View, Alert, Image, TouchableOpacity, Text } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from './../../constant/Colors'

interface Props {
  size: number
  url: string | null
}

export default function AvatarDisplay({ url, size = 150 }: Props) {
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const avatarSize = { height: size, width: size }

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)

      if (error) {
        throw error
      }

      const fr = new FileReader()
      fr.readAsDataURL(data)
      fr.onload = () => {
        setAvatarUrl(fr.result as string)
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error downloading image: ', error.message)
      }
    }
  }
  

  return (
<View style={styles.container}>
  {avatarUrl ? (
    <View style={[avatarSize, styles.avatar, styles.imageContainer]}>
      <Image
        source={{ uri: avatarUrl }}
        accessibilityLabel="Avatar"
        style={[avatarSize, styles.avatar, styles.image]}
      />
    </View>
  ) : (
    <Image style={{width: 150, height: 150}} source={require('./../../assets/images/icon.png')}></Image>
  )}
</View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative', 
  },
  avatar: {
    borderRadius: 5,
    overflow: 'hidden',
    maxWidth: '100%',
  },
  image: {
    objectFit: 'cover',
    paddingTop: 0,
  },
  noImage: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgb(200, 200, 200)',
    borderRadius: 5,
  },
  iconContainer: {
    position: 'absolute', 
    left: 3,
    bottom: 3, 
    
  },
  icon: {
    color: '#fff',
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
