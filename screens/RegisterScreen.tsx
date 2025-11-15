import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { signUp } from "../src/services/auth";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../src/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ name?: String, email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let newErrors: { name?: string; email?: string; password?: string } = {};

    if (!name) newErrors.name = "Por favor, nos diga seu nome.";

    if (!email) newErrors.email = "Não deixe de informar seu e-mail.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Digite um e-mail válido.";

    if (!password) newErrors.password = "A segurança é importante por aqui.";
    else if (password.length < 8)
      newErrors.password = "A senha deve ter pelo menos 8 caracteres.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    const { error } = await signUp(name, email, password);
    setLoading(false);

    if (error) {
      setErrors({ email: error.message });
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle" size={34} color="#fff" />
        <Text style={styles.title}>Cadastro</Text>
        <Text style={styles.subtitle}>Junte-se ao MindBox e organize suas ideias!</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Já possui uma conta? Faça login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formWrapper}>
        <View style={styles.formContainer}>
          <Text style={styles.description}>Forneça seus dados para se cadastrar</Text>

          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Como você quer ser chamado?"
              placeholderTextColor="#7a8ca5"
              value={name}
              onChangeText={setName}
              maxLength={20}
            />
            <Ionicons name="person-outline" size={20} color="#7a8ca5" style={styles.icon} />
          </View>
          
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Informe o seu melhor e-mail"
              placeholderTextColor="#7a8ca5"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <Ionicons name="mail-outline" size={20} color="#7a8ca5" style={styles.icon} />
          </View>
          
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Digite uma senha babadeira"
              placeholderTextColor="#7a8ca5"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Ionicons name="lock-closed-outline" size={20} color="#7a8ca5" style={styles.icon} />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  header: {
    flex: 1,
    backgroundColor: "#034078",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10
  },
  subtitle: {
    color: "#cde2f7",
    fontSize: 15,
    marginTop: 10,
    textAlign: "center"
  },
  footer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 80,
    backgroundColor: "#fff"
  },
  link: {
    color: "#52667a",
    fontWeight: "600"
  },
  formWrapper: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    alignItems: "center"
  },
  formContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 10
  },
  description: {
    fontSize: 16,
    color: "#034078",
    width: "95%",
    marginBottom: 25,
    fontWeight: "600"
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
    marginBottom: 10
  },
  input: {
    flex: 1,
    height: 45,
    color: "#333"
  },
  icon: {
    marginLeft: 8
  },
  errorText: {
    alignSelf: "flex-start",
    color: "#d9534f",
    fontSize: 13,
    marginLeft: 5,
    marginBottom: 2
  },
  button: {
    width: "95%",
    backgroundColor: "#034078",
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600"
  },
});
