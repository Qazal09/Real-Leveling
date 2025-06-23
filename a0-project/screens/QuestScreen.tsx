import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { toast } from 'sonner-native';

const QuestScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('daily');

  const [questData, setQuestData] = useState({
    daily: [
      {
        id: 1,
        title: 'Daily Training',
        description: 'Complete 5 training exercises',
        progress: 3,
        total: 5,
        reward: 100,
        completed: false,
        claimed: false
      },
      {
        id: 2,
        title: 'Arena Champion',
        description: 'Win 3 arena battles',
        progress: 1,
        total: 3,
        reward: 150,
        completed: false,
        claimed: false
      },
      {
        id: 3,
        title: 'Shop Spree',
        description: 'Purchase 2 items from shop',
        progress: 0,
        total: 2,
        reward: 80,
        completed: false,
        claimed: false
      }
    ],
    achievements: [
      {
        id: 1,
        title: 'Rising Star',
        description: 'Reach Level 10',
        progress: 7,
        total: 10,
        reward: 500,
        completed: false,
        claimed: false
      },
      {
        id: 2,
        title: 'Gear Master',
        description: 'Collect 5 unique equipment',
        progress: 3,
        total: 5,
        reward: 300,
        completed: false,
        claimed: false
      },
      {
        id: 3,
        title: 'Social Butterfly',
        description: 'Add 10 friends',
        progress: 4,
        total: 10,
        reward: 200,
        completed: false,
        claimed: false
      }
    ]
  });

  const claimReward = (questToClaim) => {
    if (questToClaim.progress >= questToClaim.total && !questToClaim.claimed) {
      setQuestData(prevData => ({
        ...prevData,
        [activeTab]: prevData[activeTab].map(quest =>
          quest.id === questToClaim.id ? { ...quest, claimed: true } : quest
        )
      }));
      toast.success(`Claimed ${questToClaim.reward} coins from ${questToClaim.title}!`);
    } else if (questToClaim.claimed) {
      toast.info('Reward already claimed!');
    } else {
      toast.error('Complete the quest first!');
    }
  };

  const simulateProgress = (questToUpdate) => {
    if (questToUpdate.progress < questToUpdate.total && !questToUpdate.claimed) {
      setQuestData(prevData => ({
        ...prevData,
        [activeTab]: prevData[activeTab].map(quest =>
          quest.id === questToUpdate.id ? { ...quest, progress: Math.min(quest.progress + 1, quest.total) } : quest
        )
      }));
      toast.info(`Progress updated for ${questToUpdate.title}!`);
    } else if (questToUpdate.claimed) {
      toast.info('Quest already completed and claimed!');
    } else {
      toast.info('Quest already completed!');
    }
  };

  const renderQuest = (quest) => (
    <View key={quest.id} style={styles.questCard}>
      <View style={styles.questInfo}>
        <Text style={styles.questTitle}>{quest.title}</Text>
        <Text style={styles.questDescription}>{quest.description}</Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(quest.progress / quest.total) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {quest.progress}/{quest.total}
        </Text>
      </View>
      <View style={styles.questActions}>
        {quest.progress < quest.total && !quest.claimed && (
          <Pressable style={styles.simulateButton} onPress={() => simulateProgress(quest)}>
            <MaterialCommunityIcons name="plus-circle" size={20} color="#fff" />
            <Text style={styles.simulateButtonText}>Progress</Text>
          </Pressable>
        )}
        <Pressable
          style={[
            styles.claimButton,
            (quest.progress < quest.total || quest.claimed) && styles.claimButtonDisabled
          ]}
          onPress={() => claimReward(quest)}
          disabled={quest.progress < quest.total || quest.claimed}
        >
          <MaterialCommunityIcons 
            name={quest.claimed ? "check-all" : "gift"} 
            size={24} 
            color="#fff" 
          />
          <Text style={styles.rewardText}>
            {quest.claimed ? 'Claimed' : quest.reward}
          </Text>
        </Pressable>
      </View>
    </View>
  );

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
          style={[styles.tab, activeTab === 'daily' && styles.activeTab]}
          onPress={() => setActiveTab('daily')}
        >
          <Text style={[styles.tabText, activeTab === 'daily' && styles.activeTabText]}>
            Daily Quests
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
          onPress={() => setActiveTab('achievements')}
        >
          <Text style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>
            Achievements
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        {questData[activeTab].map(renderQuest)}
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
  questCard: {
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#8A2BE2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questInfo: {
    flex: 1,
    marginRight: 10,
  },
  questTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  questDescription: {
    color: '#666',
    fontSize: 14,
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
    borderRadius: 3,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8A2BE2',
    borderRadius: 3,
  },
  progressText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'right',
  },
  questActions: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  simulateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50', // Green for simulate
    padding: 8,
    borderRadius: 10,
    marginBottom: 5,
  },
  simulateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8A2BE2',
    padding: 10,
    borderRadius: 10,
  },
  claimButtonDisabled: {
    backgroundColor: '#666',
    opacity: 0.7,
  },
  rewardText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default QuestScreen;