import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { toast } from 'sonner-native';

const ShopScreen = () => {
  const navigation = useNavigation();
  const [currency, setCurrency] = useState(global.playerStats.currency);
  const [shopItems, setShopItems] = useState([
    {
      id: 1,
      name: 'Health Potion',
      price: 100,
      description: 'Restores 50 HP',
      icon: 'flask',
      color: '#ff4444',
      type: 'consumable',
      stock: 10,
      stats: { health: 50 }
    },
    {
      id: 2,
      name: 'Mana Potion',
      price: 150,
      description: 'Restores 50 MP',
      icon: 'flask-outline',
      color: '#4444ff',
      type: 'consumable',
      stock: 8,
      stats: { mana: 50 }
    },
    {
      id: 3,
      name: 'Steel Sword',
      price: 500,
      description: '+25 Attack Power',
      icon: 'sword',
      color: '#silver',
      type: 'weapon',
      stock: 1,
      stats: { attack: 25, defense: 0, health: 0 }
    },
    {
      id: 4,
      name: 'Magic Tome',
      price: 800,
      description: '+30 Magic Power',
      icon: 'book-open-page-variant',
      color: '#purple',
      type: 'weapon',
      stock: 1,
      stats: { attack: 30, defense: 0, health: 0 }
    },
    {
      id: 5,
      name: 'Mythical Armor',
      price: 1500,
      description: '+50 Defense',
      icon: 'shield',
      color: '#gold',
      type: 'armor',
      stock: 1,
      stats: { attack: 0, defense: 50, health: 0 }
    },
    {
      id: 6,
      name: 'Amulet of Vitality',
      price: 600,
      description: '+100 Health',
      icon: 'necklace',
      color: '#greenyellow',
      type: 'accessory',
      stock: 1,
      stats: { attack: 0, defense: 0, health: 100 }
    }
  ]);

  const purchaseItem = (item: any, quantity = 1) => {
    if (item.stock === 0) {
      toast.error(`${item.name} is out of stock!`);
      return;
    }

    const totalCost = item.price * quantity;

    if (global.playerStats.currency >= totalCost) {
      global.playerStats.currency -= totalCost;
      setCurrency(global.playerStats.currency); // Update local currency state

      setShopItems(prevItems =>
        prevItems.map(i =>
          i.id === item.id ? { ...i, stock: i.stock - quantity } : i
        )
      );

      // Add item to player inventory
      const existingItemInInventory = global.playerInventory.find((i: any) => i.id === item.id);
      if (item.type === 'consumable' && existingItemInInventory) {
        existingItemInInventory.stock += quantity;
        toast.success(`Purchased ${quantity} ${item.name}(s)! Inventory updated.`);
      } else {
        // For equipment or new consumable, add a copy of the item (with quantity for consumables)
        const itemToAdd = { ...item };
        if (item.type === 'consumable') {
          itemToAdd.stock = quantity; // Set stock to purchased quantity for inventory
        } else {
          delete itemToAdd.stock; // Equipment doesn't need 'stock' in inventory
        }
        global.playerInventory.push(itemToAdd);
        toast.success(`Purchased ${quantity} ${item.name}(s)! Added to inventory.`);
      }
    } else {
      toast.error('Not enough coins!');
    }
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
        <View style={styles.currencyContainer}>
          <MaterialCommunityIcons name="coin" size={24} color="gold" />
          <Text style={styles.currencyText}>{currency}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>SHOP</Text>
        <View style={styles.itemsContainer}>
          {shopItems.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <MaterialCommunityIcons name={item.icon} size={32} color={item.color} />
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <Text style={styles.itemType}>{item.type.toUpperCase()}</Text>
              <View style={styles.priceContainer}>
                <MaterialCommunityIcons name="coin" size={16} color="gold" />
                <Text style={styles.priceText}>{item.price}</Text>
              </View>
              <Text style={styles.stockText}>Stock: {item.stock}</Text>
              <View style={styles.buyButtonsContainer}>
                <Pressable
                  style={[styles.buyButton, item.stock === 0 && styles.buyButtonDisabled]}
                  onPress={() => purchaseItem(item, 1)}
                  disabled={item.stock === 0}
                >
                  <Text style={styles.buyButtonText}>Buy 1</Text>
                </Pressable>
                {item.type === 'consumable' && item.stock > 0 && (
                  <Pressable
                    style={[styles.buyButton, styles.buyButtonMultiple, item.stock < 5 && styles.buyButtonDisabled]}
                    onPress={() => purchaseItem(item, Math.min(item.stock, 5))}
                    disabled={item.stock === 0 || item.stock < 5}
                  >
                    <Text style={styles.buyButtonText}>Buy 5</Text>
                  </Pressable>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(138, 43, 226, 0.3)',
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
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
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderRadius: 15,
  },
  currencyText: {
    color: 'gold',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  scrollView: {
    flex: 1,
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
  itemsContainer: {
    padding: 15,
  },
  itemCard: {
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#8A2BE2',
    alignItems: 'center',
  },
  itemName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  itemDescription: {
    color: '#888',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  itemType: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
    paddingVertical: 3,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(138, 43, 226, 0.5)',
    borderRadius: 5,
    fontWeight: 'bold',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 5,
    borderRadius: 10,
  },
  priceText: {
    color: 'gold',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  stockText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
    fontWeight: 'bold',
  },
  buyButtonsContainer: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'center',
    width: '100%',
  },
  buyButton: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  buyButtonMultiple: {
    backgroundColor: '#6A1BBF',
  },
  buyButtonDisabled: {
    backgroundColor: '#555',
    opacity: 0.7,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ShopScreen;