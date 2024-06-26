import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, FlatList, Image } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext'; 

const ExplorerAddPostScreen = () => {
  const { explorer } = useAuth(); 
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [location, setLocation] = useState('');
  const [long, setLong] = useState('');
  const [latt, setLatt] = useState('');
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('');
  const [explorerId, setExplorerId] = useState('');

  useEffect(() => {
    
    if (explorer.id) {
      setExplorerId(explorer.id); 
      console.log('Explorer ID set from context:', explorer.id);
    } else {
      console.log('Explorer ID not found in context');
    }
  }, [explorer]);

  const handleSubmit = async () => {
    const Hashtags = hashtags.split(',').map(hashtag => hashtag.trim());

    const payload = {
      title,
      description,
      hashtags: Hashtags,
      location,
      long: parseFloat(long),
      latt: parseFloat(latt),
      category,
      explorer_idexplorer: explorerId, 
    };

    console.log('Payload:', payload); 

    try {
      const response = await axios.post('http://192.168.1.8:3000/posts/explorer/add', payload);

      if (response.status === 201) {
        Alert.alert('Success', 'Post created successfully');
        clearFields();
      } else {
        Alert.alert('Error', 'Failed to create post');
      }
    } catch (error) {
      console.error('Post creation error:', error);
      Alert.alert('Error', 'An error occurred while creating the post');
    }
  };

  const clearFields = () => {
    setTitle('');
    setDescription('');
    setHashtags('');
    setLocation('');
    setLong('');
    setLatt('');
    setCategory('');
    setImages([]);
  };

  
  const selectImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        const source = { uri: result.uri };
        setImages([...images, source]);
      }
    } catch (error) {
      console.error('ImagePicker Error: ', error);
    }
  };

  
  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  
  const renderImageItem = ({ item, index }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.uri }} style={styles.image} />
      <TouchableOpacity onPress={() => removeImage(index)} style={styles.removeImageButton}>
        <Text style={styles.removeImageText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create a New Post</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Hashtags (comma separated)"
        value={hashtags}
        onChangeText={setHashtags}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Longitude"
        value={long}
        onChangeText={setLong}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Latitude"
        value={latt}
        onChangeText={setLatt}
        keyboardType="numeric"
      />
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Category" value="" />
        <Picker.Item label="Adventure" value="adventure" />
        <Picker.Item label="Nature" value="nature" />
        <Picker.Item label="Culture" value="culture" />
        {/* Add more categories as needed */}
      </Picker>
      <TouchableOpacity style={styles.button} onPress={selectImage}>
        <Text style={styles.buttonText}>Select Image</Text>
      </TouchableOpacity>
      <FlatList
        data={images}
        renderItem={renderImageItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Post</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
  removeImageButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    padding: 5,
  },
  removeImageText: {
    color: 'white',
    fontSize: 12,
  },
});

export default ExplorerAddPostScreen;