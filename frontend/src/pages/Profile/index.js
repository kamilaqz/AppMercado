import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image, TextInput, StatusBar } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { Platform } from 'react-native';

export default function Profile({ navigation }) {
  const [avatar, setAvatar] = useState(null);
  const [user, setUser] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    loadAvatar();
  }, []);

  const loadAvatar = async () => {
    try {
      const storedAvatar = await AsyncStorage.getItem("avatar");
      if (storedAvatar) {
        setAvatar({ uri: storedAvatar });
      }
    } catch (error) {
      console.error("Erro ao carregar a imagem do AsyncStorage:", error);
    }
  };

  const saveAvatar = async (uri) => {
    try {
      if (uri) {
        await AsyncStorage.setItem("avatar", uri);
      } else {
        await AsyncStorage.removeItem("avatar");
      }
    } catch (error) {
      console.error("Erro ao salvar a imagem no AsyncStorage:", error);
    }
  };
  

  const imagePickerCall = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Precisamos de permissão para acessar a biblioteca de mídia.");
      return;
    }

    const data = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (data.cancelled) {
      return;
    }

    setAvatar(data);
    saveAvatar(data.uri);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userEmail = await AsyncStorage.getItem('userEmail');
  
        if (userEmail) {
          const response = await axios.post('http://localhost:3333/users/profile', {
            email: userEmail,
          });
  
          setUser(response.data);
        } else {
          alert('Email do usuário não encontrado.');
        }
      } catch (error) {
        console.error('Erro ao buscar perfil do usuário:', error);
      }
    };
  
    fetchUserProfile();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#38A69D" barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("InfoBar")}
        >
          <Feather name="arrow-left" size={40} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Perfil</Text>
      </View>
      <Image
        source={{
          uri: avatar
            ? avatar.uri
            : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Missing_avatar.svg/1200px-Missing_avatar.svg.png",
        }}
        style={styles.avatar}
      />
      <TouchableOpacity style={styles.smallButton} onPress={imagePickerCall}>
        <Text style={styles.buttonText}>Escolher imagem</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={user.name || ''}
        onChangeText={(text) => setUser({ ...user, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={user.email || ''}
        onChangeText={(text) => setUser({ ...user, email: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={user.password || ''}
        onChangeText={(text) => setUser({ ...user, password: text })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Platform.OS === "web" ? 50 : StatusBar.currentHeight,
  },
  header: {
    backgroundColor: "#38A69D",
    width: "100%",
    height: Platform.OS === "web" ? 130 : 130 + StatusBar.currentHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "web" ? 0 : StatusBar.currentHeight,
    position: "fixed",
    top: 0,
  },
  backButton: {
    marginRight: 10,
  },
  smallButton: {
    width: 120,
    height: 40,
    borderRadius: 3,
    backgroundColor: "#4A958F",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
  },
  avatarContainer: {
    marginTop: Platform.OS === "web" ? 20 : 0,
    alignItems: "center",
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    resizeMode: "cover",
  },
  input: {
    height: 40,
    width: 300,
    borderColor: "#92D7D1",
    borderWidth: 2,
    marginVertical: 10,
    paddingLeft: 12,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: "right",
    flex: 1,
  },
});