const Filter = ({searchString, handleSearch}) => {
  return (
    <div>
      find countries
      <input
        value={searchString}
        onChange={handleSearch}
      />
    </div>
  )
}

export default Filter