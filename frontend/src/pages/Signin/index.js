import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import storageService from '../../services/storageService'


export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!isEmailValid(email)) {
      alert('Por favor, insira um endereço de email válido.');
      return;
    }

    try {
      const apiUrlVerificacao = `http://localhost:3333/users/verificacao/${email}`;
      const responseVerificacao = await axios.get(apiUrlVerificacao);
      
      if (responseVerificacao.data.existe) {
        const apiUrlLogin = 'http://localhost:3333/users/login';
        const response = await axios.post(apiUrlLogin, {
          email,
          password
        });

        if (response.status === 200) {
          storageService.save('userData', response.data.userData)
          navigation.navigate('Home');
        } else {
          alert("Erro ao fazer login");
        }
      } else {
        alert("Usuário não cadastrado");
      }

    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("E-mail ou senha incorretos");
      } else if (error.response && error.response.status === 404) {
        alert("Usuário não cadastrado");
      } else {
        alert("Erro ao fazer login");
      }
      console.error(error);
    };
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const navigateToDevs = () => {
    navigation.navigate('Devs'); };


  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setEmail('');
      setPassword('');
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Animatable.View animation='fadeInLeft' delay={500} style={styles.containerHeader}>
        <Text style={styles.message}>Bem-Vindo(a) ao UniMercado</Text>
      </Animatable.View>

      <Animatable.View animation='fadeInUp' style={styles.containerForm}>
        <Text style={styles.title}>Email</Text>
        <TextInput
          placeholder="Digite seu email..."
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Text style={styles.title}>Senha</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            placeholder="Digite sua senha..."
            style={styles.passwordInput}
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.passwordVisibilityIcon}>
            <Icon
              name={isPasswordVisible ? 'eye-slash' : 'eye'}
              size={20}
              color="#a1a1a1"
            />
          </TouchableOpacity>
  
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.textButton}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonRegister} onPress={handleSignUp}>
          <Text style={styles.registerText}>Não possui uma conta? Cadastre-se</Text>
        </TouchableOpacity>
      </Animatable.View>
      <TouchableOpacity
        style={styles.helpIcon}
        onPress={navigateToDevs}
      >
        <Icon name="question-circle" size={30} color="#000" />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#38a69d',
  },
  containerHeader: {
    marginTop: '14%',
    marginBottom: '8%',
    paddingStart: '5%',
    alignItems: 'center',
  },
  message: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#FFF',
  },
  containerForm: {
    backgroundColor: '#FFF',
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: '5%',
    paddingEnd: '5%',
  },
  title: {
    fontSize: 20,
    marginTop: 28,
  },
  input: {
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 12,
    fontSize: 16,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#a1a1a1',
  },
  passwordInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  passwordVisibilityIcon: {
    padding: 10,
  },
  button: {
    backgroundColor: '#38a69d',
    width: '100%',
    borderRadius: 4,
    paddingVertical: 8,
    marginTop: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonRegister: {
    marginTop: 14,
    alignSelf: 'center',
  },
  registerText: {
    color: '#a1a1a1',
  },
  helpIcon: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
});
