import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
} from "react";
import {
    Animated,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors, Fonts } from "../constants/theme";

const { width } = Dimensions.get("window");

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  isGuest: boolean;
  isAuthenticated: boolean;
  user: User | null;
  loginAsGuest: () => void;
  login: (user: User) => void;
  logout: () => void;
  showAuthPrompt: (action?: string) => void;
  hideAuthPrompt: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [isGuest, setIsGuest] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [restrictedAction, setRestrictedAction] = useState<string>("");

  const modalScale = useRef(new Animated.Value(0.8)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  const loginAsGuest = useCallback(() => {
    setIsGuest(true);
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const login = useCallback((userData: User) => {
    setIsGuest(false);
    setIsAuthenticated(true);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    setIsGuest(false);
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const showAuthPrompt = useCallback((action?: string) => {
    setRestrictedAction(action || "access this feature");
    setShowModal(true);
    modalScale.setValue(0.8);
    modalOpacity.setValue(0);

    Animated.parallel([
      Animated.spring(modalScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 65,
      }),
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const hideAuthPrompt = useCallback(() => {
    Animated.parallel([
      Animated.timing(modalScale, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowModal(false);
      setRestrictedAction("");
    });
  }, []);

  const handleSignIn = () => {
    hideAuthPrompt();
    setTimeout(() => {
      router.push("/signin");
    }, 200);
  };

  const handleRegister = () => {
    hideAuthPrompt();
    setTimeout(() => {
      router.push("/register");
    }, 200);
  };

  return (
    <AuthContext.Provider
      value={{
        isGuest,
        isAuthenticated,
        user,
        loginAsGuest,
        login,
        logout,
        showAuthPrompt,
        hideAuthPrompt,
      }}
    >
      {children}

      {/* Auth Prompt Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="none"
        onRequestClose={hideAuthPrompt}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={hideAuthPrompt}
          />
          <Animated.View
            style={[
              styles.modalContent,
              {
                opacity: modalOpacity,
                transform: [{ scale: modalScale }],
              },
            ]}
          >
            <View style={styles.modalIconContainer}>
              <Feather name="lock" size={32} color={Colors.orange} />
            </View>
            <Text style={styles.modalTitle}>Sign In Required</Text>
            <Text style={styles.modalMessage}>
              Please sign in to {restrictedAction}. Create an account to unlock
              all features and save your favorite deals!
            </Text>

            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleSignIn}
              activeOpacity={0.8}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              activeOpacity={0.8}
            >
              <Text style={styles.registerButtonText}>Create Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={hideAuthPrompt}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Continue as Guest</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(2, 16, 48, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    width: "100%",
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
  },
  modalIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.gray100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 22,
    color: Colors.deepNavy,
    marginBottom: 12,
  },
  modalMessage: {
    fontFamily: Fonts.body.regular,
    fontSize: 15,
    color: Colors.gray600,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  signInButton: {
    width: "100%",
    backgroundColor: Colors.orange,
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  signInButtonText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 15,
    color: Colors.white,
  },
  registerButton: {
    width: "100%",
    backgroundColor: Colors.deepNavy,
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: Colors.deepNavy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  registerButtonText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 15,
    color: Colors.white,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelButtonText: {
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.gray500,
  },
});
