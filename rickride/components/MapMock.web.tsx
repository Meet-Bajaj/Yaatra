import React, { useImperativeHandle } from 'react';
import { View, Text } from 'react-native';

export const Marker = (props: any) => <View {...props} />;
export const Polyline = (props: any) => <View {...props} />;
export const Circle = (props: any) => <View {...props} />;

const MapView = React.forwardRef((props: any, ref) => {
  useImperativeHandle(ref, () => ({
    animateToRegion: () => {},
    animateCamera: () => {},
    fitToElements: () => {},
    fitToCoordinates: () => {},
    setCamera: () => {},
  }));

  return (
    <View style={[{ backgroundColor: '#242f3e', justifyContent: 'center', alignItems: 'center' }, props.style]}>
      <Text style={{ color: '#9ca5b3' }}>Interactive Map (Simulated on Web)</Text>
      {props.children}
    </View>
  );
});

export { MapView };
export default MapView;
