const Filter = ({searchString, handleSearch}) => {

  return (
    <div>
        filter shown with
        <input 
          value={searchString}
          onChange={handleSearch} 
        />
    </div>
  )
}

export default Filter