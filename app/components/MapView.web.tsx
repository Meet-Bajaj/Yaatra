import React from 'react';
import { View, Text } from 'react-native';

export const PROVIDER_DEFAULT = 'default';
export const Marker = ({ children }: any) => <>{children}</>;

export default function MapView(props: any) {
  return (
    <View style={[{ flex: 1, backgroundColor: '#e5e5e5', justifyContent: 'center', alignItems: 'center' }, props.style]}>
      <Text>Maps are not supported on Web in this demo.</Text>
    </View>
  );
}
