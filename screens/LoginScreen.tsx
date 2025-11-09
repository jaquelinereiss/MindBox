import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../src/navigation/types";
import { supabase } from "../src/lib/supabaseClient";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, "Login"> & {
  onLoginSuccess: () => void;
};

export default function LoginScreen({ navigation, onLoginSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = async () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");
    setLoginError("");

    if (!email.trim()) {
      setEmailError("O e-mail é obrigatório.");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Digite um e-mail válido.");
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError("A senha é obrigatória.");
      valid = false;
    }

    if (!valid) return;

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setLoginError("E-mail ou senha inválidos. Tente novamente.");
    } else {
      onLoginSuccess();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="cube" size={34} color="#fff" />
        <Text style={styles.title}>MindBox</Text>
        <Text style={styles.subtitle}>Organize ideias, simplifique sua mente.</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.description}>Informe seus dados para continuar</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escreva o seu e-mail"
            placeholderTextColor="#7a8ca5"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError("");
            }}
          />
          <Ionicons name="mail-outline" size={20} color="#7a8ca5" style={styles.icon} />
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Digite a sua senha"
            placeholderTextColor="#7a8ca5"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) setPasswordError("");
            }}
          />
          <Ionicons name="lock-closed-outline" size={20} color="#7a8ca5" style={styles.icon} />
        </View>

        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        {loginError ? <Text style={styles.loginError}>{loginError}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Entrando..." : "Entrar"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>Não possui uma conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#034078",
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 70,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 15,
    color: "#cde2f7",
    textAlign: "center",
    width: "80%",
    lineHeight: 22,
  },
  formContainer: {
    flex: 2,
    backgroundColor: "#fdfdfd",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 25,
    paddingTop: 45,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
    elevation: 6,
  },
  description: {
    fontSize: 16,
    color: "#034078",
    width: "95%",
    marginBottom: 25,
    fontWeight: "600",
  },
  inputContainer: {
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#d0dce8",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  input: {
    flex: 1,
    height: 45,
    color: "#333",
  },
  icon: {
    marginLeft: 8,
  },
  errorText: {
    width: "95%",
    color: "#d9534f",
    fontSize: 13,
    marginBottom: 10,
    textAlign: "left",
  },
  loginError: {
    color: "#d9534f",
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    width: "95%",
    backgroundColor: "#034078",
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  link: {
    marginTop: 50,
    color: "#52667a",
    fontWeight: "600",
  },
});
