import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { toast } from 'sonner-native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (!email || !password || (!isLogin && !username)) {
      toast.error('Please fill in all fields');
      return;
    }

    if (isLogin) {
      // Check for admin credentials
      if (email === 'donebro50@gmail.com' && password === '1135520897Qazal') {
        // Store admin status globally
        global.isAdmin = true;
        toast.success('Admin login successful!');
        navigation.navigate('Menu'); // Navigate to Menu screen
      } else {
        // Regular user login
        global.isAdmin = false;
        toast.success('Login successful!');
        navigation.navigate('Menu'); // Navigate to Menu screen
      }
    } else {
      // Prevent admin email from being used for signup
      if (email === 'donebro50@gmail.com') {
        toast.error('This email cannot be used for registration');
        return;
      }
      // Regular signup logic
      global.isAdmin = false; // Ensure non-admin on signup
      toast.success('Account created successfully!');
      navigation.navigate('Menu'); // Navigate to Menu screen
    }
  };

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>SOLO LEVELING</Text>
        
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>
            {isLogin ? 'Welcome Back, Hunter' : 'Become a Hunter'}
          </Text>

          {!isLogin && (
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="account" size={24} color="#8A2BE2" />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#666"
                value={username}
                onChangeText={setUsername}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="email" size={24} color="#8A2BE2" />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="lock" size={24} color="#8A2BE2" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <MaterialCommunityIcons
                name={showPassword ? 'eye' : 'eye-off'}
                size={24}
                color="#8A2BE2"
              />
            </Pressable>
          </View>

          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>
              {isLogin ? 'Login' : 'Sign Up'}
            </Text>
          </Pressable>

          <Pressable
            style={styles.switchButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.switchButtonText}>
              {isLogin
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Login'}
            </Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 50,
    textShadowColor: 'rgba(138, 43, 226, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  input: {
    flex: 1,
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#8A2BE2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#8A2BE2',
    fontSize: 16,
  },
});

export default LoginScreen;