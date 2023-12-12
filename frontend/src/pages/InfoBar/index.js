import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

export default function InfoBar({ navigation }) {
  return (
    <View style={styles.container}>
      <Icon
        name="arrowleft"
        size={40}
        color="#fff"
        onPress={() => navigation.navigate('Home')}
        style={styles.homeIcon}
      />
      <Button
        title="Perfil"
        onPress={() => navigation.navigate('Profile')}
        color="#92D7D1"
      />
      <View style={styles.spacing} />
      <Button
        title="Favoritos"
        onPress={() => navigation.navigate('Favorite')}
        color="#92D7D1"
      />
      <View style={styles.spacing} />
      <Button
        title="Histórico"
        onPress={() => navigation.navigate('FinishedProducts')}
        color="#92D7D1"
      />
      <View style={styles.spacing} />
      <Button
        title="Sair"
        onPress={() => navigation.navigate('SignIn')}
        color="red"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#82B6B1',
  },
  spacing: {
    height: 15,
  },
  homeIcon: {
    position: 'absolute',
    top: 90,
    left: 25,
    marginBottom: 50,
  },
});
