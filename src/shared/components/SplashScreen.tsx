import React, { useState, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import * as ExpoSplashScreen from 'expo-splash-screen';
import Animated, { FadeOut } from 'react-native-reanimated';

interface SplashScreenProps {
  children: React.ReactNode;
  isReady: boolean;
}

export function SplashScreen({ children, isReady }: SplashScreenProps) {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const animation = useRef<LottieView>(null);

  const appReady = isReady && isAnimationComplete;

  const onAnimationFinish = () => {
    setIsAnimationComplete(true);
  };

  const onAnimationLoaded = () => {
    ExpoSplashScreen.hideAsync().catch(() => {});
  };

  return (
    <View style={styles.container}>
      {children}
      
      {!appReady && (
        <Animated.View
          exiting={FadeOut.duration(300)}
          style={[StyleSheet.absoluteFill, styles.splashContainer]}
        >
          <LottieView
            ref={animation}
            autoPlay
            loop={false}
            source={require('@/assets/splash-lottie.json')}
            style={styles.lottie}
            onAnimationFinish={onAnimationFinish}
            onAnimationLoaded={onAnimationLoaded}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splashContainer: {
    backgroundColor: '#ffffff', // Matches the native splash screen background in app.json
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
});
