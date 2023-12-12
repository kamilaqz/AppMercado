import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Card, FAB } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import { Platform } from 'react-native';

export default function Home() {
  const navigation = useNavigation();
  const [productQuantity, setProductQuantity] = useState({});
  const [cartProducts, setCartProducts] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [backendProducts, setBackendProducts] = useState([]);
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3333/products');
        setBackendProducts(response.data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };
  
    fetchProducts();
  }, []);

  const handleFavoriteToggle = async (productId) => {
    try {
      const response = await axios.post('http://localhost:3333/favorite', {
        productId: productId,
      });
      setFavorites((prevFavorites) => ({
        ...prevFavorites,
        [productId]: !prevFavorites[productId],
      }));
    } catch (error) {
      console.error('Erro ao alterar favorito:', error);
    }
  };

  const fadeAnimation = useRef(new Animated.Value(0)).current;

  const handleQuantityChange = (productName, newQuantity) => {
    setProductQuantity({ ...productQuantity, [productName]: newQuantity });
  };

  const handleAddToCart = (product) => {
    const quantity = productQuantity[product.name] || 0;
    // Verifica se o produto já está no carrinho
    const productIndex = cartProducts.findIndex((item) => item.name === product.name);

    if (quantity > 0) {
      if (productIndex !== -1) {
        // Se o produto já está no carrinho, apenas atualiza a quantidade
        const updatedCart = [...cartProducts];
        updatedCart[productIndex].quantity += quantity;
        setCartProducts(updatedCart);
      } else {
        // Se o produto não está no carrinho será adicionado ao carrinho
        const updatedCart = [...cartProducts, { ...product, quantity }];
        setCartProducts(updatedCart);
      }
      // Vai ser usado para zerar o seletor de quantidade
      setProductQuantity({ ...productQuantity, [product.name]: 0 });

      // Set de animação para quando o produto for adicionado ao carrinho
      setShowConfirmation(true);
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 900,
        useNativeDriver: false,
      }).start(() => {
        setShowConfirmation(false);
        fadeAnimation.setValue(0);
      });
    }
  };

  const openChat = () => {
    navigation.navigate('Chat')
  }

  return (
    <>
    <View style={styles.container}>
      <StatusBar backgroundColor="#38A69D" barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.navigate('InfoBar')} style={styles.icon}>
            <Icon name="bars" size={35} color="#FFF" />
          </TouchableOpacity>
          <Image
            source={require('../../assets/novalogo2.png')}
            style={{ height: 100, width: 160, marginBottom: -12, marginLeft: 10, marginRight: 5 }}
            resizeMode="contain"
          />
          <TouchableOpacity onPress={() => navigation.navigate('Cart', { cartProducts, setCartProducts })} style={styles.icon}>
            <Icon name="shoppingcart" size={32} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.productList}>
        {backendProducts.map((product, index) => (
          <Card key={index}>
            <TouchableOpacity
              style={styles.favoriteIcon}
              onPress={() => handleFavoriteToggle(product._id)}>
              <FontAwesome
                name={favorites[product._id] ? 'heart' : 'heart-o'}
                size={24}
                color={favorites[product._id] ? 'red' : '#555'}/>
            </TouchableOpacity>
            
            <Card.Image source={{ uri: product.image }} />
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.priceText}>Preço: <Text style={styles.boldRedText}>R$ {product.price.toFixed(2)}</Text></Text>
            <Text style={styles.commonText}>Marca: {product.brand}</Text>
            <Text style={styles.expirationText}>Data de Vencimento: <Text style={styles.boldRedText}>{formatDate(product.expirationDate)}</Text></Text>
            <QuantitySelector
              productName={product.name}
              quantity={productQuantity[product.name] || 0}
              onQuantityChange={handleQuantityChange}
            />
            <TouchableOpacity
              style={styles.addProductButton}
              onPress={() => handleAddToCart(product)}
            >
              <Text style={styles.addProductButtonText}>Adicionar ao carrinho</Text>
            </TouchableOpacity>
          </Card>
        ))}
      </ScrollView>

      {/* Animação de confirmação */}
      {showConfirmation && (
        <Animated.View style={[styles.confirmationContainer, { opacity: fadeAnimation }]}>
          <Text style={styles.confirmationText}>Produto adicionado ao carrinho!</Text>
        </Animated.View>
      )}
    </View>
    
    <FAB
      style= {styles.fab}
      visible={true}
      icon={{ name: 'chat', color: 'white'}}
      color= "#38A69D"
      onPress={() => openChat()}/>
    </>
  );
}

const formatDate = (dateString) => {
  try {
    console.log('String de data recebida:', dateString);

    const [year, month, day] = dateString.split('/');

    const formattedDate = new Date(year, month - 1, day);

    console.log('Data formatada:', formattedDate);

    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDateString = formattedDate.toLocaleDateString('pt-BR', options);

    console.log('Data formatada:', formattedDateString);

    return formattedDateString;
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return 'Data inválida';
  }
};

//Função do seletor de quantidade, se for preciso mudar algo pode seguir as funções abaixo, já foi colocado limitação para não ter bug

function QuantitySelector({ productName, quantity, onQuantityChange }) {
  return (
    <View style={styles.quantitySelector}>
      <Text style={styles.quantityText}>Quantidade:</Text>
      <TouchableOpacity
        onPress={() => {
          if (quantity > 0) {
            onQuantityChange(productName, quantity - 1);
          }
        }}
        style={styles.quantityButton}
      >
        <FontAwesome name="minus" size={16} color="#38A69D" />
      </TouchableOpacity>
      <Text style={styles.quantityNumber}>{quantity}</Text>
      <TouchableOpacity
        onPress={() => {
          if (quantity < 100) {
            onQuantityChange(productName, quantity + 1);
          }
        }}
        style={styles.quantityButton}
      >
        <FontAwesome name="plus" size={16} color="#38A69D" />
      </TouchableOpacity>
    </View>
  );
}


//parte de style não precisa de alteração no back, mas se for necessário pode alterar
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },

  //Style do cabeçalho
  header: {
    backgroundColor: '#38A69D',
    padding: 2,
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    padding: 10,
  },

  
  //style para altera os textos dos cards
  priceText: {
    marginBottom: 5,
  },
  
  boldRedText: {
    fontWeight: 'bold',
    color: 'red',
  },

  favoriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },

  //style do botão de adicionar ao carrinho
  addButton: {
    borderColor: '#38A69D',
    borderWidth: 2,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  addButtonText: {
    color: '#38A69D',
    marginLeft: 10,
  },
  
  
  productList: {
    padding: 20,
    paddingTop: 5,
  },

//style da animação 
  confirmationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  confirmationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#38A69D',
  },


  addProductButton: {
    borderColor: '#38A69D',
    borderWidth: 3,
    borderRadius: 5,
    alignItems: 'center',
    padding: 10,
  },
  addProductButtonText: {
    color: '#38A69D',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  //style do botao de chat
  fab: {
    position: 'absolute',
    right: 30,
    bottom: 30
  },

  //essa parte é do seletor de quantidade, ele fica "separado" pois ele tem umas limitações, como não permitir colocar > -1 produto
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    marginRight: 10,
  },
  quantityNumber: {
    fontWeight: 'bold',
  },
  quantityButton: {
    padding: 5,
  },
});