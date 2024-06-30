import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Image, ScrollView } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const CLOUDINARY_UPLOAD_PRESET = 'discovery'; 
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dflixnywo/image/upload';

const ExplorerAddPostScreen = () => {
  const { explorer } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [location, setLocation] = useState('');
  const [long, setLong] = useState('');
  const [latt, setLatt] = useState('');
  const [images, setImages] = useState({ image1: null, image2: null, image3: null, image4: null });
  const [category, setCategory] = useState('');
  const [explorerId, setExplorerId] = useState('');
  const navigation = useNavigation();
  useEffect(() => {
    if (explorer && explorer.id) {
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
      image1: images.image1?.url,
      image2: images.image2?.url,
      image3: images.image3?.url,
      image4: images.image4?.url,
    };

    console.log('Payload:', payload);

    try {
      const response = await axios.post('http://192.168.1.19:3000/posts/explorer/add', payload);

      if (response.status === 201) {
        Alert.alert('Success', 'Post created successfully');
       clearFields();
       navigation.navigate("explorerProfil");
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
    setImages({ image1: null, image2: null, image3: null, image4: null });
  };

  const selectImage = async (imageKey) => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log('ImagePicker result:', result);

      if (!result.cancelled) {
        const source = { uri: result.assets[0].uri }; 
        console.log('Selected image URI:', source.uri);
        uploadImage(source.uri, imageKey);
      }
    } catch (error) {
      console.error('ImagePicker Error: ', error);
    }
  };

  const uploadImage = async (uri, imageKey) => {
    const formData = new FormData();
    formData.append("file", {
      uri,
      type: "image/jpeg",
      name: uri.split("/").pop(),
    });
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  
    try {
      const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Upload response:", response);
  
      if (response.status === 200) {
        const imageUrl = response.data.secure_url;
        setImages((prevImages) => ({
          ...prevImages,
          [imageKey]: { url: imageUrl },
        }));
      } else {
        Alert.alert("Error", "Failed to upload image");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      Alert.alert("Error", "An error occurred while uploading the image");
    }
  };
  

  const removeImage = (imageKey) => {
    setImages(prevImages => ({
      ...prevImages,
      [imageKey]: null
    }));
  };

  const renderImageItem = (image, imageKey) => (
    <View style={styles.imageContainer} key={imageKey}>
      {image && (
        <>
          <Image source={{ uri: image.url }} style={styles.image} />
          <TouchableOpacity onPress={() => removeImage(imageKey)} style={styles.removeImageButton}>
            <Text style={styles.removeImageText}>X</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity style={styles.selectImageButton} onPress={() => selectImage(imageKey)}>
        <Text style={styles.selectImageButtonText}>Select Image {imageKey.replace('image', '')}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
          <Picker.Item label="Restaurant" value="Restaurant" />
          <Picker.Item label="Coffe Shop" value="Coffe Shop" />
          <Picker.Item label="Nature" value="Nature" />
          <Picker.Item label="Art" value="Art" />
          <Picker.Item label="Camping" value="Camping" />
          <Picker.Item label="Workout" value="Workout" />
          <Picker.Item label="Cycling" value="Cycling" />
        </Picker>
        <View style={styles.imagesContainer}>
          {Object.keys(images).map(key => renderImageItem(images[key], key))}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Post</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  imageContainer: {
    width: '48%',
    position: 'relative',
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    padding: 5,
    borderRadius: 15,
    zIndex: 1,
  },
  removeImageText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectImageButton: {
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectImageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ExplorerAddPostScreen;