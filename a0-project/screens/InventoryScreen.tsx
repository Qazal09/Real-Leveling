import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { toast } from 'sonner-native';

const InventoryScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // Local state to manage inventory and equipment for UI updates
  const [inventory, setInventory] = useState(global.playerInventory);
  const [equipment, setEquipment] = useState(global.playerEquipment);
  const [playerStats, setPlayerStats] = useState(global.playerStats);
  const [playerCurrentHP, setPlayerCurrentHP] = useState(global.playerStats.health); // Track current HP for consumables

  // Update local state when global state changes or screen gains focus
  useEffect(() => {
    if (isFocused) {
      setInventory([...global.playerInventory]); // Ensure a new array reference for re-render
      setEquipment({ ...global.playerEquipment });
      setPlayerStats({ ...global.playerStats });
      // Also ensure current HP reflects max health from equipped items on focus
      setPlayerCurrentHP(global.playerStats.health);
    }
  }, [isFocused]);

  const calculateTotalStats = () => {
    let totalAttack = global.playerStats.attack;
    let totalDefense = global.playerStats.defense;
    let totalHealth = global.playerStats.health; // Base health

    if (equipment.weapon) {
      totalAttack += equipment.weapon.stats?.attack || 0;
      totalDefense += equipment.weapon.stats?.defense || 0;
      totalHealth += equipment.weapon.stats?.health || 0;
    }
    if (equipment.armor) {
      totalAttack += equipment.armor.stats?.attack || 0;
      totalDefense += equipment.armor.stats?.defense || 0;
      totalHealth += equipment.armor.stats?.health || 0;
    }
    if (equipment.accessory) {
      totalAttack += equipment.accessory.stats?.attack || 0;
      totalDefense += equipment.accessory.stats?.defense || 0;
      totalHealth += equipment.accessory.stats?.health || 0;
    }
    return { totalAttack, totalDefense, maxHealth: totalHealth };
  };

  const handleEquip = (item: any) => {
    const currentEquippedItem = equipment[item.type];

    if (currentEquippedItem) {
      // Unequip current item first: add it back to inventory
      const updatedInventory = [...global.playerInventory, currentEquippedItem];
      global.playerInventory = updatedInventory;
    }

    // Equip new item: remove from inventory and set to equipment slot
    global.playerEquipment[item.type] = item;
    global.playerInventory = global.playerInventory.filter((i: any) => i.id !== item.id);

    // Update player stats based on new equipment
    const newStats = calculateTotalStats();
    global.playerStats = { ...global.playerStats, ...newStats };

    // Update local state to reflect changes
    setInventory([...global.playerInventory]);
    setEquipment({ ...global.playerEquipment });
    setPlayerStats({ ...global.playerStats });
    setPlayerCurrentHP(global.playerStats.health); // Ensure HP matches new max health

    toast.success(`${item.name} equipped!`);
  };

  const handleUnequip = (item: any) => {
    if (global.playerEquipment[item.type] && global.playerEquipment[item.type].id === item.id) {
      global.playerEquipment[item.type] = null; // Clear equipment slot
      global.playerInventory = [...global.playerInventory, item]; // Add item back to inventory

      // Update player stats based on removed equipment
      const newStats = calculateTotalStats();
      global.playerStats = { ...global.playerStats, ...newStats };

      // Update local state to reflect changes
      setInventory([...global.playerInventory]);
      setEquipment({ ...global.playerEquipment });
      setPlayerStats({ ...global.playerStats });
      setPlayerCurrentHP(global.playerStats.health); // Ensure HP matches new max health

      toast.info(`${item.name} unequipped.`);
    }
  };

  const handleUseItem = (item: any) => {
    if (item.type === 'consumable') {
      if (item.stock && item.stock > 0) {
        // Apply effects (e.g., restore HP)
        if (item.stats?.health) {
          const newHP = Math.min(playerCurrentHP + item.stats.health, calculateTotalStats().maxHealth);
          setPlayerCurrentHP(newHP);
          global.playerStats.health = newHP; // Update global current HP
          toast.success(`Used ${item.name}! Restored ${item.stats.health} HP.`);
        } else if (item.stats?.mana) {
          // Assuming a global.playerStats.mana exists or will be added
          toast.info(`Used ${item.name}! Restored ${item.stats.mana} Mana. (Mana not fully implemented yet)`);
        } else {
          toast.info(`Used ${item.name}! No discernable effect.`);
        }

        // Decrement stock or remove item
        if (item.stock > 1) {
          item.stock -= 1;
        } else {
          global.playerInventory = global.playerInventory.filter((i: any) => i.id !== item.id);
        }
        setInventory([...global.playerInventory]); // Trigger re-render
      } else {
        toast.error(`${item.name} is out of stock in your inventory!`);
      }
    } else {
      toast.error(`${item.name} cannot be used.`);
    }
  };

  const renderInventoryItem = (item: any) => (
    <View key={item.id} style={styles.inventoryItem}>
      <MaterialCommunityIcons name={item.icon || 'help-circle'} size={30} color="#fff" style={styles.itemIcon} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name} {item.stock && item.stock > 1 ? `(x${item.stock})` : ''}</Text>
        <Text style={styles.itemText}>Type: {item.type}</Text>
        {item.stats && (
          <Text style={styles.itemText}>
            Stats: ATK+{item.stats.attack || 0} DEF+{item.stats.defense || 0} HP+{item.stats.health || 0}
          </Text>
        )}
      </View>
      {item.type !== 'consumable' ? (
        <Pressable
          style={styles.equipButton}
          onPress={() => (
            equipment[item.type]?.id === item.id ? handleUnequip(item) : handleEquip(item)
          )}
        >
          <Text style={styles.equipButtonText}>
            {equipment[item.type]?.id === item.id ? 'Unequip' : 'Equip'}
          </Text>
        </Pressable>
      ) : (
        <Pressable
          style={styles.useButton}
          onPress={() => handleUseItem(item)}
        >
          <Text style={styles.equipButtonText}>Use</Text>
        </Pressable>
      )}
    </View>
  );

  const renderEquipmentSlot = (slotName: string, equippedItem: any) => (
    <View style={styles.equipmentSlot}>
      <Text style={styles.equipmentSlotName}>{slotName.toUpperCase()}</Text>
      {equippedItem ? (
        <View style={styles.equippedItemContainer}>
          <MaterialCommunityIcons name={equippedItem.icon || 'help-circle'} size={30} color="#fff" style={styles.itemIcon} />
          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{equippedItem.name}</Text>
            {equippedItem.stats && (
              <Text style={styles.itemText}>
                ATK+{equippedItem.stats.attack || 0} DEF+{equippedItem.stats.defense || 0} HP+{equippedItem.stats.health || 0}
              </Text>
            )}
          </View>
          <Pressable style={styles.unequipButton} onPress={() => handleUnequip(equippedItem)}>
            <Text style={styles.equipButtonText}>Unequip</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={styles.noItemText}>Empty</Text>
      )}
    </View>
  );

  const currentCalculatedStats = calculateTotalStats();

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#8A2BE2" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Text style={styles.title}>Inventory & Equipment</Text>

        {/* Player Stats Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Stats</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statText}>Level: {playerStats.level}</Text>
            <Text style={styles.statText}>XP: {playerStats.xp}</Text>
            <Text style={styles.statText}>Currency: {playerStats.currency}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statText}>Attack: {currentCalculatedStats.totalAttack}</Text>
            <Text style={styles.statText}>Defense: {currentCalculatedStats.totalDefense}</Text>
            <Text style={styles.statText}>Max Health: {currentCalculatedStats.maxHealth}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statText}>Current HP: {playerCurrentHP}</Text>
          </View>
        </View>

        {/* Equipment Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Equipment</Text>
          {renderEquipmentSlot('Weapon', equipment.weapon)}
          {renderEquipmentSlot('Armor', equipment.armor)}
          {renderEquipmentSlot('Accessory', equipment.accessory)}
        </View>

        {/* Inventory Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inventory</Text>
          {inventory.length > 0 ? (
            inventory.map(renderInventoryItem)
          ) : (
            <Text style={styles.emptyInventoryText}>Your inventory is empty.</Text>
          )}
        </View>

      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginTop: 30,
  },
  backText: {
    color: '#8A2BE2',
    fontSize: 16,
    marginLeft: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8A2BE2',
    textAlign: 'center',
    marginVertical: 20,
    textShadowColor: 'rgba(138, 43, 226, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  section: {
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  statText: {
    color: '#fff',
    fontSize: 16,
  },
  equipmentSlot: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#555',
  },
  equipmentSlotName: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  equippedItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inventoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  itemIcon: {
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemText: {
    color: '#ccc',
    fontSize: 12,
  },
  equipButton: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10,
  },
  unequipButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10,
  },
  useButton: {
    backgroundColor: '#007bff', // Blue color for Use button
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10,
  },
  equipButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noItemText: {
    color: '#ccc',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 5,
  },
  emptyInventoryText: {
    color: '#ccc',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default InventoryScreen;