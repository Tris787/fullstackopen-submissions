import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import countryService from './services/country'
import Notification from './components/Notification'
import Country from './components/Country'
import CountryDetail from './components/CountryDetail'

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchString, setSearchString] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    countryService
      .getAll()
      .then(response => {
        setCountries(response)
      })
  }, [])
  
  console.log(countries)

  const countryNames = countries.map(c => c.name.common)    
  const filteredCountries = countryNames.filter(c => c.toLowerCase().includes(searchString))   
  const countriesToShow = filteredCountries.length < 10 ? filteredCountries : []


  const statusMessage = searchString.length > 0 && filteredCountries.length > 10
    ? 'Too many matches, specify another filter'
    : '';

  const handleSearch = (event) => {    
    setSearchString(event.target.value)
    setSelectedCountry(null)  
  }

  const showDetail = (country) => {
    setSelectedCountry(country)
  }

  return (
    <div>
      <Filter searchString={searchString} handleSearch={handleSearch} />
      <Notification message={statusMessage} />
      { countriesToShow.length !==1 
        ? countriesToShow.map(c =>
          <Country key={c} country={c} showDetail={() => showDetail(c)}/>
        )
        : <CountryDetail countries={countries} country={countriesToShow[0]}/>
      }
      {selectedCountry && <CountryDetail countries={countries} country={selectedCountry} />}
    </div>
  )
}

export default App
