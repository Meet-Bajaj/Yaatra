import { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export function EmptyState({ title, description, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <View className="rounded-3xl bg-white p-6 shadow-sm">
      {icon ? <View className="mb-4">{icon}</View> : null}
      <Text className="text-xl font-bold text-surfaceDark">{title}</Text>
      <Text className="mt-2 text-base leading-6 text-gray-500">{description}</Text>
      {actionLabel && onAction ? (
        <View className="mt-6">
          <Button title={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}
