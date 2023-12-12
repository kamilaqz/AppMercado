import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const membersData = [
  { id: '1', name: 'Ana Alice Marques', role: 'Desenvolvedor Backend' },
  { id: '2', name: 'Esther Lima', role: 'Desenvolvedora Frontend' },
  { id: '3', name: 'Kamila Queiroz', role: 'Desenvolvedor Backend' },
  { id: '4', name: 'Arthur Arruda ', role: 'Designer' },
  { id: '5', name: 'Nicole Lima', role: 'Designer' },

];

export default function MembersPage() {
  const renderMemberItem = ({ item }) => (
    <View style={styles.memberItem}>
      <Text style={styles.memberName}>{item.name}</Text>
      <Text style={styles.memberRole}>{item.role}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Membros do Projeto</Text>
      <FlatList
        data={membersData}
        keyExtractor={(item) => item.id}
        renderItem={renderMemberItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  memberItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#82B6B1',
    borderRadius: 8,
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  memberRole: {
    fontSize: 16,
    color: '#555',
  },
});
