const Person = ({ name, number, deletePerson }) => {
  return (    
      <div>
        <p style={{margin:0, display:"inline"}}>{name} {number}</p>
        <button onClick={deletePerson}>delete</button>
      </div>    
  )
}

export default Person