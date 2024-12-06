import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { postLogin } from '../service/Login';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    setErrorMessage(null);
    if (email && password) {
      try {
        const response = await postLogin({ email, password });
        // Associa o usuário retornado ao Redux
        dispatch(login(response.user));
        navigate('/');
      } catch (error) {
        console.error(error);
        setErrorMessage('Credenciais inválidas. Tente novamente.');
      }
    } else {
      setErrorMessage('Preencha todos os campos.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          source={require('../../assets/images/logo-p4t-navbar.png')}
          style={styles.logo}
        />
      </View>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Insira seu E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#bbb"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Insira a senha"
          value={password}
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
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
        <Text style={styles.loginButtonText}>Enter</Text>
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
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default Login;
