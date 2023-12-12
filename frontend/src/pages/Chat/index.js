import React, { useState, useEffect, Fragment } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Balloon from './balloon'
import {Colors} from 'react-native/Libraries/NewAppScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native-animatable';
import io from 'socket.io-client';
import storageService from '../../services/storageService';

const socket = io('http://localhost:3333')

export default function Chat() {
  const [userData, setUserData] = useState({ name: '' });
  const [text, setText] = useState('');
  const [chat, setChat] = useState({ messages: [] });

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Web Socket conected' + socket.connected)
      console.log(socket.id)
    })

    socket.on('disconnect', () => {
      console.log(socket.connected)
    })

    storageService.get('userData').then((userData) => {
      socket.on('chat', (message) => {
        chat.messages.push(message)
        setChat({messages: chat.messages})
        setText('')
      })
      setUserData(userData);
    });
  }, [])


  const sendMessage = () => {
    socket.emit('chat', { content: text, sentBy: userData.name, date: new Date() });
  };
  
  return (
    <Fragment>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {chat.messages.length > 0 ? (
          chat.messages.map((m, index) => (
            <Balloon key={index} message={m} currentUser={userData.name}></Balloon>
          ))
        ) : (
          <Text style={{ alignSelf: 'center', color: '#848484' }}>
            Sem mensagens no momento
          </Text>
        )}
      </ScrollView>
      <SafeAreaView>
        <View style={styles.messageTextInputContainer}>
          <TextInput
            style={styles.messageTextInput}
            placeholder="Digite sua mensagem..."
            placeholderTextColor={Colors.light}
            value={text}
            multiline
            onChangeText={(message) => setText(message)}
          />
          <TouchableOpacity
            style={styles.sendButton}
            disabled={!text}
            onPress={() => sendMessage()}>
            <Text style={{ color: Colors.white }}> Enviar </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  sendButton: {
    backgroundColor: "#38A69D",
    color: Colors.white,
    height: 40,
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginRight: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#848484',
    borderWidth: 1,
    marginTop: '3%',
    marginBottom: '5%',
    padding: 10,
  },
  scrollViewContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    top: 10,
  },
  messageTextInputContainer: {
    justifyContent: 'flex-end',
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderColor: 'transparent',
    borderTopColor: Colors.light,
    alignItems: 'center',
    flexDirection: 'row',
  },
  messageTextInput: {
    flex: 1,
    minHeight: 60,
    padding: 10,
    fontSize: 17,
    borderColor: Colors.light,
    borderWidth: 1,
    backgroundColor: Colors.white,
    borderRadius: 20,
  },
});
