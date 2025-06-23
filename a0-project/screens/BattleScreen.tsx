import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { toast } from 'sonner-native';

const BattleScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // Player stats from global state (includes equipment bonuses)
  const calculatePlayerTotalStats = () => {
    let totalAttack = global.playerStats.attack;
    let totalHealth = global.playerStats.health;

    if (global.playerEquipment.weapon) {
      totalAttack += global.playerEquipment.weapon.stats?.attack || 0;
      totalHealth += global.playerEquipment.weapon.stats?.health || 0;
    }
    if (global.playerEquipment.armor) {
      totalHealth += global.playerEquipment.armor.stats?.health || 0;
    }
    if (global.playerEquipment.accessory) {
      totalHealth += global.playerEquipment.accessory.stats?.health || 0;
    }
    return { attack: totalAttack, maxHealth: totalHealth };
  };

  const initialPlayerStats = calculatePlayerTotalStats();

  const [playerHP, setPlayerHP] = useState(initialPlayerStats.maxHealth);
  const [enemyHP, setEnemyHP] = useState(150); // Mock enemy HP
  const [enemyMaxHP, setEnemyMaxHP] = useState(150);
  const [enemyAttack, setEnemyAttack] = useState(20); // Mock enemy attack
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [battleOutcome, setBattleOutcome] = useState<'win' | 'lose' | null>(null);
  const [showItemSelect, setShowItemSelect] = useState(false);

  useEffect(() => {
    if (isFocused) {
      // Recalculate player stats on focus to get updated equipment bonuses
      const updatedPlayerStats = calculatePlayerTotalStats();
      setPlayerHP(updatedPlayerStats.maxHealth); // Reset player HP to max when entering/refocusing
      // Reset enemy for a new battle
      setEnemyHP(150);
      setEnemyMaxHP(150);
      setBattleLog([]);
      setBattleOutcome(null);
      setShowItemSelect(false); // Hide item selection on focus
    }
  }, [isFocused]);

  const handleAttack = () => {
    if (battleOutcome) return; // Battle is over
    setShowItemSelect(false); // Hide item selection

    const playerDamage = initialPlayerStats.attack + Math.floor(Math.random() * 10); // Player attacks with some variance
    const newEnemyHP = enemyHP - playerDamage;
    setEnemyHP(newEnemyHP);
    setBattleLog(prev => [`You dealt ${playerDamage} damage to the enemy!`, ...prev]);

    if (newEnemyHP <= 0) {
      setBattleOutcome('win');
      toast.success('VICTORY! You defeated the enemy!');
      global.playerStats.xp += 100; // Reward XP
      global.playerStats.currency += 50; // Reward gold
      if (global.playerStats.xp >= global.playerStats.level * 100) {
        global.playerStats.level += 1;
        global.playerStats.attack += 5;
        global.playerStats.defense += 2;
        global.playerStats.health += 10;
        global.playerStats.xp = 0;
        toast.success(`Leveled up to Level ${global.playerStats.level}!`);
      }
      return;
    }

    // Enemy attacks back after a short delay
    setTimeout(() => {
      if (battleOutcome) return; // Check if battle ended during delay
      const enemyDamage = enemyAttack + Math.floor(Math.random() * 5); // Enemy attacks with some variance
      const newPlayerHP = playerHP - enemyDamage;
      setPlayerHP(newPlayerHP);
      setBattleLog(prev => [`Enemy dealt ${enemyDamage} damage to you!`, ...prev]);

      if (newPlayerHP <= 0) {
        setBattleOutcome('lose');
        toast.error('DEFEAT! You were defeated...');
      }
    }, 1000);
  };

  const handleUseItem = (item: any) => {
    if (battleOutcome) return;
    setShowItemSelect(false);

    if (item.type === 'consumable') {
      if (item.stock && item.stock > 0) {
        // Apply effects (e.g., restore HP)
        const maxHealth = calculatePlayerTotalStats().maxHealth;
        if (item.stats?.health) {
          const newHP = Math.min(playerHP + item.stats.health, maxHealth);
          setPlayerHP(newHP);
          // Update global health for consistency outside of battle
          global.playerStats.health = newHP;
          setBattleLog(prev => [`Used ${item.name}! Restored ${item.stats.health} HP.`, ...prev]);
          toast.success(`Used ${item.name}!`);
        } else if (item.stats?.mana) {
          // Implement mana restoration if mana stat is added globally
          toast.info(`Used ${item.name}! Restored ${item.stats.mana} Mana. (Mana system not fully active yet)`);
        } else {
          toast.info(`Used ${item.name}! No discernable effect in battle.`);
        }

        // Decrement stock or remove item from global inventory
        const itemIndex = global.playerInventory.findIndex((i: any) => i.id === item.id);
        if (itemIndex !== -1) {
          if (global.playerInventory[itemIndex].stock > 1) {
            global.playerInventory[itemIndex].stock -= 1;
          } else {
            global.playerInventory.splice(itemIndex, 1);
          }
        }
        // Enemy attacks after item usage (player's turn ends)
        setTimeout(() => {
            if (battleOutcome) return;
            const enemyDamage = enemyAttack + Math.floor(Math.random() * 5);
            const newPlayerHP = playerHP - enemyDamage;
            setPlayerHP(newPlayerHP);
            setBattleLog(prev => [`Enemy dealt ${enemyDamage} damage to you!`, ...prev]);
    
            if (newPlayerHP <= 0) {
              setBattleOutcome('lose');
              toast.error('DEFEAT! You were defeated...');
            }
          }, 1000);

      } else {
        toast.error(`${item.name} is out of stock!`);
      }
    } else {
      toast.error(`${item.name} cannot be used in battle.`);
    }
  };

  const handleResetBattle = () => {
    const updatedPlayerStats = calculatePlayerTotalStats();
    setPlayerHP(updatedPlayerStats.maxHealth);
    setEnemyHP(150);
    setBattleLog([]);
    setBattleOutcome(null);
    setShowItemSelect(false);
    toast.info('Battle reset!');
  };

  const playerHPPercentage = playerHP > 0 ? playerHP / initialPlayerStats.maxHealth : 0;
  const enemyHPPercentage = enemyHP > 0 ? enemyHP / enemyMaxHP : 0;

  const availableConsumables = global.playerInventory.filter((item: any) => item.type === 'consumable' && item.stock > 0);

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <Pressable
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="#8A2BE2" />
        <Text style={styles.backText}>Back to Menu</Text>
      </Pressable>

      <View style={styles.content}>
        <Text style={styles.title}>BATTLE ARENA</Text>

        {/* Enemy Info */}
        <View style={styles.combatantCard}>
          <MaterialCommunityIcons name="skull" size={40} color="#dc3545" />
          <Text style={styles.combatantName}>Goblin Warrior</Text>
          <View style={styles.hpBarContainer}>
            <View style={[styles.hpBar, { width: `${enemyHPPercentage * 100}%` }]} />
          </View>
          <Text style={styles.hpText}>HP: {Math.max(0, enemyHP)} / {enemyMaxHP}</Text>
        </View>

        <Text style={styles.vsText}>VS</Text>

        {/* Player Info */}
        <View style={styles.combatantCard}>
          <MaterialCommunityIcons name="account-hard-hat" size={40} color="#28a745" />
          <Text style={styles.combatantName}>You (Hunter)</Text>
          <View style={styles.hpBarContainer}>
            <View style={[styles.hpBar, { width: `${playerHPPercentage * 100}%`, backgroundColor: '#28a745' }]} />
          </View>
          <Text style={styles.hpText}>HP: {Math.max(0, playerHP)} / {initialPlayerStats.maxHealth}</Text>
        </View>

        {/* Battle Actions */}
        {!battleOutcome ? (
          <View style={styles.actionButtonsContainer}>
            <Pressable style={styles.actionButton} onPress={handleAttack}>
              <MaterialCommunityIcons name="sword-cross" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Attack!</Text>
            </Pressable>
            <Pressable style={styles.actionButton} onPress={() => setShowItemSelect(prev => !prev)}>
              <MaterialCommunityIcons name="flask" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Use Item</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.actionButton} onPress={handleResetBattle}>
            <MaterialCommunityIcons name="refresh" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Reset Battle</Text>
          </Pressable>
        )}

        {/* Item Selection Overlay */}
        {showItemSelect && availableConsumables.length > 0 && (
          <View style={styles.itemSelectOverlay}>
            <Text style={styles.itemSelectTitle}>Select Item:</Text>
            {availableConsumables.map((item: any) => (
              <Pressable key={item.id} style={styles.itemSelectItem} onPress={() => handleUseItem(item)}>
                <MaterialCommunityIcons name={item.icon || 'help-circle'} size={20} color="#fff" />
                <Text style={styles.itemSelectText}>{item.name} (x{item.stock})</Text>
              </Pressable>
            ))}
            <Pressable style={styles.closeItemSelectButton} onPress={() => setShowItemSelect(false)}>
              <Text style={styles.closeItemSelectButtonText}>Close</Text>
            </Pressable>
          </View>
        )}

        {/* Battle Log */}
        <View style={styles.logContainer}>
          <Text style={styles.logTitle}>Battle Log</Text>
          <ScrollView style={styles.logScrollView} inverted>
            {battleLog.map((entry, index) => (
              <Text key={index} style={styles.logEntry}>{entry}</Text>
            ))}
          </ScrollView>
        </View>

      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  backText: {
    color: '#8A2BE2',
    fontSize: 16,
    marginLeft: 10,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8A2BE2',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(138, 43, 226, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  combatantCard: {
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    borderRadius: 15,
    padding: 15,
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  combatantName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  hpBarContainer: {
    width: '90%',
    height: 15,
    backgroundColor: '#333',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 5,
  },
  hpBar: {
    height: '100%',
    backgroundColor: '#dc3545',
    borderRadius: 5,
  },
  hpText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  vsText: {
    color: '#8A2BE2',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8A2BE2',
    padding: 15,
    borderRadius: 10,
    width: '45%',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  itemSelectOverlay: {
    position: 'absolute',
    top: '30%',
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    borderWidth: 1,
    borderColor: '#8A2BE2',
    alignItems: 'center',
    zIndex: 10,
  },
  itemSelectTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  itemSelectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: '#555',
  },
  itemSelectText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  closeItemSelectButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 15,
  },
  closeItemSelectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    width: '90%',
    height: 150,
    borderWidth: 1,
    borderColor: '#555',
  },
  logTitle: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  logScrollView: {
    flex: 1,
  },
  logEntry: {
    color: '#eee',
    fontSize: 12,
    marginBottom: 3,
  },
});

export default BattleScreen;