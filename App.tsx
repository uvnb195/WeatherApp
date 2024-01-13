import React, {useCallback, useEffect, useRef, useState} from 'react';
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
import {debounce, delay} from 'lodash';
import {fetchForeCast, fetchLocations} from './api/weather';
import {Host, Portal} from 'react-native-portalize';
import {WeatherDetail} from './api/data';
import moment, {locale} from 'moment';
import {weatherImages} from './constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Progress from 'react-native-progress';

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
  useEffect(() => {
    fetchMyWeatherData();
  }, []);
  const [isShowSearchBar, toggleSearchBar] = useState(false);
  const [locations, setLocations] = useState<City[]>([]);
  const [location, setLocation] = useState<City>();
  const [weather, setWeather] = useState<WeatherDetail>();
  const [loading, toggleLoading] = useState(true);

  const handleSearch = (searchValue: string) => {
    if (searchValue && searchValue.length > 2) {
      fetchLocations({cityName: searchValue}).then(data => {
        setLocations(data);
      });
    }
  };

  const handleLocation = (value: City) => {
    toggleLoading(true);
    toggleSearchBar(false);
    setLocations([]);
    setLocation(value);
    fetchForeCast({
      cityName: value.name,
      numOfNextDays: 7,
    }).then(data => {
      setWeather(prevState => data);
      AsyncStorage.setItem('city', value.name);
    });
    setTimeout(() => {
      toggleLoading(false);
    }, 1000);
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 500), []);

  const fetchMyWeatherData = async () => {
    toggleLoading(true);
    let myCity = await AsyncStorage.getItem('city');
    let cityName = myCity ? myCity : 'Da Nang';
    fetchLocations({cityName});
    fetchForeCast({
      cityName,
      numOfNextDays: 7,
    }).then(data => {
      setWeather(prevState => data);
    });
    setTimeout(() => {
      toggleLoading(false);
    }, 1000);
  };
  return (
    <Host>
      <View
        style={{
          position: 'relative',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <StatusBar barStyle={'light-content'} />
        <Image
          style={styles.bgImage}
          source={require('./assets/images/bg.png')}
          resizeMode="cover"
          blurRadius={70}
        />

        {loading ? (
          <Progress.CircleSnail color={'#d5b60a'} size={70} thickness={4} />
        ) : (
          <SafeAreaView style={styles.container}>
            {/* Search section */}
            <View style={{position: 'relative', alignItems: 'center'}}>
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
                    name={isShowSearchBar ? 'x' : 'search'}
                    size={32}
                    color={theme.bgWhite(1)}
                  />
                </TouchableOpacity>
              </View>
              {locations.length > 0 && isShowSearchBar ? (
                <Portal>
                  <View style={styles.searchListContainer}>
                    <View style={styles.searchList}>
                      {locations.map((loc, index) => {
                        const isLastIndex = index + 1 == locations.length;
                        return (
                          <TouchableOpacity
                            style={[
                              styles.localtionItem,
                              !isLastIndex ? styles.borderBottom : {},
                            ]}
                            onPress={() => handleLocation(loc)}
                            key={index}>
                            <EntypoIcons name="location-pin" size={20} />
                            <Text style={styles.locationText}>
                              {loc?.name},
                              <Text style={styles.countryText}>
                                {' '}
                                {loc?.country}
                              </Text>
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                </Portal>
              ) : null}
            </View>
            {/* Main view section */}
            <View style={styles.mainContent}>
              <Text style={styles.contentTitle}>
                {`${
                  (weather?.location.name.length &&
                    weather.location.name.length >= 15) ||
                  (weather?.location.country.length &&
                    weather.location.country.length >= 15)
                    ? weather?.location?.name + ',\n'
                    : weather?.location?.name + ','
                }`}
                <Text style={styles.contentSubTitle}>
                  {' ' + weather?.location?.country}
                </Text>
              </Text>
              <Image
                source={
                  weatherImages[weather?.current?.condition?.text || 'other'] ||
                  weatherImages['other']
                }
                resizeMode="contain"
                style={styles.contentImg}
              />
              <Text style={styles.contentMainText}>
                {weather?.current.temp_c}&#176;C
              </Text>
              <Text style={styles.contentSubText}>
                {weather?.current?.condition?.text}
              </Text>
              <View style={styles.contentDetail}>
                <DetailItem
                  id="1"
                  imageSource={require('./assets/icons/wind.png')}
                  title={weather?.current.wind_kph + ' km'}
                  style={styles.detailItem}
                />
                <DetailItem
                  id="2"
                  imageSource={require('./assets/icons/drop.png')}
                  title={weather?.current.humidity + ' %'}
                  style={styles.detailItem}
                />
                <DetailItem
                  id="3"
                  imageSource={require('./assets/icons/sun.png')}
                  title={weather?.forecast.forecastday[0].astro.sunrise}
                  style={styles.detailItem}
                />
              </View>
              {/* next day section */}
              <View style={styles.nextDaySection}>
                <View style={styles.nextDayTitle}>
                  <FeatherIcons name="calendar" size={24} color={'white'} />
                  <Text style={styles.nextDayText}>Next 7 Days</Text>
                </View>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  <View style={styles.dailyContainer}>
                    {weather?.forecast?.forecastday.map((item, index) => {
                      const dateMoment = moment(item.date);
                      const dayOfWeek = dateMoment.format('dddd');

                      return index === 0 ? null : (
                        <NextDayItem
                          key={index}
                          imgSource={
                            weatherImages[item.day.condition.text] ||
                            weatherImages['other']
                          }
                          subTitle={index == 1 ? 'Tomorrow' : dayOfWeek}
                          title={item.day.avgtemp_c}
                          style={styles.nextDayItem}
                        />
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            </View>
          </SafeAreaView>
        )}
      </View>
    </Host>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  loading: {
    width: 50,
    height: 50,
  },
  container: {
    position: 'relative',
    padding: 16,
    flex: 1,
    alignItems: 'center',
  },
  searchSection: {
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
  searchListContainer: {
    alignItems: 'center',
  },
  searchList: {
    position: 'absolute',
    width: '90%',
    backgroundColor: '#d3d3d3',
    top: 75,
    borderRadius: 20,
  },
  borderBottom: {
    borderBottomColor: '#9a9a9a',
    borderBottomWidth: 1,
  },
  localtionItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 20,
  },
  countryText: {
    fontWeight: '300',
    fontSize: 16,
  },
  mainContent: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    rowGap: 16,
    marginTop: 16,
  },
  contentTitle: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
    flexWrap: 'wrap',
  },
  contentSubTitle: {
    fontWeight: 'normal',
    color: '#cccccc',
    fontSize: 20,
  },
  contentImg: {
    height: 200,
    maxWidth: '50%',
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
    paddingHorizontal: 16,
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
