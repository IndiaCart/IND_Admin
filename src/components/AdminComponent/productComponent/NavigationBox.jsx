import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Portal, Snackbar } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

const NavigationBox = ({
  onClick,
  title,
  Icon,
  navigateTo = '',
  gradientColors = ['#4c669f', '#3b5998'],
  borderColor = '#ccc',
  width = 180,
  height = 110,
  borderRadius = 12,
  textColor = '#fff',
  headerStyle,
  dispatchFun
}) => {
  const navigation = useNavigation();
  const [showSnack, setShowSnack] = useState(false);

  const handleHeaderPress = async() => {
    if (Array.isArray(onClick) && onClick.length > 0) {
      onClick.forEach(fn => {
        if (typeof fn === 'function') fn();
      });
    }
    
    if (!navigateTo) {
      setShowSnack(true);
      return;
    }
    navigation.navigate(navigateTo);
    if (dispatchFun) {
    await dispatchFun();
  }
  };


  return (
    <View style={[styles.wrapper, { width, borderColor }]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleHeaderPress}
        style={[
          styles.header,
          { height, borderRadius },
          headerStyle,
        ]}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { borderRadius }]}
        >
          {/* Coming Soon Badge */}
          {!navigateTo && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Coming Soon</Text>
            </View>
          )}

          <View style={styles.inner}>
            {Icon && <View style={styles.icon}>{Icon}</View>}
            <Text style={[styles.title, { color: textColor }]}>
              {title}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <Portal>
        <Snackbar
          visible={showSnack}
          onDismiss={() => setShowSnack(false)}
          duration={2000}
          style={styles.snack}
        >
          🎉 Stay tuned — coming soon!
        </Snackbar>
      </Portal>
    </View>
  );
};

export default NavigationBox;

const styles = StyleSheet.create({
  wrapper: {
    // borderWidth: 1.2,
    marginBottom: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  header: {
    width: '100%',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#4caf50',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  snack: {
    backgroundColor: '#4caf50',
  },
});
