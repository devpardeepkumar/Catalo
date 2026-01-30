import { API_ENDPOINTS } from "@/constants/config";
import axios from "axios";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./forgot-password.styles";

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        {
          email: email.trim(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      setIsLoading(false);

      Alert.alert(
        "Email Sent",
        response.data?.message || "Password reset instructions have been sent to your email address.",
        [
          {
            text: "OK",
            onPress: () => {
              setEmail("");
            },
          },
        ]
      );
    } catch (error: any) {
      setIsLoading(false);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to send reset email. Please try again.";

      Alert.alert("Error", errorMessage);
      console.error("Forgot password error:", error.response?.data || error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/logo.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Have you forgotten your</Text>
      <Text style={styles.password}>password?</Text>

      <Text style={styles.subText}>Don't worry! Enter your email here.</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#ffff"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={[styles.infoText, { lineHeight: 24.9 }]}>
        If you have not received any email, check your{" "}
        <Text style={[styles.bold, {marginTop: 70}]}>email service's spam folder.</Text>
      </Text>

      <Text style={[styles.infoText, { lineHeight: 24.9 , paddingHorizontal:12}]}>
        If it still doesn't arrive, try another email <Text style={styles.bold}>address you may have used.</Text>
      </Text>

      <TouchableOpacity
        style={styles.resendBtn}
        onPress={handleForgotPassword}
        disabled={isLoading || !email.trim()}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.resendText}>Send reset email</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

// Forgot Password Screen Component
export default ForgotPasswordScreen;