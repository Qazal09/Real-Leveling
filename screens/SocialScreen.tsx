import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { toast } from 'sonner-native';

const SocialScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('friends');
  const [friendRequest, setFriendRequest] = useState('');

  const mockFriends = [
    { id: 1, name: 'Jin-Woo', rank: 'S', status: 'Online' },
    { id: 2, name: 'Cha Hae-In', rank: 'S', status: 'In Battle' },
    { id: 3, name: 'Go Gun-Hee', rank: 'S', status: 'Offline' },
  ];

  const mockGuild = {
    name: 'Shadow Monarchs',
    rank: 'S',
    members: 28,
    description: 'Elite hunters guild led by Sung Jin-Woo'
  };

  const sendFriendRequest = () => {
    if (friendRequest.length < 3) {
      toast.error('Please enter a valid username');
      return;
    }
    toast.success('Friend request sent!');
    setFriendRequest('');
  };

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#8A2BE2" />
          <Text style={styles.backText}>Back to Menu</Text>
        </Pressable>
      </View>

      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>Friends</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'guild' && styles.activeTab]}
          onPress={() => setActiveTab('guild')}
        >
          <Text style={[styles.tabText, activeTab === 'guild' && styles.activeTabText]}>Guild</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'friends' ? (
          <View>
            <View style={styles.addFriendContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter friend's username"
                placeholderTextColor="#666"
                value={friendRequest}
                onChangeText={setFriendRequest}
              />
              <Pressable style={styles.addButton} onPress={sendFriendRequest}>
                <MaterialCommunityIcons name="account-plus" size={24} color="#fff" />
              </Pressable>
            </View>
            
            {mockFriends.map(friend => (
              <View key={friend.id} style={styles.friendCard}>
                <View style={styles.friendInfo}>
                  <MaterialCommunityIcons name="account-circle" size={40} color="#8A2BE2" />
                  <View style={styles.friendDetails}>
                    <Text style={styles.friendName}>{friend.name}</Text>
                    <Text style={styles.friendRank}>Rank {friend.rank}</Text>
                  </View>
                </View>
                <View style={styles.friendStatus}>
                  <View style={[styles.statusDot, { backgroundColor: friend.status === 'Online' ? '#00ff00' : friend.status === 'In Battle' ? '#ff0000' : '#666' }]} />
                  <Text style={styles.statusText}>{friend.status}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.guildContainer}>
            <View style={styles.guildHeader}>
              <MaterialCommunityIcons name="shield-crown" size={60} color="#8A2BE2" />
              <Text style={styles.guildName}>{mockGuild.name}</Text>
              <Text style={styles.guildRank}>Rank {mockGuild.rank}</Text>
              <Text style={styles.guildMembers}>{mockGuild.members} Members</Text>
            </View>
            <Text style={styles.guildDescription}>{mockGuild.description}</Text>
            <Pressable style={styles.guildAction}>
              <Text style={styles.guildActionText}>Guild Activities</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  backText: {
    color: '#8A2BE2',
    fontSize: 16,
    marginLeft: 10,
  },
  tabs: {
    flexDirection: 'row',
    padding: 15,
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#8A2BE2',
  },
  tabText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#8A2BE2',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  addFriendContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    color: '#fff',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#8A2BE2',
    borderRadius: 10,
    padding: 15,
    justifyContent: 'center',
  },
  friendCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendDetails: {
    marginLeft: 10,
  },
  friendName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  friendRank: {
    color: '#666',
    fontSize: 14,
  },
  friendStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    color: '#666',
    fontSize: 14,
  },
  guildContainer: {
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  guildHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  guildName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  guildRank: {
    color: '#8A2BE2',
    fontSize: 18,
    marginTop: 5,
  },
  guildMembers: {
    color: '#666',
    fontSize: 16,
    marginTop: 5,
  },
  guildDescription: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  guildAction: {
    backgroundColor: '#8A2BE2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  guildActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SocialScreen;