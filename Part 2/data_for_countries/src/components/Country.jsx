const Country = ({country, showDetail}) => {
  return (
    <div>
      {country}
      <button onClick={showDetail}>Show</button>
    </div>
  )
}

export default Country