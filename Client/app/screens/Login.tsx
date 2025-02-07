import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { loginHandler } from "../api/auth";
import { useLoggedUser } from "../contexts/loggedUserData";

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updateData } = useLoggedUser();

  // Validation state
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  /**
   * Basic validation: checks for empty fields.
   */
  const validateInputs = () => {
    let valid = true;

    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      valid = false;
    } else {
      setPasswordError("");
    }

    return valid;
  };

  const handleLogin = async () => {
    Keyboard.dismiss();
    setLoginError(false);

    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    try {
      const response = await loginHandler({ email, password });

      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: "Welcome back!",
        visibilityTime: 5000,
        topOffset: 50,
      });

      await updateData({
        id: response.userId,
        firstName: response.firstName,
        lastName: response.lastName,
        role: response.role,
        email: response.email,
        token: response.token,
      });

      setTimeout(() => {
        if (response.role === "traveler") {
          navigation.navigate("TravelerHome" as never);
        } else if (response.role === "guide") {
          navigation.navigate("TourGuideHome" as never);
        }
      }, 50);
    } catch (err) {
      setLoginError(true);
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: "Invalid email or password",
        visibilityTime: 5000,
        topOffset: 50,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Image
            source={require("../../assets/login-cover.png")}
            style={styles.topImage}
            resizeMode="cover"
          />

          <View style={styles.bodyContainer}>
            <Text style={styles.loginTitle}>Login</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                (emailError || loginError) && styles.inputError,
              ]}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError("");
                setLoginError(false);
              }}
            />
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  (passwordError || loginError) && styles.inputError,
                ]}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError("");
                  setLoginError(false);
                }}
              />

              <TouchableOpacity
                style={styles.eyeIconContainer}
                onPress={togglePasswordVisibility}
              >
                <Icon
                  name={isPasswordVisible ? "eye-off" : "eye"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}

            <TouchableOpacity
              style={[
                styles.continueButton,
                (loading || !email.trim() || !password.trim()) && {
                  opacity: 0.7,
                },
              ]}
              onPress={handleLogin}
              disabled={loading || !email.trim() || !password.trim()}
            >
              <Text style={styles.continueButtonText}>
                {loading ? "Logging in..." : "Login"}
              </Text>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>New to Tourology? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Register" as never)}
              >
                <Text style={styles.registerLink}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topImage: {
    width: "100%",
    height: 200,
  },
  bodyContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: "#333",
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
    marginBottom: 8,
  },
  passwordInput: {
    flex: 1,
    marginBottom: 0,
  },
  eyeIconContainer: {
    marginLeft: -35,
    padding: 8,
  },
  continueButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 24,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    color: "#888",
    fontSize: 14,
  },
  registerLink: {
    color: "#4285F4",
    fontSize: 14,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
});
