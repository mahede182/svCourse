import React from 'react';
import { View, StyleSheet, ActivityIndicatorProps, StyleProp, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';

export interface AppActivityIndicatorProps extends ActivityIndicatorProps {
  style?: StyleProp<ViewStyle>;
}

export const AppActivityIndicator: React.FC<AppActivityIndicatorProps> = ({ size = 'small', style }) => {
  // Map standard ActivityIndicator sizes to pixel values for the Lottie animation
  const sizeMap = {
    small: 40,
    large: 80,
  };
  
  const dimension = typeof size === 'number' ? size : sizeMap[size as keyof typeof sizeMap] || 40;

  return (
    <View style={[styles.container, { width: dimension, height: dimension }, style]}>
      <LottieView
        autoPlay
        loop
        source={require('@/assets/loading-lottie.json')}
        style={styles.lottie}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
});
