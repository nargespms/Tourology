import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";

import { useRegistration } from "../contexts/RegistrationContext";
import { registerHandler } from "../api/auth"; // <-- Your backend API call

const RegisterStepOne: React.FC = () => {
  const navigation = useNavigation();

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  // Validation / Error states
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [loading, setLoading] = useState(false);
  const { updateData } = useRegistration();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  /**
   * Validate user inputs on client side
   */
  const validateInputs = (): boolean => {
    let valid = true;

    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPhoneError("");
    setPasswordError("");

    if (!firstName.trim()) {
      setFirstNameError("First name is required");
      valid = false;
    }
    if (!lastName.trim()) {
      setLastNameError("Last name is required");
      valid = false;
    }

    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError("Invalid email format");
        valid = false;
      }
    }

    if (!phoneNumber.trim()) {
      setPhoneError("Phone number is required");
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.trim().length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    }

    return valid;
  };

  const handleRegister = async () => {
    Keyboard.dismiss();

    if (!validateInputs()) {
      return; // Stop if client-side validation fails
    }

    try {
      setLoading(true);

      const response = await registerHandler({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
      });

      Toast.show({
        type: "success",
        text1: "Registration Successful",
        text2: "Welcome!",
        topOffset: 50,
      });

      // Update partial data in context (if needed)
      updateData({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
      });

      navigation.navigate("RegisterChooseRole" as never);
    } catch (error: any) {
      // If the backend indicates the user already exists (400)
      if (error.message === "USER_ALREADY_EXISTS") {
        setEmailError("This email is already in use");
        Toast.show({
          type: "error",
          text1: "Registration Failed",
          text2: "Email is already registered",
          topOffset: 50,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Registration Failed",
          text2: error?.message || "Please try again later",
          topOffset: 50,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const onChangeFirstName = (value: string) => {
    setFirstName(value);
    setFirstNameError("");
  };
  const onChangeLastName = (value: string) => {
    setLastName(value);
    setLastNameError("");
  };
  const onChangeEmail = (value: string) => {
    setEmail(value);
    setEmailError("");
  };
  const onChangePhone = (value: string) => {
    setPhoneNumber(value);
    setPhoneError("");
  };
  const onChangePassword = (value: string) => {
    setPassword(value);
    setPasswordError("");
  };

  const isFormIncomplete =
    !firstName.trim() ||
    !lastName.trim() ||
    !email.trim() ||
    !phoneNumber.trim() ||
    !password.trim();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Image
              source={require("../../assets/register-step-one.png")}
              style={styles.topImage}
              resizeMode="cover"
            />

            <View style={styles.bodyContainer}>
              <Text style={styles.title}>Register</Text>

              <Text style={styles.label}>First name*</Text>
              <TextInput
                style={[styles.input, firstNameError ? styles.inputError : {}]}
                placeholder="Enter your first name"
                placeholderTextColor="#999"
                value={firstName}
                onChangeText={onChangeFirstName}
              />
              {!!firstNameError && (
                <Text style={styles.errorText}>{firstNameError}</Text>
              )}

              <Text style={styles.label}>Last name*</Text>
              <TextInput
                style={[styles.input, lastNameError ? styles.inputError : {}]}
                placeholder="Enter your last name"
                placeholderTextColor="#999"
                value={lastName}
                onChangeText={onChangeLastName}
              />
              {!!lastNameError && (
                <Text style={styles.errorText}>{lastNameError}</Text>
              )}

              <Text style={styles.label}>Email*</Text>
              <TextInput
                style={[styles.input, emailError ? styles.inputError : {}]}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={onChangeEmail}
                key={emailError}
              />
              {!!emailError && (
                <Text style={styles.errorText}>{emailError}</Text>
              )}

              <Text style={styles.label}>Phone number*</Text>
              <TextInput
                style={[styles.input, phoneError ? styles.inputError : {}]}
                placeholder="+1"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={onChangePhone}
              />
              {!!phoneError && (
                <Text style={styles.errorText}>{phoneError}</Text>
              )}

              <Text style={styles.label}>Password*</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    passwordError ? styles.inputError : {},
                  ]}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  secureTextEntry={!isPasswordVisible}
                  value={password}
                  onChangeText={onChangePassword}
                />
                <TouchableOpacity
                  style={styles.eyeIconContainer}
                  onPress={togglePasswordVisibility}
                >
                  <Ionicons
                    name={isPasswordVisible ? "eye-off" : "eye"}
                    size={22}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
              {!!passwordError && (
                <Text style={styles.errorText}>{passwordError}</Text>
              )}
              <Text style={styles.passwordNote}>
                Must be at least 6 characters.
              </Text>

              <TouchableOpacity
                style={[
                  styles.continueButton,
                  (isFormIncomplete || loading) && { opacity: 0.7 },
                ]}
                onPress={handleRegister}
                disabled={isFormIncomplete || loading}
              >
                <Text style={styles.continueButtonText}>
                  {loading ? "Processing..." : "Continue"}
                </Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>Have an account? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Login" as never)}
                >
                  <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default RegisterStepOne;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topImage: {
    width: "100%",
    height: 185,
  },
  bodyContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    marginBottom: 12,
    fontSize: 16,
    color: "#333",
  },
  inputError: {
    borderColor: "red",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    marginBottom: 0,
  },
  eyeIconContainer: {
    marginLeft: -35,
    padding: 8,
  },
  passwordNote: {
    fontSize: 12,
    color: "#777",
    marginBottom: 16,
    marginTop: 4,
  },
  continueButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 20,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginBottom: 20,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    color: "#888",
    fontSize: 14,
  },
  loginLink: {
    color: "#4285F4",
    fontSize: 14,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
});
