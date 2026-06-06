import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { AppColors } from '../constants/theme';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useAppTheme } from '@/src/shared/hooks/useAppTheme';

export function OfflineBanner() {
  const { colors: COLORS } = useAppTheme();
  const styles = useMemo(() => createStyles(COLORS), [COLORS]);
  const { isConnected } = useNetworkStatus();

  if (isConnected) return null;

  return (
    <Animated.View
      entering={FadeInUp.duration(300)}
      exiting={FadeOutUp.duration(300)}
      style={styles.banner}
    >
      <View style={styles.dot} />
      <Text style={styles.text}>
        You're offline
      </Text>
    </Animated.View>
  );
}

const createStyles = (COLORS: AppColors) => StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    marginTop: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.background,
  },
  text: {
    color: COLORS.background,
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
});
