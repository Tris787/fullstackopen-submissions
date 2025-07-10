import weatherService from '../services/weather'
import { useState, useEffect } from 'react'

const CountryDetail = ({countries, country}) => {
  const [weather, setWeather] = useState({})

    const flagStyle = {
      width: '300px'
    }

  const countryDetails = countries.filter(c => c.name.common === country)
  const lat = countryDetails[0].capitalInfo.latlng[0]
  const lng = countryDetails[0].capitalInfo.latlng[1]

  useEffect(() => {
    weatherService
      .getWeather(lat, lng)
      .then(response => {        
        setWeather({
          temperature: response.main.temp,
          wind: response.wind.speed,
          icon: response.weather[0].icon
        })
      
      })
  }, [lat, lng])


  return (
    <div>
      <h1>{countryDetails[0].name.common}</h1>
      <p>{`Capital ${countryDetails[0].capital}`}</p>
      <p>{`Area ${countryDetails[0].area}`}</p>
      <h2>{'Languages'}</h2>
      <ul>
        {Object.values(countryDetails[0].languages).map((l, index) => (
          <li key={index}>{l}</li>
        ))}
      </ul>
      <picture >
        <source srcSet={countryDetails[0].flags.svg} type="image/svg+xml" />
        <img style={flagStyle} src={countryDetails[0].flags.png} alt={`Flag from ${countryDetails[0].name.common}`} />
      </picture>
      <h2>Weather in {countryDetails[0].capital}</h2>
      <p>{`Temperature ${weather.temperature} Celsius`}</p>
      <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt='Weather-Icon'/>
      <p>{`Wind ${weather.wind} m/s`}</p>
    </div>
  )
}

export default CountryDetail
