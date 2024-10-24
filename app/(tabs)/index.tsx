import { useState, useEffect } from 'react';
import { Image, StyleSheet, Platform } from 'react-native';
import * as Location from 'expo-location';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

let apiKey = 'AIzaSyB54L8rSygKiBl0OgTQHk6Rs_ocdEwKyRI';

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [hotels, setHotels] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      Location.setGoogleApiKey(apiKey);
      let location = await Location.getCurrentPositionAsync({});
      let regionName = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setLocation(regionName);

      axios({
        method: 'get',
        url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.coords.latitude},${location.coords.longitude}&radius=5000&type=lodging&key=${apiKey}
`,
        responseType: 'json'
      })
        .then((res) => {
          console.log(res)
          setHotels(res.data.results);
        });
    })();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Ionicons size={310} name="bed-outline" style={styles.headerImage} color="white" />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Hotels Nearby</ThemedText>
      </ThemedView>
      {
        hotels && hotels.map((datum) => (
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="title">{datum.name}</ThemedText>
          <ThemedView style={styles.ratingContainer}>
            <ThemedText type="subtitle">{datum.rating || 0}</ThemedText>
            <Ionicons size={25} name="star" color="gold" />
            <ThemedText type="subtitle">{`(${datum.user_ratings_total || 0})`}</ThemedText>
          </ThemedView>
          <ThemedText type="subtitle">{datum.vicinity}</ThemedText>
        </ThemedView>
        ))
      }
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
});
