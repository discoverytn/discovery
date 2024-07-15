import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Image, ScrollView, Modal } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from '@react-navigation/native';


const CLOUDINARY_UPLOAD_PRESET = 'discovery';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dflixnywo/image/upload';

const governorateOptions = [
  'Tunis', 'Ariana', 'Ben Arous', 'Mannouba', 'Bizerte', 'Nabeul', 'Béja', 'Jendouba', 'Zaghouan',
  'Siliana', 'Le Kef', 'Sousse', 'Monastir', 'Mahdia', 'Kasserine', 'Sidi Bouzid', 'Kairouan',
  'Gafsa', 'Sfax', 'Gabès', 'Médenine', 'Tozeur', 'Kebili', 'Tataouine'
];

const BusinessEditProfileScreen = () => {
  const navigation = useNavigation();

  const { business, setBusiness } = useAuth();
  const [businessId, setBusinessId] = useState(null);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [businessDesc, setbusinessDesc] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [businessLocation, setBusinessLocation] = useState('');
  const [mobileNum, setMobileNum] = useState('');
  const [image, setImage] = useState(null);
  const [businessImage, setBusinessImage] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  useEffect(() => {
    if (business) {
      console.log('Business object:', business);  
      if (business.id) {
        setBusinessId(business.id);
        console.log('Business ID set:', business.id);
      }
      setFirstname(business.firstname || '');
      setLastname(business.lastname || '');
      setBusinessName(business.businessName || '');
      setDescription(business.description || '');
      setbusinessDesc(business.businessDesc || '');
      setGovernorate(business.governorate || '');
      setMunicipality(business.municipality || '');
      setBusinessLocation(business.businessLocation || '');
      setMobileNum(business.mobileNum || '');
      setImage(business.image || null);
      setBusinessImage(business.businessImage || null);
    }
  }, [business]);

  const Save = async () => {
    if (newPassword && newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    setModalVisible(true);
  };

  const ConfirmPass = async () => {
    setModalVisible(false);

    const payload = {
      firstname: firstname,
      lastname: lastname,
      description: description,
      businessDesc: businessDesc,
      governorate: governorate,
      municipality: municipality,
      businessLocation: businessLocation,
      mobileNum: mobileNum,
      image: image,
      businessName: businessName,
      businessImage: businessImage,
      currentPassword: currentPassword, 
    };

    if (newPassword) {
      payload.newPassword = newPassword;
    }

    try {
      const response = await axios.put(`http://192.168.1.15:3000/business/${businessId}/edit`, payload);

      if (response.status === 200) {
        setBusiness(response.data)
        Alert.alert('Success', 'Profile updated successfully');
        navigation.navigate("BusinessProfileScreen");

        
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

      if (!result.canceled) {
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
        setBusinessImage(imageUrl); 
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
            onPress={ConfirmPass}
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
        <Text style={styles.headerText}>Business Edit Profile</Text>
      </View>

      <View style={styles.profileImageContainer}>
        <TouchableOpacity style={styles.profileImagePicker} onPress={selectImage}>
          {businessImage ? (
            <Image source={{ uri: businessImage }} style={styles.profileImage} />
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
        placeholder="Business Name"
        value={businessName}
        onChangeText={setBusinessName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      <TextInput
        style={styles.input}
        placeholder="Business Description"
        value={businessDesc}
        onChangeText={setbusinessDesc}
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
        placeholder="Business Location"
        value={businessLocation}
        onChangeText={setBusinessLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        value={mobileNum}
        onChangeText={setMobileNum}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={styles.passwordChangeLink}
        onPress={() => setShowPasswordFields(!showPasswordFields)}
      >
        <Text style={styles.passwordChangeLinkText}>Click here to change your password</Text>
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
      <TouchableOpacity
        style={styles.button}
        onPress={Save}
      >
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
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
    backgroundColor: '#e1e1e1',
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  profileImageText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  button: {
    backgroundColor: '#00aacc',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  passwordChangeLink: {
    marginTop: 10,
  },
  passwordChangeLinkText: {
    color: 'blue',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    marginTop: 10,
  },
});

export default BusinessEditProfileScreen;