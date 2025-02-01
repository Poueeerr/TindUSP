import { useState, useEffect } from 'react'
import { supabase } from '../../src/service/supabase'
import { StyleSheet, View, Alert, Image, TouchableOpacity, Text } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from './../../constant/Colors'

interface Props {
  size: number
  url: string | null
  onUpload: (filePath: string) => void
}

export default function Avatar({ url, size = 150, onUpload }: Props) {
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

  async function uploadAvatar() {
    try {
      setUploading(true)

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        allowsEditing: true,
        quality: 1,
        exif: false,
      })

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log('User cancelled image picker.')
        return
      }

      const image = result.assets[0]
      console.log('Got image', image)

      if (!image.uri) {
        throw new Error('No image uri!')
      }

      const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer())

      const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg'
      const path = `${Date.now()}.${fileExt}`
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? 'image/jpeg',
        })

      if (uploadError) {
        throw uploadError
      }

      onUpload(data.path)
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      } else {
        throw error
      }
    } finally {
      setUploading(false)
    }
  }
  const remove = async () => {
    try {
      if (url) {
        const { error } = await supabase.storage.from('avatars').remove([url])
        if (error) throw error
      }
      setAvatarUrl(null)
      onUpload('') 
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Erro ao remover a foto', error.message)
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
      <TouchableOpacity 
        style={styles.iconContainer} 
        onPress={remove} 
        disabled={uploading}
      > 

        <Icon name="delete" size={30} color="#fff" style={styles.icon} />
      </TouchableOpacity>
    </View>
  ) : (
    <Image style={{width: 150, height: 150}} source={require('./../../assets/images/icon.png')}></Image>
  )}
  <TouchableOpacity style={styles.button} onPress={uploadAvatar} disabled={uploading}>
    <Text style={styles.buttonText}>{uploading ? 'Carregando ...' : 'Carregar Foto'}</Text>
  </TouchableOpacity>
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
