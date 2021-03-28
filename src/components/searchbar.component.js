const SearchBar = ({onSubmit, stockSymbol, onChange, isValidStock}) => {
  return(
    <div>
      <form onSubmit={onSubmit}>
        <label>
          Name:
          <input value={stockSymbol} onChange={(event) => onChange(event)} name="name" />
        </label>
        <input type="submit" value="Submit" />
          {
          isValidStock ? null : <h4>Please enter a valid stock symbol</h4>
          }
      </form>
    </div>
  )
}

export default SearchBar;