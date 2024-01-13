import React from 'react';
import {Image, StyleSheet, View, Text} from 'react-native';
import {theme} from '../theme';

function NextDayItem(props) {
  return (
    <View style={[styles.container, props.style]}>
      <Image source={props.imgSource} style={styles.img} resizeMode="contain" />
      <Text style={styles.subTitle}>{props.subTitle}</Text>
      <Text style={styles.title}>{props.title}&#176;C</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.bgWhite(0.2),
    borderRadius: 16,
    marginVertical: 16,
    padding: 8,
    rowGap: 4,
  },
  img: {
    flex: 1,
    height: '50%',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '300',
    color: 'white',
  },
  title: {fontSize: 24, fontWeight: '500', color: 'white'},
});

export default NextDayItem;
