import React, { useContext, useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { ThemeContext } from '../../design/ThemeContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

const ShimmerPlaceholder = ({ style }) => {
  const shimmerTranslate = useRef(new Animated.Value(-1)).current;
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerTranslate, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  }, [shimmerTranslate]);

  const translateX = shimmerTranslate.interpolate({
    inputRange: [-1, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  return (
    <View style={[styles.placeholder, style, { backgroundColor: theme.inputBackground || '#e0e0e0' }]}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

const LoginSkeleton = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.background || '#f5f5f5' }]}>
      <ShimmerPlaceholder style={styles.avatar} />
      <ShimmerPlaceholder style={styles.input} />
      <ShimmerPlaceholder style={styles.input} />
      <ShimmerPlaceholder style={styles.button} />
    </View>
  );
};

export default LoginSkeleton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  placeholder: {
    overflow: 'hidden',
    borderRadius: 12,
    marginBottom: 20,
    height: 48,
  },
  shimmer: {
    height: '100%',
    width: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 30,
  },
  input: {
    height: 45,
    borderRadius: 12,
  },
  button: {
    height: 50,
    borderRadius: 12,
    marginTop: 16,
  },
});