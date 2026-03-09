import { Stack } from 'expo-router';
import { Text } from 'react-native';
import { Container  } from '@/components/Container';
import { ScreenContent } from '@/components/ScreenContent';
import { Button } from '@/components/Button';
import { useState } from 'react';

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Stack.Screen options={{ title: 'Tab Two' }} />
      <Container>
        <Text className="text-white">{count}</Text>
        <Button title="Go to Tab One" onPress={() => {setCount(count + 1)}} />
        {/* <ScreenContent path="app/(drawer)/(tabs)/two.tsx" title="Tab Two" /> */}
      </Container>
    </>
  );
}
