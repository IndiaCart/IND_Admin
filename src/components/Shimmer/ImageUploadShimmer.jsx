import React, { useContext, useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { ThemeContext } from '../../design/ThemeContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

const ShimmerBox = ({ boxStyle }) => {
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
  }, []);

  const translateX = shimmerTranslate.interpolate({
    inputRange: [-1, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  return (
    <View
      style={[
        styles.placeholder,
        boxStyle,
        {
          backgroundColor: theme.inputBackground || '#e0e0e0',
        },
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

const ImageUploadShimmer = ({ style }) => {
  const { theme } = useContext(ThemeContext);

  const finalBoxStyle = {
    width: style?.width || 100,
    height: style?.height || 100,
    borderRadius: 12,
    marginRight: 12,
    marginBottom: 12,
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background || '#f5f5f5',
          flexDirection: 'row',
          flexWrap: 'wrap',
        },
      ]}
    >
      {[...Array(4)].map((_, index) => (
        <ShimmerBox key={index} boxStyle={finalBoxStyle} />
      ))}
    </View>
  );
};

export default ImageUploadShimmer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingVertical: 8,
  },
  placeholder: {
    overflow: 'hidden',
  },
  shimmer: {
    height: '100%',
    width: 150,
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 12,
  },
});
