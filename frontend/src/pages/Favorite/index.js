import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const Favorite = ({ navigation }) => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get('http://localhost:3333/favorite');
        setFavoriteProducts(response.data);
      } catch (error) {
        console.error('Erro ao buscar favoritos:', error);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (productId) => {
    try {
      await axios.delete(`http://localhost:3333/favorite/${productId}`);
      setFavoriteProducts((prevFavorites) => {
        if (!prevFavorites) return prevFavorites;
  
        const updatedFavorites = prevFavorites.map((favorite) => {
          return {
            ...favorite,
            products: favorite.products.filter((item) => item.product._id !== productId),
          };
        });
  
        return updatedFavorites;
      });
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
    }
  };

  const renderItem = (products) =>
  products.map((item) => (
    <TouchableOpacity key={item._id} style={styles.productContainer}>
      <ProductDetails itemId={item.product._id} />
      <TouchableOpacity
        style={styles.trashIcon}
        onPress={() => handleRemoveFavorite(item.product._id)}
      >
        <Ionicons name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </TouchableOpacity>
  ));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="ios-arrow-back"
          size={30}
          color="#FFF"
          onPress={() => navigation.navigate('InfoBar')}
        />
        <Text style={styles.headerText}>Produtos Favoritos</Text>
      </View>
      {favoriteProducts.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum produto favorito encontrado.</Text>
      ) : (
        <FlatList
        data={favoriteProducts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => renderItem(item.products)}
        />
      )}
    </View>
  );
};

const ProductDetails = ({ itemId }) => {
  const [productDetails, setProductDetails] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3333/products/${itemId}`);
        setProductDetails(response.data);
      } catch (error) {
        console.error('Erro ao buscar detalhes do produto:', error);
      }
    };

    fetchDetails();
  }, [itemId]);

  return (
    <View style={styles.productInfoContainer}>
      {productDetails && productDetails.image && (
        <Image source={{ uri: productDetails.image }} style={styles.productImage} />
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>
          {productDetails ? productDetails.name : 'Produto não encontrado'}
        </Text>
        <Text style={styles.productBrand}>
          Marca: {productDetails ? productDetails.brand : ''}
        </Text>
        <Text style={styles.productPrice}>
          Preço: R$ {productDetails ? productDetails.price.toFixed(2) : ''}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 55,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#38A69D',
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderColor: '#ccc',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 15,
  },
  productInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productBrand: {
    fontSize: 16,
    color: '#555',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
  trashIcon: {
    marginLeft: 'auto',
  },
});

export default Favorite;
