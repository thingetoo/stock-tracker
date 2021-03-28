import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import SearchBar from './components/searchbar.component.js'
import './main.css'

const Main = () => {
  const [stockPrice, setStockPrice] = useState([]);
  const [stockTime, setStockTime] = useState([]);
  const [stockSymbol, setStockSymbol] = useState('TSLA');
  const [isValidStock, setIsValidStock] = useState(true);
  const [stockUp, setStockUp] = useState(true);

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
      console.log(responseData)
      // console.log(Object.keys(responseData))
      const openingPrices = priceConverter(Object.values(responseData))
      const times = Object.keys(responseData)
      setStockTime(times)
      setStockPrice(openingPrices)
      openingPrices[0] < openingPrices[openingPrices.length - 1] ? setStockUp(false) : setStockUp(true)
    }).catch(err => {
      setIsValidStock(false)
      console.log(err)
    })
  }

  useEffect(fetchData, []); // dependency array will cause this function to rerun if either of the values inside of it changes

  const isStockUp = stockUp ? {color: 'green'} : {color: 'red'}


  return(
    <div className='main-container'>
      <SearchBar isValidStock={isValidStock} onChange={handleChange} onSubmit={handleSubmit} stockSymbol={stockSymbol}  />
      <div className='plot'>
        <Plot
            data={
              [
                {
                  x:  stockTime,
                  y: stockPrice,
                  type: 'scatter',
                  mode: 'lines+markers',
                  marker: isStockUp,
                },
              ]
            }
            layout={{width: 1000, height: 800, title: 'Stock Data'}}
            />
      </div>
    </div>
  )
}


export default Main;