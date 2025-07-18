import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Dimensions, 
  FlatList,
  StatusBar,
  Text
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

const { width } = Dimensions.get('window');

const FILTER_CATEGORIES = ['All', 'Living Room', 'Bedroom', 'Dining', 'Office', 'Storage', 'Outdoor'];

const ALL_PRODUCTS = [
  {
    id: '1',
    name: 'Modern Sectional Sofa',
    price: '$1,299',
    originalPrice: '$1,599',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    rating: 4.8,
    reviews: 124,
    category: 'Living Room',
    isNew: false,
    onSale: true
  },
  {
    id: '2',
    name: 'Scandinavian Dining Table',
    price: '$899',
    originalPrice: '$1,199',
    image: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400',
    rating: 4.9,
    reviews: 89,
    category: 'Dining',
    isNew: true,
    onSale: false
  },
  {
    id: '3',
    name: 'Luxury King Bed Frame',
    price: '$1,899',
    originalPrice: '$2,299',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400',
    rating: 4.7,
    reviews: 203,
    category: 'Bedroom',
    isNew: false,
    onSale: true
  },
  {
    id: '4',
    name: 'Ergonomic Office Chair',
    price: '$599',
    originalPrice: '$799',
    image: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400',
    rating: 4.6,
    reviews: 156,
    category: 'Office',
    isNew: false,
    onSale: true
  },
  {
    id: '5',
    name: 'Modern Coffee Table',
    price: '$449',
    originalPrice: '$549',
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400',
    rating: 4.5,
    reviews: 78,
    category: 'Living Room',
    isNew: true,
    onSale: false
  },
  {
    id: '6',
    name: 'Minimalist Bookshelf',
    price: '$329',
    originalPrice: '$429',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=400',
    rating: 4.4,
    reviews: 92,
    category: 'Storage',
    isNew: false,
    onSale: true
  },
];

export default function ExploreScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const filteredProducts = selectedCategory === 'All' 
    ? ALL_PRODUCTS 
    : ALL_PRODUCTS.filter(product => product.category === selectedCategory);

  const renderCategoryFilter = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={[
        styles.filterChip, 
        { 
          backgroundColor: selectedCategory === item ? tintColor : 'rgba(102, 126, 234, 0.1)',
          borderColor: selectedCategory === item ? tintColor : 'transparent'
        }
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text style={[
        styles.filterText, 
        { color: selectedCategory === item ? 'white' : textColor }
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderProductGrid = ({ item }: { item: typeof ALL_PRODUCTS[0] }) => (
    <TouchableOpacity style={styles.productCardGrid}>
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImageGrid} />
        {item.isNew && (
          <View style={[styles.productBadge, { backgroundColor: '#4ECDC4' }]}>
            <Text style={styles.productBadgeText}>NEW</Text>
          </View>
        )}
        {item.onSale && (
          <View style={[styles.productBadge, { backgroundColor: '#FF6B6B', top: item.isNew ? 40 : 12 }]}>
            <Text style={styles.productBadgeText}>SALE</Text>
          </View>
        )}
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={18} color="#666" />
        </TouchableOpacity>
      </View>
      <View style={styles.productInfoGrid}>
        <Text style={styles.productNameGrid}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.reviewText}>({item.reviews})</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{item.price}</Text>
          {item.onSale && (
            <Text style={styles.originalPrice}>{item.originalPrice}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderProductList = ({ item }: { item: typeof ALL_PRODUCTS[0] }) => (
    <TouchableOpacity style={styles.productCardList}>
      <Image source={{ uri: item.image }} style={styles.productImageList} />
      <View style={styles.productInfoList}>
        <View style={styles.productHeader}>
          <Text style={styles.productNameList}>{item.name}</Text>
          <TouchableOpacity style={styles.favoriteButtonSmall}>
            <Ionicons name="heart-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.reviewText}>({item.reviews})</Text>
        </View>
        <View style={styles.tagsContainer}>
          {item.isNew && (
            <View style={[styles.tag, { backgroundColor: '#4ECDC4' }]}>
              <Text style={styles.tagText}>New</Text>
            </View>
          )}
          {item.onSale && (
            <View style={[styles.tag, { backgroundColor: '#FF6B6B' }]}>
              <Text style={styles.tagText}>Sale</Text>
            </View>
          )}
          <View style={[styles.tag, { backgroundColor: '#E8F4F8' }]}>
            <Text style={[styles.tagText, { color: '#2A2A2A' }]}>{item.category}</Text>
          </View>
        </View>
        <View style={styles.priceContainerList}>
          <Text style={styles.priceList}>{item.price}</Text>
          {item.onSale && (
            <Text style={styles.originalPriceList}>{item.originalPrice}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Explore Furniture</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.searchButton}>
              <Ionicons name="search-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.viewToggle}
              onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              <Ionicons 
                name={viewMode === 'grid' ? 'list-outline' : 'grid-outline'} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.searchBarContainer}>
          <TouchableOpacity style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#666" />
            <Text style={styles.searchPlaceholder}>Search products...</Text>
            <Feather name="filter" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Filters */}
      <View style={styles.filtersSection}>
        <FlatList
          data={FILTER_CATEGORIES}
          renderItem={renderCategoryFilter}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={[styles.resultsText, { color: textColor }]}>
          {filteredProducts.length} Products Found
        </Text>
        <TouchableOpacity style={styles.sortButton}>
          <Text style={[styles.sortText, { color: tintColor }]}>Sort by</Text>
          <Ionicons name="chevron-down" size={16} color={tintColor} />
        </TouchableOpacity>
      </View>

      {/* Products */}
      <FlatList
        data={filteredProducts}
        renderItem={viewMode === 'grid' ? renderProductGrid : renderProductList}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode} // Force re-render when viewMode changes
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.productsList,
          { paddingBottom: 100 }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewToggle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarContainer: {
    marginTop: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  filtersSection: {
    paddingVertical: 16,
  },
  filtersList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    fontSize: 14,
    fontWeight: '600',
  },
  productsList: {
    paddingHorizontal: 20,
  },
  // Grid View Styles
  productCardGrid: {
    flex: 1,
    margin: 8,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  productImageContainer: {
    position: 'relative',
  },
  productImageGrid: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  productBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  productBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productInfoGrid: {
    padding: 12,
  },
  productNameGrid: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2A2A2A',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2A2A2A',
  },
  reviewText: {
    fontSize: 10,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  // List View Styles
  productCardList: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  productImageList: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 16,
  },
  productInfoList: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productNameList: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A2A2A',
    flex: 1,
    marginRight: 8,
  },
  favoriteButtonSmall: {
    padding: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  priceContainerList: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceList: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
  },
  originalPriceList: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
});
