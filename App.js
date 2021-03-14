import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import {WeatherInfo} from './components/WeatherInfo';
import {UnitsPicker} from './components/UnitsPicker'



const WEATHER_API_KEY = '97c145b30812ec20c4a13c505d68dd1e'
const BASE_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?'

export default function App() {

  const [errorMessage, setErrorMessage] = useState(null)
  const [currentWeather, setCurrentWeather] = useState(null)
  const [unitSystem, setUnitSystem] = useState('metric')

  useEffect(() =>{
    load()
  }, [])

  async function load(){
    try {
      let { status } = await Location.requestPermissionsAsync()
      if(status != 'granted'){
        setErrorMessage('Access to location is needed to run the app')
        return 
      }
      const location = await Location.getCurrentPositionAsync()
      const {latitude, longitude} = location.coords
      const weatherURL = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitSystem}&appid=${WEATHER_API_KEY}`
      const response = await fetch(weatherURL)
      const result = await response.json()

      if(response.ok){
        setCurrentWeather(result)
      }else{
        setErrorMessage(result.message)
      }
      
      //alert(`Latitude : ${latitude}, Longitude : ${longitude}`)

    } catch (error) {
      setErrorMessage(error.message)
    }
  }
  if(currentWeather){
    
    
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.main}>
          <UnitsPicker />
          <WeatherInfo currentWeather={currentWeather} />
        </View>
      </View>
    );
  }else{
    return(
      <View style={styles.container}>
        <Text>{errorMessage}</Text>
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems : 'center',
  },
  main: {
    justifyContent : 'center',
    alignItems: 'center',
    alignSelf: 'center'
  }
});
