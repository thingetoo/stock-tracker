import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import SearchBar from './components/searchbar.component.js'

const Main = () => {
  const [stockPrice, setStockPrice] = useState([]);
  const [stockTime, setStockTime] = useState([]);
  const [stockSymbol, setStockSymbol] = useState('TSLA');
  const [isValidStock, setIsValidStock] = useState(true);

  const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY

  const priceConverter = function(priceArr) {
    const result = [];
    priceArr.map(price => (
      result.push(price["1. open"])
    ))
    return result
  }

  const handleChange = event => {
    setStockSymbol(event.target.value)
  }

  const handleSubmit = event => {
    event.preventDefault()
    fetchData()
  }

  const fetchData = function() {
    axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stockSymbol}&interval=5min&apikey=${apiKey}`)
    .then(response => {
      setIsValidStock(true)
      const responseData = response.data['Time Series (5min)'];
      // console.log(Object.keys(responseData))
      const openingPrices = priceConverter(Object.values(responseData))
      const times = Object.keys(responseData)
      setStockTime(times)
      setStockPrice(openingPrices)
      console.log(Object.values(responseData))
    }).catch(err => {
      setIsValidStock(false)
      console.log(err)
    })
  }

  useEffect(fetchData, [apiKey, stockSymbol]); // only rerun if either of these change

  return(

    <div style={{position: 'absolute'}}>
      <SearchBar isValidStock={isValidStock} onChange={handleChange} onSubmit={handleSubmit} stockSymbol={stockSymbol}  />
      <Plot
          data={
            [
            {
              x:  stockTime,
              y: stockPrice,
              type: 'scatter',
              mode: 'lines+markers',
              marker: {color: 'red'},
            },
          ]
        }
          layout={{width: 1000, height: 800, title: 'Stock Data'}}
        />
    </div>
  )
}


export default Main;