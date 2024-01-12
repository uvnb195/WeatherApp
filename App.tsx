import React, {useCallback, useRef, useState} from 'react';
import {theme} from './theme';
import {
  Animated,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import FeatherIcons from 'react-native-vector-icons/Feather';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import DetailItem from './components/DetailItem';
import NextDayItem from './components/NextDayItem';
import {debounce} from 'lodash';
import {fetchLocations} from './api/weather';

const SEARCHBAR_HEIGHT = 50;

class City {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;

  constructor(
    id: number,
    name: string,
    region: string,
    country: string,
    lat: number,
    lon: number,
    url: string,
  ) {
    this.id = id;
    this.name = name;
    this.region = region;
    this.country = country;
    this.lat = lat;
    this.lon = lon;
    this.url = url;
  }
}

function App() {
  const [isShowSearchBar, toggleSearchBar] = useState(false);
  const [locations, addLocation] = useState<City[]>([]);

  const handleSearch = (searchValue: string) => {
    if (searchValue && searchValue.length > 2) {
      fetchLocations({cityName: searchValue}).then(data => {
        addLocation(data);
      });
    }
  };
  const handleTextDebounce = useCallback(debounce(handleSearch, 500), []);
  return (
    <View style={{position: 'relative', flex: 1}}>
      <StatusBar barStyle={'light-content'} />
      <Image
        style={styles.bgImage}
        source={require('./assets/images/bg.png')}
        resizeMode="cover"
        blurRadius={70}
      />
      <SafeAreaView style={styles.container}>
        {/* Search section */}
        <View style={{position: 'relative'}}>
          <View
            style={[
              styles.searchSection,
              {
                backgroundColor: isShowSearchBar
                  ? theme.bgWhite(0.2)
                  : 'transparent',
              },
            ]}>
            {isShowSearchBar ? (
              <TextInput
                onChangeText={handleTextDebounce}
                placeholder="Search City"
                placeholderTextColor={'lightgray'}
                style={styles.input}
              />
            ) : null}
            <TouchableOpacity
              style={styles.searchBtn}
              onPress={() => toggleSearchBar(!isShowSearchBar)}>
              <FeatherIcons
                name={'search'}
                size={32}
                color={theme.bgWhite(1)}
              />
            </TouchableOpacity>
          </View>
          {locations.length > 0 && isShowSearchBar ? (
            <View style={styles.searchList}>
              {locations.map((loc, index) => {
                const isLastIndex = index + 1 == locations.length;
                return (
                  <TouchableOpacity
                    style={[
                      styles.localtionItem,
                      !isLastIndex ? styles.borderBottom : {},
                    ]}>
                    <EntypoIcons
                      name="location-pin"
                      size={20}
                      color={theme.bgWhite(1)}
                    />
                    <Text key={index} style={styles.locationText}>
                      {loc?.name}, {loc?.country}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>
        {/* Main view section */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.mainContent}>
            <Text style={styles.contentTitle}>
              London,
              <Text style={styles.contentSubTitle}> United Kingdom</Text>
            </Text>
            <Image
              source={require(`./assets/images/sun.png`)}
              resizeMode="contain"
              style={styles.contentImg}
            />
            <Text style={styles.contentMainText}>11&#176;</Text>
            <Text style={styles.contentSubText}>Overcast</Text>
            <View style={styles.contentDetail}>
              <DetailItem
                id="1"
                imageSource={require('./assets/icons/wind.png')}
                title="20.2km"
                style={styles.detailItem}
              />
              <DetailItem
                id="2"
                imageSource={require('./assets/icons/drop.png')}
                title="87%"
                style={styles.detailItem}
              />
              <DetailItem
                id="3"
                imageSource={require('./assets/icons/sun.png')}
                title="05:14 AM"
                style={styles.detailItem}
              />
            </View>
            {/* next day section */}
            <View style={styles.nextDaySection}>
              <View style={styles.nextDayTitle}>
                <FeatherIcons name="calendar" size={24} color={'white'} />
                <Text style={styles.nextDayText}>Daily Forecase</Text>
              </View>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                <View style={styles.dailyContainer}>
                  <NextDayItem
                    imgSource={require('./assets/images/sun.png')}
                    subTitle="Friday"
                    title="11&#176;"
                    style={styles.nextDayItem}
                  />
                  <NextDayItem
                    imgSource={require('./assets/images/sun.png')}
                    subTitle="Friday"
                    title="11&#176;"
                    style={styles.nextDayItem}
                  />
                  <NextDayItem
                    imgSource={require('./assets/images/sun.png')}
                    subTitle="Friday"
                    title="11&#176;"
                    style={styles.nextDayItem}
                  />
                  <NextDayItem
                    imgSource={require('./assets/images/sun.png')}
                    subTitle="Friday"
                    title="11&#176;"
                    style={styles.nextDayItem}
                  />
                  <NextDayItem
                    imgSource={require('./assets/images/sun.png')}
                    subTitle="Friday"
                    title="11&#176;"
                    style={styles.nextDayItem}
                  />
                  <NextDayItem
                    imgSource={require('./assets/images/sun.png')}
                    subTitle="Friday"
                    title="11&#176;"
                    style={styles.nextDayItem}
                  />
                  <NextDayItem
                    imgSource={require('./assets/images/sun.png')}
                    subTitle="Friday"
                    title="11&#176;"
                    style={styles.nextDayItem}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  container: {
    position: 'relative',
    padding: 16,
    flex: 1,
    alignItems: 'center',
  },
  searchSection: {
    zIndex: 50,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 50,
    padding: 3,
  },
  input: {
    color: theme.bgWhite(1),
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginStart: 16,
  },
  searchBtn: {
    width: SEARCHBAR_HEIGHT,
    height: SEARCHBAR_HEIGHT,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.bgWhite(0.2),
  },
  searchList: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'black',
    start: 0,
    top: SEARCHBAR_HEIGHT + 3 + 8,
    borderRadius: 20,
    zIndex: 1000,
  },
  borderBottom: {
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
  },
  localtionItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  mainContent: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 500,
  },
  contentTitle: {
    width: '100%',
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
    flexWrap: 'wrap',
  },
  contentSubTitle: {
    fontWeight: 'normal',
    color: '#cccccc',
    fontSize: 18,
  },
  contentImg: {
    width: '60%',
    maxHeight: '50%',
  },
  contentMainText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 60,
    textAlign: 'center',
  },
  contentSubText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '200',
  },
  contentDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 50,
  },
  detailItem: {
    flex: 1,
  },
  nextDaySection: {
    width: '100%',
    marginTop: 20,
  },
  nextDayTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 16,
  },
  nextDayText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '300',
  },
  dailyContainer: {
    columnGap: 16,
    flexDirection: 'row',
  },
  nextDayItem: {
    width: 100,
    height: 130,
  },
});

export default App;

// add new comment test git
