import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Image, ScrollView, Modal } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { Picker } from "@react-native-picker/picker";

const CLOUDINARY_UPLOAD_PRESET = 'discovery';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dflixnywo/image/upload';

const governorateOptions = [
  'Tunis', 'Ariana', 'Ben Arous', 'Mannouba', 'Bizerte', 'Nabeul', 'Béja', 'Jendouba', 'Zaghouan',
  'Siliana', 'Le Kef', 'Sousse', 'Monastir', 'Mahdia', 'Kasserine', 'Sidi Bouzid', 'Kairouan',
  'Gafsa', 'Sfax', 'Gabès', 'Médenine', 'Tozeur', 'Kebili', 'Tataouine'
];

const ExplorerEditProfil = () => {
  const { explorer, setExplorer } = useAuth();
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

  useEffect(() => {
    if (explorer) {
      setFirstname(explorer.firstname || '');
      setLastname(explorer.lastname || '');
      setDescription(explorer.description || '');
      setGovernorate(explorer.governorate || '');
      setMunicipality(explorer.municipality || '');
      setMobileNum(explorer.mobileNum || '');
      setImage(explorer.image || null);
    }
  }, [explorer]);

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
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      description: description.trim(),
      governorate: governorate.trim(),
      municipality: municipality.trim(),
      mobileNum: mobileNum.trim(),
      image,
      currentPassword: currentPassword.trim(),
    };

    if (newPassword) {
      payload.newPassword = newPassword.trim();
    }

    try {
      const response = await axios.put(`http://192.168.1.19:3000/explorer/${explorer.id}/edit`, payload);

      if (response.status === 200) {
        setExplorer(response.data);
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response) {
       
        console.error('Server responded with:', error.response.data);
        Alert.alert('Error', 'Failed to update profile: Server error');
      } else if (error.request) {
        
        console.error('No response received:', error.request);
        Alert.alert('Error', 'Failed to update profile: No response');
      } else {
        
        console.error('Error setting up the request:', error.message);
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

      console.log('ImagePicker result:', result);

      if (!result.cancelled) {
        const source = { uri: result.assets[0].uri };
        console.log('Selected image URI:', source.uri);
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

      console.log("Upload response:", response);

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
        style={[styles.input, { keyboardType: 'numeric' }]}
        placeholder="Mobile Number"
        value={mobileNum}
        onChangeText={setMobileNum}
      />

      <TouchableOpacity onPress={() => setShowPasswordFields(!showPasswordFields)}>
        <Text style={styles.changePasswordText}>Click here to change your password</Text>
      </TouchableOpacity>
      {showPasswordFields && (
        <>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Enter your new password"
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Confirm your new password"
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
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
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
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  profileImageText: {
    textAlign: 'center',
    color: '#888',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  picker: {
    flex: 1,
    marginRight: 10,
  },
  municipalityInput: {
    flex: 1,
  },
  changePasswordText: {
    color: '#007bff',
    textAlign: 'center',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ff4444',
    marginTop: 10,
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
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
});

export default ExplorerEditProfil;
