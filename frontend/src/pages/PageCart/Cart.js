import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import axios from 'axios';

export default function Cart({ route, navigation }) {
  const { cartProducts, setCartProducts } = route.params;
  const [products, setProducts] = useState(cartProducts);
  const [orderId, setOrderId] = useState(null);

  const handleIncrementQuantity = (index) => {
    const updatedCart = [...products];
    updatedCart[index].quantity++;
    setProducts([...updatedCart]);
    setCartProducts([...updatedCart]);
  };

  const handleDecrementQuantity = (index) => {
    const updatedCart = [...cartProducts];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity--;
      setProducts([...updatedCart]);
      setCartProducts([...updatedCart]);
    }
  };

  //esse const é para mexer na animação
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const handleBackToHome = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: false,
    }).start(() => {
      navigation.navigate('Home');
    });
  };

  const handleFinalizarCompra = async () => {
    if (cartProducts.length > 0) {
      try {
        const orderProducts = cartProducts.map(product => ({
          product: product._id,
          quantity: product.quantity,
          total: !isNaN(product.price * product.quantity) ? parseFloat(product.price * product.quantity) : 0,
        }));
  
        const response = await fetch('http://localhost:3333/finalizeOrder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ products: orderProducts }),
        });
  
        if (response.ok) {
          const result = await response.json();
          console.log('Resposta do backend:', result);

          setOrderId(result.order._id);
          setModalVisible(true);
          setCartProducts([]);
          setProducts([]);
        } else {
          console.error('Erro ao finalizar a compra:', response.statusText);
          alert('Erro ao finalizar a compra. Tente novamente mais tarde.');
        }
      } catch (error) {
        console.error('Erro ao finalizar a compra:', error);
      }
    }
  };

  const handleRemoveProduct = (index) => {
    const updatedCart = [...cartProducts];
    updatedCart.splice(index, 1);
    setProducts([...updatedCart])
    setCartProducts([...updatedCart]);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const calculateTotal = (cartProducts) => {
    return cartProducts.reduce((total, product) => total + product.price * product.quantity, 0);
  };

  const handleModalOk = () => {
    setModalVisible(false);
    if (orderId) {
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity onPress={handleBackToHome} style={styles.logoutIcon}>
        <Icon name="arrowleft" size={30} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Carrinho</Text>
    </View>

      <ScrollView style={styles.productList}>
        {products.map((product, index) => (
          <View key={index} style={styles.cartProduct}>
            <Text style={styles.productName}>{product.name}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity style={styles.iconContainer} onPress={() => handleDecrementQuantity(index)}>
                <Icon name="minus" size={20} color="#000" />
              </TouchableOpacity>
              <Text>{product.quantity}</Text>
              <TouchableOpacity style={styles.iconContainer} onPress={() => handleIncrementQuantity(index)}>
                <Icon name="plus" size={20} color="#000" />
              </TouchableOpacity>
            </View>
            <Text>Preço: R$ {(product.price * product.quantity).toFixed(2)}</Text>
            <TouchableOpacity onPress={() => handleRemoveProduct(index)}>
              <Icon name="delete" size={20} color="#FF0000" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.checkoutButton, { opacity: cartProducts.length > 0 ? 1 : 0.5 }]}
        onPress={handleFinalizarCompra}
        disabled={cartProducts.length === 0}
      >
        <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
      </TouchableOpacity>

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: R$ {calculateTotal(cartProducts).toFixed(2)}</Text>
      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalText, styles.centerText]}>Compra de número</Text>
            <Text style={[styles.modalText, styles.centerText]}>{orderId}</Text>
            <Text style={[styles.modalText, styles.centerText]}>finalizada.</Text>
            <Text style={[styles.modalText, styles.centerText]}>Volte sempre!</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleModalOk}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    color: '#38A69D',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 50, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
    logoutIcon: {
    paddingTop: 45,
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  cartProduct: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#92D7D1',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  checkoutButton: {
    backgroundColor: '#38A69D',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  checkoutButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  historicoText: {
    color: '#38A69D',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#38A69D',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    paddingTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  iconContainer: {
    padding: 5,
  },
});

