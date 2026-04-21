import React from 'react';
import { View, TextInput } from 'react-native';

export const GooglePlacesAutocomplete = (props: any) => {
  return (
    <View style={props.styles?.container}>
      <TextInput
        style={props.styles?.textInput}
        placeholder={props.placeholder}
        onChangeText={(text) => {
          // Mock trigger destination select on Web when typing
          if (text.length > 4 && props.onPress) {
            props.onPress(
              { structured_formatting: { main_text: text } },
              { geometry: { location: { lat: 19.0760, lng: 72.8777 } } }
            );
          }
        }}
        {...props.textInputProps}
      />
    </View>
  );
};
