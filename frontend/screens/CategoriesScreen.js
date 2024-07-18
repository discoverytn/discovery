import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { DB_HOST, PORT } from "@env";
import { useNavigation } from '@react-navigation/native';
import selectedLogo from '../assets/selectedLogo.gif';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const categories = [
  { id: 1, name: 'Restaurant', image: require('../assets/restaurant.jpg') },
  { id: 2, name: 'Coffee shop', image: require('../assets/coffee_shop.jpg') },
  { id: 3, name: 'Nature', image: require('../assets/nature.jpg') },
  { id: 4, name: 'Art', image: require('../assets/art.jpg') },
  { id: 5, name: 'Camping', image: require('../assets/camping.jpg') },
  { id: 6, name: 'Workout', image: require('../assets/workout.jpg') },
  { id: 7, name: 'Cycling', image: require('../assets/cycling.jpg') },
];

const CategoriesScreen = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigation = useNavigation();
  const { explorer } = useAuth();

  const toggleCategory = (name) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(name)
        ? prevSelected.filter((categoryName) => categoryName !== name)
        : [...prevSelected, name]
    );
  };

  const isCategorySelected = (name) => selectedCategories.includes(name);

  const handleProceed = async () => {
    if (selectedCategories.length >= 3) {
      try {
        const categoriesString = selectedCategories.join(',');
        const explorerId = explorer.idexplorer; 
        await axios.put(`http://${DB_HOST}:${PORT}/explorer/${explorerId}/categories`, { categories: categoriesString });
        setSelectedCategories([]); 
        navigation.navigate('ExplorerEditProfilScreen');
      } catch (error) {
        console.error('Failed to update categories:', error);
      }
    } else {
      alert('Please select at least 3 categories.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Pick From Categories</Text>
      </View>
      <Text style={styles.subheaderText}>Choose at least 3 Categories</Text>
      <ScrollView contentContainerStyle={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.category}
            onPress={() => toggleCategory(category.name)}
          >
            <Image source={category.image} style={styles.categoryImage} />
            <View style={styles.selectedIndicator}>
              {isCategorySelected(category.name) && (
                <Image source={selectedLogo} style={styles.selectedIcon} />
              )}
            </View>
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={[styles.button, selectedCategories.length < 3 && styles.buttonDisabled]}
        onPress={handleProceed}
        disabled={selectedCategories.length < 3}
      >
        <Text style={styles.buttonText}>Proceed</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFDDE3',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    backgroundColor: '#8e9eef',
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subheaderText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  category: {
    width: '48%',
    marginBottom: 20,
    position: 'relative',
  },
  categoryImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  categoryText: {
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
  },
  selectedIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  button: {
    backgroundColor: '#6b7bc1',
    
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#8e9eef',
    },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CategoriesScreen;
