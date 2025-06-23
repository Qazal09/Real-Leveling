import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const MenuScreen = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>SOLO LEVELING</Text>
        
        <Pressable
          style={styles.optionButton}
          onPress={() => navigation.navigate('Training')}
        >
          <MaterialCommunityIcons name="sword-cross" size={32} color="#8A2BE2" />
          <Text style={styles.optionText}>Level Up Training</Text>
        </Pressable>        <Pressable
          style={styles.optionButton}
          onPress={() => navigation.navigate('Battle')}
        >
          <MaterialCommunityIcons name="sword" size={32} color="#8A2BE2" />
          <Text style={styles.optionText}>Battle Arena</Text>
        </Pressable>        <Pressable
          style={styles.optionButton}
          onPress={() => navigation.navigate('Shop')}
        >
          <MaterialCommunityIcons name="store" size={32} color="#8A2BE2" />
          <Text style={styles.optionText}>Shop</Text>
        </Pressable>

        <Pressable
          style={styles.optionButton}
          onPress={() => navigation.navigate('Social')}
        >
          <MaterialCommunityIcons name="account-group" size={32} color="#8A2BE2" />
          <Text style={styles.optionText}>Social</Text>
        </Pressable>        <Pressable
          style={styles.optionButton}
          onPress={() => navigation.navigate('Quests')}
        >
          <MaterialCommunityIcons name="trophy" size={32} color="#8A2BE2" />
          <Text style={styles.optionText}>Quests</Text>
        </Pressable>

        <Pressable
          style={styles.optionButton}
          onPress={() => navigation.navigate('Inventory')}
        >
          <MaterialCommunityIcons name="briefcase" size={32} color="#8A2BE2" />
          <Text style={styles.optionText}>Inventory</Text>
        </Pressable>

        {global.isAdmin && (
           <Pressable
             style={styles.optionButton}
             onPress={() => navigation.navigate('Admin')}
           >
             <MaterialCommunityIcons name="shield-crown" size={32} color="#8A2BE2" />
             <Text style={styles.optionText}>Admin Panel</Text>
           </Pressable>
         )}
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
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    padding: 20,
    borderRadius: 15,
    width: '80%',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  optionText: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 15,
    fontWeight: '600',
  },
});

export default MenuScreen;