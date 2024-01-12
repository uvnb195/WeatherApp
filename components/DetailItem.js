import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

function DetailItem(props) {
  return (
    <View style={[styles.container, props.style]}>
      <Image
        style={styles.img}
        source={props.imageSource}
        resizeMode="contain"
      />
      <Text style={styles.text} key={props.id}>
        {props.title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },
  img: {
    width: 20,
    height: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: '300',
    color: 'white',
  },
});

export default DetailItem;
