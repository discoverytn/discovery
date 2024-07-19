import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Image, ScrollView, Modal } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Picker } from "@react-native-picker/picker";
import { DB_HOST, PORT } from "@env";

const CLOUDINARY_UPLOAD_PRESET = 'discovery';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dflixnywo/image/upload';

const governorateOptions = [
  'Tunis', 'Ariana', 'Ben Arous', 'Mannouba', 'Bizerte', 'Nabeul', 'Béja', 'Jendouba', 'Zaghouan',
  'Siliana', 'Le Kef', 'Sousse', 'Monastir', 'Mahdia', 'Kasserine', 'Sidi Bouzid', 'Kairouan',
  'Gafsa', 'Sfax', 'Gabès', 'Médenine', 'Tozeur', 'Kebili', 'Tataouine'
];

const ExplorerEditProfileScreen = () => {
  const navigation = useNavigation();
  const { explorer, setExplorer } = useAuth();
  const [explorerId, setExplorerId] = useState(null);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [description, setDescription] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [mobileNum, setMobileNum] = useState('');
  const [image, setImage] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [boughtItems, setBoughtItems] = useState([]);
  const [selectedBoughtItem, setSelectedBoughtItem] = useState('');
  const [selectedItemImage, setSelectedItemImage] = useState('');

  useEffect(() => {
    if (explorer) {
      if (explorer.id) {
        setExplorerId(explorer.id);
      }
      setFirstname(explorer.firstname || '');
      setLastname(explorer.lastname || '');
      setDescription(explorer.description || '');
      setGovernorate(explorer.governorate || '');
      setMunicipality(explorer.municipality || '');
      setMobileNum(explorer.mobileNum || '');
      setImage(explorer.image || null);
      setSelectedBoughtItem(explorer.selectedItemName || '');
      setSelectedItemImage(explorer.selectedItemImage || '');
      fetchBoughtItems();
    }
  }, [explorer]);

  const fetchBoughtItems = async () => {
    try {
      const response = await axios.get(`http://${DB_HOST}:${PORT}/explorer/${explorerId}/bought-items`);
      setBoughtItems(response.data);
    } catch (error) {
      console.error('Error fetching bought items:', error);
      Alert.alert('Error', 'Failed to fetch bought items');
    }
  };

  const clearFields = () => {
    setFirstname('');
    setLastname('');
    setDescription('');
    setGovernorate('');
    setMunicipality('');
    setMobileNum('');
    setNewPassword('');
    setConfirmNewPassword('');
    setCurrentPassword('');
    setSelectedBoughtItem('');
    setSelectedItemImage('');
  };

  const handleSave = async () => {
    if (newPassword && newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    setModalVisible(true);
  };

  const handleConfirmPassword = async () => {
    setModalVisible(false);
    const payload = {
      firstname: firstname,
      lastname: lastname,
      description: description,
      governorate: governorate,
      municipality: municipality,
      mobileNum: mobileNum,
      image,
      currentPassword: currentPassword,
      selectedItemName: selectedBoughtItem,
      selectedItemImage: selectedItemImage,
    };
    if (newPassword) {
      payload.newPassword = newPassword;
    }
    try {
      const response = await axios.put(`http://${DB_HOST}:${PORT}/explorer/${explorerId}/edit`, payload);
      if (response.status === 200) {
        setExplorer(response.data);
        Alert.alert('Success', 'Profile updated successfully');
        clearFields();
        navigation.navigate("explorerProfil");
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response) {
        Alert.alert('Error', 'Failed to update profile: Server error');
      } else if (error.request) {
        Alert.alert('Error', 'Failed to update profile: No response');
      } else {
        Alert.alert('Error', 'Failed to update profile: Request setup error');
      }
    }
  };

  const selectImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        const source = { uri: result.assets[0].uri };
        uploadImage(source.uri);
      }
    } catch (error) {
      console.error('ImagePicker Error: ', error);
    }
  };

  const uploadImage = async (uri) => {
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
      if (response.status === 200) {
        const imageUrl = response.data.secure_url;
        setImage(imageUrl);
      } else {
        Alert.alert("Error", "Failed to upload image");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      Alert.alert("Error", "An error occurred while uploading the image");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Enter your current password to confirm changes:</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleConfirmPassword}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.header}>
        <Text style={styles.headerText}>Edit Profile</Text>
      </View>

      <View style={styles.profileImageContainer}>
        <TouchableOpacity style={styles.profileImagePicker} onPress={selectImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.profileImage} />
          ) : (
            <Text style={styles.profileImageText}>Pick a profile picture</Text>
          )}
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstname}
        onChangeText={setFirstname}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastname}
        onChangeText={setLastname}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      <View style={styles.locationContainer}>
        <Picker
          style={[styles.input, styles.picker]}
          selectedValue={governorate}
          onValueChange={(itemValue, itemIndex) =>
            setGovernorate(itemValue)
          }>
          {governorateOptions.map((gov, index) => (
            <Picker.Item key={index} label={gov} value={gov} />
          ))}
        </Picker>
        <TextInput
          style={[styles.input, styles.municipalityInput]}
          placeholder="Municipality"
          value={municipality}
          onChangeText={setMunicipality}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        value={mobileNum}
        onChangeText={setMobileNum}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Bought Items</Text>
      <Picker
        style={styles.input}
        selectedValue={selectedBoughtItem}
        onValueChange={(itemValue, itemIndex) => {
          setSelectedBoughtItem(itemValue);
          const selectedItem = boughtItems.find(item => item.itemName === itemValue);
          if (selectedItem) {
            setSelectedItemImage(selectedItem.itemImage);
          } else {
            setSelectedItemImage('');
          }
        }}
      >
        <Picker.Item label="Select a bought item" value="" />
        {boughtItems.map((item) => (
          <Picker.Item key={item.iditem} label={item.itemName} value={item.itemName} />
        ))}
      </Picker>

      <TouchableOpacity onPress={() => setShowPasswordFields(!showPasswordFields)}>
        <Text style={styles.changePasswordText}>Click here to change your password</Text>
      </TouchableOpacity>

      {showPasswordFields && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm new password"
            secureTextEntry
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
          />
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImagePicker: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImageText: {
    color: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: '#8e9eef',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  changePasswordText: {
    color: '#007bff',
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  picker: {
    flex: 1,
    marginRight: 5,
  },
  municipalityInput: {
    flex: 1,
    marginLeft: 5,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: 'red',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
});

export default ExplorerEditProfileScreen;