import { Feather } from "@expo/vector-icons";
import React, {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
} from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import { Colors, Fonts } from "../constants/theme";

const { width } = Dimensions.get("window");

interface FavoriteItem {
  id: number;
  name: string;
  image: string;
  price?: number;
  discount?: number;
  category?: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (item: FavoriteItem) => void;
  removeFromFavorites: (id: number) => void;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

interface ToastProps {
  message: string;
  type: "success" | "remove";
  visible: boolean;
}

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [toast, setToast] = useState<ToastProps>({
    message: "",
    type: "success",
    visible: false,
  });

  const toastTranslateY = useRef(new Animated.Value(-100)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastScale = useRef(new Animated.Value(0.8)).current;

  const showToast = useCallback(
    (message: string, type: "success" | "remove") => {
      setToast({ message, type, visible: true });

      // Reset animations
      toastTranslateY.setValue(-100);
      toastOpacity.setValue(0);
      toastScale.setValue(0.8);

      // Animate in
      Animated.parallel([
        Animated.spring(toastTranslateY, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
          tension: 50,
        }),
        Animated.timing(toastOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(toastScale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 6,
        }),
      ]).start();

      // Auto hide after 2.5s
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(toastTranslateY, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(toastOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(toastScale, {
            toValue: 0.8,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setToast((prev) => ({ ...prev, visible: false }));
        });
      }, 2500);
    },
    [],
  );

  const addToFavorites = useCallback(
    (item: FavoriteItem) => {
      setFavorites((prev) => {
        if (prev.some((fav) => fav.id === item.id)) {
          return prev;
        }
        return [...prev, item];
      });
      showToast(`${item.name} added to favorites`, "success");
    },
    [showToast],
  );

  const removeFromFavorites = useCallback(
    (id: number) => {
      const item = favorites.find((fav) => fav.id === id);
      setFavorites((prev) => prev.filter((fav) => fav.id !== id));
      if (item) {
        showToast(`${item.name} removed from favorites`, "remove");
      }
    },
    [favorites, showToast],
  );

  const isFavorite = useCallback(
    (id: number) => {
      return favorites.some((fav) => fav.id === id);
    },
    [favorites],
  );

  const toggleFavorite = useCallback(
    (item: FavoriteItem) => {
      if (isFavorite(item.id)) {
        removeFromFavorites(item.id);
      } else {
        addToFavorites(item);
      }
    },
    [isFavorite, addToFavorites, removeFromFavorites],
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}

      {/* Toast Notification */}
      {toast.visible && (
        <Animated.View
          style={[
            styles.toastContainer,
            {
              transform: [
                { translateY: toastTranslateY },
                { scale: toastScale },
              ],
              opacity: toastOpacity,
            },
          ]}
        >
          <View
            style={[
              styles.toast,
              toast.type === "success"
                ? styles.toastSuccess
                : styles.toastRemove,
            ]}
          >
            <View style={styles.toastIconContainer}>
              <Feather
                name={toast.type === "success" ? "heart" : "x"}
                size={18}
                color={Colors.white}
              />
            </View>
            <Text style={styles.toastText} numberOfLines={1}>
              {toast.message}
            </Text>
          </View>
        </Animated.View>
      )}
    </FavoritesContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: "center",
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    width: width - 40,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  toastSuccess: {
    backgroundColor: Colors.deepNavy,
  },
  toastRemove: {
    backgroundColor: Colors.gray600,
  },
  toastIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  toastText: {
    flex: 1,
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.white,
  },
});

export default FavoritesContext;
