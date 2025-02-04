import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import useSubmitRegister from "../hooks/useSubmitRegister";
import { useRegistration } from "../contexts/RegistrationContext";

const TourGuideCompleteProfile: React.FC = () => {
  const navigation = useNavigation();
  const { data } = useRegistration();

  const [profilePicUri, setProfilePicUri] = useState<string>("");
  const [profileName, setProfileName] = useState(data?.firstName);
  const [bio, setBio] = useState("");

  const handleUpload = async () => {
    //Ask for permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissions Required",
        "We need your permission to use your camera roll to select a photo!"
      );
      return;
    }

    // Launch the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    //  set the selected image URI
    if (!result.canceled) {
      const pickedUri = result.assets[0].uri;
      setProfilePicUri(pickedUri);
    }
  };

  const handleRemove = () => {
    setProfilePicUri("");
  };

  const { mutate, isPending } = useSubmitRegister((data: any) => {
    console.log("Registration successful", data);
    navigation.navigate("TourGuideHome" as never);
  });

  const handleSave = () => {
    // upload data to  server
    console.log("Profile Name:", profileName);
    console.log("Bio:", bio);
    console.log("Profile Pic URI:", profilePicUri);

    mutate();
    // Alert.alert("Profile Updated", "Your profile info was saved successfully.");
  };

  const handleSkip = () => {
    mutate();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Image
            source={require("../../assets/choose-role.png")}
            style={styles.topImage}
            resizeMode="cover"
          />

          <View style={styles.bodyContainer}>
            <Text style={styles.title}>Complete your profile</Text>

            <Text style={styles.label}>Your profile picture</Text>

            <View style={styles.profilePicRow}>
              <View style={styles.profilePicWrapper}>
                {profilePicUri ? (
                  <Image
                    source={{ uri: profilePicUri }}
                    style={styles.profilePic}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require("../../assets/avatar.png")}
                    style={styles.profilePic}
                    resizeMode="cover"
                  />
                )}
              </View>

              <View style={styles.profilePicButtons}>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleUpload}
                >
                  <Text style={styles.uploadButtonText}>Upload</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.removeButton,
                    { opacity: profilePicUri ? 1 : 0.6 },
                  ]}
                  onPress={handleRemove}
                  disabled={!profilePicUri}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.label}>Profile name</Text>
            <TextInput
              style={styles.input}
              value={profileName}
              onChangeText={setProfileName}
              placeholder="Enter your name"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Short biography</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us a little about yourself"
              placeholderTextColor="#999"
              multiline
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TourGuideCompleteProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
  },
  topImage: {
    width: "100%",
    height: 200,
  },
  bodyContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  profilePicRow: {
    flexDirection: "row",
    marginBottom: 24,
  },
  profilePicWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    marginRight: 16,
  },
  profilePic: {
    width: "100%",
    height: "100%",
  },
  profilePicButtons: {
    justifyContent: "center",
  },
  uploadButton: {
    backgroundColor: "#ccc",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  uploadButtonText: {
    fontSize: 14,
    color: "#000",
  },
  removeButton: {
    borderColor: "#f00",
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  removeButtonText: {
    fontSize: 14,
    color: "#f00",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
  },
  bioInput: {
    height: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  skipButton: {
    alignItems: "center",
  },
  skipButtonText: {
    fontSize: 16,
    color: "#333",
  },
});
