import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
} from "react-native";
import { Colors } from "../constants/theme";
import { useFavorites } from "../context/FavoritesContext";

interface FavoriteItem {
  id: number;
  name: string;
  image: string;
  price?: number;
  discount?: number;
  category?: string;
}

interface FavoriteButtonProps {
  item: FavoriteItem;
  size?: number;
  style?: ViewStyle;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  item,
  size = 16,
  style,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isLiked = isFavorite(item.id);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isLiked) {
      // Bounce animation when liked
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isLiked]);

  const handlePress = () => {
    // Press animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.7,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Reset rotation
    setTimeout(() => {
      rotateAnim.setValue(0);
    }, 200);

    toggleFavorite(item);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "-15deg"],
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      style={[styles.container, isLiked && styles.containerLiked, style]}
    >
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [
              { scale: Animated.multiply(scaleAnim, bounceAnim) },
              { rotate },
            ],
          },
        ]}
      >
        {isLiked ? (
          <Ionicons name="heart" size={size} color={Colors.orange} />
        ) : (
          <Feather name="heart" size={size} color={Colors.gray500} />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  containerLiked: {
    shadowColor: Colors.orange,
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  iconContainer: {
    position: "relative",
  },
});

export default FavoriteButton;
