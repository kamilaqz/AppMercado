import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

export default function FinishedProduct({ navigation }) {
  const [finishedOrders, setFinishedOrders] = useState([]);

  useEffect(() => {
    const fetchFinishedOrders = async () => {
      try {
        const response = await fetch('http://localhost:3333/finalizeOrder');

        if (response.ok) {
          const result = await response.json();

          const updatedOrders = await Promise.all(
            result.map(async (order) => {
              const updatedProducts = await Promise.all(
                order.products.map(async (product) => {
                  if (product.product) {
                    const productDetailsResponse = await fetch(`http://localhost:3333/products/${product.product._id}`);
                    const productDetails = await productDetailsResponse.json();
                    return {
                      ...product,
                      product: productDetails,
                    };
                  } else {
                    return product;
                  }
                })
              );
              return {
                ...order,
                products: updatedProducts,
              };
            })
          );

          setFinishedOrders(updatedOrders);
        } else {
          console.error('Erro ao obter a lista de pedidos finalizados:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao obter a lista de pedidos finalizados:', error);
      }
    };

    fetchFinishedOrders();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="arrowleft" size={35} color="#000" onPress={() => navigation.navigate('InfoBar')} />
        <Text style={styles.title}>Histórico de Produtos</Text>
      </View>
      <FlatList
        data={finishedOrders}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text>
              <Text style={styles.boldText}>ID da Compra:</Text> {item._id}
            </Text>
            <Text>
              <Text style={styles.boldText}>Data da Compra:</Text> {new Date(item.createdAt).toLocaleString()}
            </Text>
            <View>
              <Text>
                <Text style={styles.boldText}>Total da Compra:</Text> R$ {item.totalAmount.toFixed(2)}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    paddingVertical: 45,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },
  orderItem: {
    marginBottom: 20,
  },
  productItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#92D7D1',
    borderRadius: 8,
  },
  horizontalLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});