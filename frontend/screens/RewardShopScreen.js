import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { DB_HOST, PORT } from "@env";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

const RewardShopScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const { explorer } = useAuth();

  useEffect(() => {
    if (explorer && explorer.idexplorer) {
      fetchMarketItems();
    }
  }, [explorer]);

  const fetchMarketItems = async () => {
    try {
      const response = await axios.get(`http://${DB_HOST}:${PORT}/admin/market/getall`);
      if (Array.isArray(response.data)) {
        setItems(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
        Alert.alert('Error', 'Failed to fetch market items. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching market items:', error);
      Alert.alert('Error', 'Failed to fetch market items. Please try again.');
    }
  };

  const handlePurchase = async (itemId) => {
    if (!itemId) {
      console.error('Invalid item ID');
      Alert.alert('Error', 'Invalid item. Please try again.');
      return;
    }
  
    if (!explorer || !explorer.idexplorer) {
      console.error('Explorer data not available');
      Alert.alert('Error', 'Explorer data not available. Please try again later.');
      return;
    }
  
    console.log(`Attempting to purchase item with ID: ${itemId}`);
  
    try {
      const response = await axios.post(`http://${DB_HOST}:${PORT}/explorer/market/purchase/${itemId}/${explorer.idexplorer}`);
  
      console.log('Purchase request sent:', response.data);
  
      if (response.status === 200) {
        console.log('Item purchased successfully:', response.data);
        Alert.alert('Success', 'Item purchased successfully!');
        fetchMarketItems();
      } else {
        console.warn('Unexpected status:', response.status);
        Alert.alert('Error', 'Failed to purchase item. Unexpected status.');
      }
    } catch (error) {
      console.error('Error purchasing item:', error);
      Alert.alert('Error', 'Failed to purchase item. Please try again.');
    }
  };

  const renderItem = ({ item }) => {
    let isItemPurchased = false;
  
    if (explorer && explorer.boughtItemName) {
      const purchasedItems = explorer.boughtItemName.split(',');
      isItemPurchased = purchasedItems.includes(item.itemName);
    }
  
    return (
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.itemImage }} style={styles.itemImage} />
        <Text style={styles.itemName}>{item.itemName}</Text>
        <Text style={styles.itemDescription}>{item.itemDescription}</Text>
        <Text style={styles.itemPrice}>{item.itemPrice} Coins</Text>
        <TouchableOpacity
          style={[styles.buyButton, isItemPurchased && styles.disabledButton]}
          onPress={() => handlePurchase(item.iditem)}
          disabled={isItemPurchased}
        >
          <Text style={styles.buyButtonText}>Buy</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faCircleLeft} style={styles.icon} size={20} color='#fff' />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reward Shop</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Main')}>
          <FontAwesomeIcon icon={faHome} style={styles.icon} size={22} color="#fff"/>
        </TouchableOpacity>
      </View>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.iditem.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
      <Navbar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#8e9eef',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  icon: {
    width: 24,
    height: 24,
  },
  listContainer: {
    padding: 10,
  },
  itemContainer: {
    flex: 1,
    margin: 5,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
    textAlign: 'center',
  },
  itemDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buyButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc', 
  },
});

export default RewardShopScreen;