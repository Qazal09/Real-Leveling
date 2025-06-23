import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { toast } from 'sonner-native';

export default function HomeScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [playerStats, setPlayerStats] = useState(global.playerStats);
  const [playerEquipment, setPlayerEquipment] = useState(global.playerEquipment);
  const [lastClaimedDailyBonus, setLastClaimedDailyBonus] = useState<number>(0);

  // This function would ideally calculate total stats from global.playerStats and global.playerEquipment
  // Since we already have this logic in InventoryScreen, we can reuse it or simplify for display here.
  const calculateDisplayStats = () => {
    let totalAttack = global.playerStats.attack;
    let totalDefense = global.playerStats.defense;
    let totalHealth = global.playerStats.health;

    if (global.playerEquipment.weapon) {
      totalAttack += global.playerEquipment.weapon.stats?.attack || 0;
      totalDefense += global.playerEquipment.weapon.stats?.defense || 0;
      totalHealth += global.playerEquipment.weapon.stats?.health || 0;
    }
    if (global.playerEquipment.armor) {
      totalAttack += global.playerEquipment.armor.stats?.attack || 0;
      totalDefense += global.playerEquipment.armor.stats?.defense || 0;
      totalHealth += global.playerEquipment.armor.stats?.health || 0;
    }
    if (global.playerEquipment.accessory) {
      totalAttack += global.playerEquipment.accessory.stats?.attack || 0;
      totalDefense += global.playerEquipment.accessory.stats?.defense || 0;
      totalHealth += global.playerEquipment.accessory.stats?.health || 0;
    }

    return { totalAttack, totalDefense, totalHealth };
  };

  useEffect(() => {
    if (isFocused) {
      setPlayerStats({ ...global.playerStats });
      setPlayerEquipment({ ...global.playerEquipment });
    }
  }, [isFocused]);

  const handleClaimDailyBonus = () => {
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (now - lastClaimedDailyBonus < twentyFourHours) {
      const remainingTime = twentyFourHours - (now - lastClaimedDailyBonus);
      const hours = Math.floor(remainingTime / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      toast.info(`Next daily bonus in ${hours}h ${minutes}m`);
      return;
    }

    const xpReward = 50;
    const currencyReward = 200;

    global.playerStats.xp += xpReward;
    global.playerStats.currency += currencyReward;

    // Simple level up logic
    if (global.playerStats.xp >= global.playerStats.level * 100) {
      global.playerStats.level += 1;
      global.playerStats.attack += 5; // Increase stats on level up
      global.playerStats.defense += 2;
      global.playerStats.health += 10;
      global.playerStats.xp = 0; // Reset XP for next level
      toast.success(`Leveled up to Level ${global.playerStats.level}!`);
    }

    setPlayerStats({ ...global.playerStats }); // Update local state to re-render
    setLastClaimedDailyBonus(now);
    toast.success(`Daily bonus claimed! +${xpReward} XP, +${currencyReward} Gold!`);
  };

  const { totalAttack, totalDefense, totalHealth } = calculateDisplayStats();

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Welcome, Hunter!</Text>

        {/* Player Stats Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Stats</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statText}>Level: {playerStats.level}</Text>
            <Text style={styles.statText}>XP: {playerStats.xp}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statText}>Attack: {totalAttack}</Text>
            <Text style={styles.statText}>Defense: {totalDefense}</Text>
            <Text style={styles.statText}>Health: {totalHealth}</Text>
          </View>
          <Text style={styles.currencyText}>
            <MaterialCommunityIcons name="coin" size={16} color="gold" /> {playerStats.currency}
          </Text>
        </View>

        {/* Daily Bonus Card */}
        <Pressable
          style={styles.dailyBonusCard}
          onPress={handleClaimDailyBonus}
        >
          <MaterialCommunityIcons name="gift" size={40} color="#FFD700" />
          <Text style={styles.dailyBonusText}>Claim Daily Bonus!</Text>
          <Text style={styles.dailyBonusSubText}>Get XP & Gold!</Text>
        </Pressable>

        {/* Add more sections as needed, e.g., Daily Quests, Announcements etc. */}

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    alignItems: 'center',
    paddingTop: 50, // Give some space from the top
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 30,
    textShadowColor: 'rgba(138, 43, 226, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  card: {
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 20,
    width: '90%',
    borderWidth: 1,
    borderColor: '#8A2BE2',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
  },
  statText: {
    color: '#fff',
    fontSize: 16,
  },
  currencyText: {
    color: 'gold',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  dailyBonusCard: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 20,
    width: '90%',
    borderWidth: 1,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dailyBonusText: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  dailyBonusSubText: {
    color: '#FFD700',
    fontSize: 14,
    marginTop: 5,
    opacity: 0.8,
  },
});