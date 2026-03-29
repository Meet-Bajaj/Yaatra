import { ActivityIndicator, Text, View } from 'react-native';

import { theme } from '../constants/theme';

export function LoadingView({ message = 'Loading...' }: { message?: string }) {
  return (
    <View className="bg-backgroundLight flex-1 items-center justify-center px-6">
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text className="mt-4 text-base text-surfaceDark">{message}</Text>
    </View>
  );
}
