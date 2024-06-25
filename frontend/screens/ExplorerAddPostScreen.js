import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, FlatList, Image } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from "../context/AuthContext"; 

const ExplorerAddPostScreen = () => {
  const { explorerId } = useAuth(); 

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [location, setLocation] = useState('');
  const [long, setLong] = useState('');
  const [latt, setLatt] = useState('');
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('');

  const Submit = async () => {
    const Hashtags = hashtags.split(',').map(hashtag => hashtag.trim());

    const payload = {
      title,
      description,
      hashtags: Hashtags,
      location,
      long: parseFloat(long),
      latt: parseFloat(latt),
      images,
      category,
      explorerId,
    };

    try {
      const response = await axios.post('http://localhost:3000/posts/explorer/add', payload);
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
    setImages([]);
    setCategory('');
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
    const NewImages = [...images];
    NewImages.splice(index, 1);
    setImages(NewImages);
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
        placeholder="Hashtags (Please separate with comma)"
        value={hashtags}
        onChangeText={setHashtags}
      />

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />

      <View style={styles.locationContainer}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Longitude"
          value={long}
          onChangeText={setLong}
        />

        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Latitude"
          value={latt}
          onChangeText={setLatt}
        />
      </View>

      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={itemValue => setCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Restaurant" value="Restaurant" />
          <Picker.Item label="Coffee shop" value="Coffee shop" />
          <Picker.Item label="Nature" value="Nature" />
          <Picker.Item label="Art" value="Art" />
          <Picker.Item label="Camping" value="Camping" />
          <Picker.Item label="Workout" value="Workout" />
          <Picker.Item label="Cycling" value="Cycling" />
        </Picker>
      </View>

      <Text style={styles.label}>Images</Text>
      <FlatList
        data={images}
        renderItem={renderImageItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        style={styles.imageList}
      />
      <TouchableOpacity style={styles.addButton} onPress={selectImage}>
        <Text style={styles.addButtonText}>+ Add Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={Submit}>
        <Text style={styles.buttonText}>Submit Post</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '80%',
  },
  picker: {
    height: 50,
    width: '100%',
    fontSize: 18,
  },
  placeholderText: {
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginRight: 10,
  },
  imageList: {
    marginBottom: 20,
  },
  imageContainer: {
    marginRight: 10,
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    padding: 5,
  },
  removeImageText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#00aacc',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ExplorerAddPostScreen;
