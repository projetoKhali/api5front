/* eslint-disable @typescript-eslint/no-require-imports */
import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import { FiEye, FiEyeOff } from 'react-icons/fi';

type LoginProps = {
  onLogin: () => void;
};

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = () => {
    if (email && password) {
      onLogin();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/logo-p4t-navbar.png')}
          style={styles.logo}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Insira seu E-mail"
        value={email}
        onChangeText={text => setEmail(text)}
        keyboardType="email-address"
        placeholderTextColor="#bbb"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Insira a senha"
          value={password}
          secureTextEntry={!showPassword}
          onChangeText={text => setPassword(text)}
          placeholderTextColor="#bbb"
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.showPasswordButton}
        >
          {showPassword ? (
            <FiEyeOff size={20} color="#888" />
          ) : (
            <FiEye size={20} color="#888" />
          )}
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '60%',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    width: '80%',
    maxWidth: 400,
    margin: 'auto',
    elevation: 2,
    display: 'flex',
    minHeight: 300,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    width: '100%',
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  showPasswordButton: {
    marginLeft: -30,
    padding: 4,
    paddingBottom: 18,
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: '#F18523',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
  },
  loginButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '70%',
    height: 100,
    marginBottom: 20,
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default Login;
