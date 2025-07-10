import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import personService from './services/persons'
import Person from './components/Person'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchString, setSearchString] = useState('')
  const [statusMessage, setStatusMessage] = useState([0, null])

  const hook = () => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }
  useEffect(hook, [])

  const newPerson = (event) => {
    event.preventDefault()
    const nameExists = persons.find(person => person.name === newName)
    nameExists 
      ? changePerson(nameExists)      
      : addPerson()     
  }

  const changePerson = (nameExists) => {

    if (window.confirm(`${nameExists.name} is already added to phonebook, replace the old number with a new one?`)) {
      const personObject = {
        id: nameExists.id,
        name: nameExists.name,
        number: newNumber,
      }

      personService
        .changePerson(personObject)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id === returnedPerson.data.id ? { ...p, number: newNumber } : p))
          setNewName('')
          setNewNumber('')
          setStatusMessage([1,`Number from ${returnedPerson.data.name} changed`])
          setTimeout(() => {
            setStatusMessage([0,null])
          }, 2000)          
        }).catch(error => {
          setStatusMessage([2,`Information of ${nameExists.name} has already been removed from server`])
          setTimeout(() => {
            setStatusMessage([0,null])
          }, 2000)
          setPersons(persons.filter(p => p.id !== nameExists.id))
        })
    } else {
      setNewName('')
      setNewNumber('')
    }
  }

  const addPerson = () => {
    const personObject = {
      name: newName,
      number: newNumber,
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setStatusMessage([1,`${returnedPerson.name} added`])
        setTimeout(() => {
          setStatusMessage([0,null])
        }, 2500)
      })
  }

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    setSearchString(event.target.value)    
  }

  const personsToShow = searchString === ''
    ? persons
    : persons.filter(person => person.name.includes(searchString))

  const deletePerson = id => {
    if (window.confirm(`Delete ${persons.find(person => person.id === id).name}?`)) {
      personService
        .deletePerson(id)
        .then((returnedPerson) => {
          setPersons(persons.filter(p => p.id !== returnedPerson.id))
        })  
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification status={statusMessage[0]} message={statusMessage[1]} />
      <Filter persons={persons} searchString={searchString} setSearchString={setSearchString} handleSearch={handleSearch}/>
      <h2>add a new</h2>
      <PersonForm newPerson={newPerson} newName={newName} handlePersonChange={handlePersonChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />      
      <h2>Numbers</h2>
      
      {personsToShow.map(person => 
        <Person 
          key={person.id}
          name={person.name}
          number={person.number}
          deletePerson={() => deletePerson(person.id)}
        />
      )}
      
    </div>
  )
}

export default App
