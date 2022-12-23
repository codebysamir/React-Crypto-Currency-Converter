import {useEffect, useState} from 'react'
import CryptoAmount from './CryptoAmount';
import FiatAmount from './FiatAmount';
import './css/app.css'
import axios from 'axios'
  
  const ENUM = {
    FIAT_TO_CRYPTO: 'Fiat to Crypto',
    FIAT_TO_FIAT: 'Fiat to Fiat',
    CRYPTO_TO_CRYPTO: 'Crypto to Crypto'
  }

function App() {
  const [fiatSymbols, setFiatSymbols] = useState([])
  const [fiat, setFiat] = useState('2781')
  const [fiat2, setFiat2] = useState('2785')
  const [currencySymbols, setCurrencySymbols] = useState([])
  const [currency, setCurrency] = useState('BTC')
  const [currency2, setCurrency2] = useState('ETH')
  const [amount, setAmount] = useState(1)
  const [fiatAmount2, setFiatAmount2] = useState(1)
  const [cryptoAmount, setCryptoAmount] = useState(1)
  const [cryptoAmount2, setCryptoAmount2] = useState(1)
  const [changeState, setChangeState] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState(ENUM.FIAT_TO_CRYPTO)

// Get Top 50 Fiat List from API
  useEffect(() => {
    const controller = new AbortController()
    
    axios.get('/.netlify/functions/fiatList', {signal: controller.signal})
      .then(async response => {
        if (response.status === 200) {
          const result = await response.data
          const dataList = result.data
          setFiatSymbols(dataList)
          console.log('FiatList Loaded')
        } else {
          setError(response.status + ': API couldnt load')
        }
      })
      .catch(error => {
        if (axios.isCancel(error)) {
          console.log('axios cancelled!', error.message)
        } else {
          console.log('error', error);
        }
      })

  return () => {
    console.log('cleanUp');
    controller.abort()
    setError('')
  }
  }, [])

// Get Top 50 Crypto List from API
  useEffect(() => {
    const cancelToken = axios.CancelToken.source()

    axios.get('/.netlify/functions/cryptoList', {cancelToken: cancelToken.token})
      .then(async response => {
        if (response.status === 200) {
          const result = await response.data
          const dataList = result.data
          setCurrencySymbols(dataList)
          console.log('CryptoList Loaded')
        } else {
          setError(response.status + ': API couldnt load')
        }
      })
      .catch(error => {
        if (axios.isCancel(error)) {
          console.log('axios cancelled!', error.message)
        } else {
          console.log('error', error);
        }
      })

    return () => {
      setError('')
      cancelToken.cancel()
    }
  }, [])

// Convert Fiat to Crypto via API
  useEffect(() => {
    const cancelToken = axios.CancelToken.source()

    if (!changeState) return
    if (filter === ENUM.FIAT_TO_CRYPTO) {
      axios.get('/.netlify/functions/fiatToCrypto', {params: {amount: amount, convertFrom: fiat, convertTo: currency}}, 
      {cancelToken: cancelToken.token})
        .then(async response => {
          if (response.status === 200) {
            const result = await response.data
            setCryptoAmount(result.data.quote[currency].price)
            setChangeState(false)
            console.log('fiat to crypto');
          } else {
            setError(response.status + ': API couldnt load')
          }
        })
        .catch(error => {
          if (axios.isCancel(error)) {
            console.log('axios cancelled!', error.message)
          } else {
            console.log('error', error);
          }
        })

    // Convert Fiat to Fiat2 via API
    } else if (filter === ENUM.FIAT_TO_FIAT) {
      axios.get(`/.netlify/functions/fiatToFiat2?amount=${amount}&id=${fiat}&convert_id=${fiat2}`, 
      {cancelToken: cancelToken.token})
      .then(async response => {
        if (response.status === 200) {
          const result = await response.data
          setFiatAmount2(result.data.quote[fiat2].price)
          setChangeState(false)
        } else {
          setError(response.status + ': API couldnt load')
        }
      })
      .catch(error => {
        if (axios.isCancel(error)) {
          console.log('axios cancelled!', error.message)
        } else {
          console.log('error', error);
        }
      })
    }
    

    return () => {
      setError('')
      cancelToken.cancel()
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, fiat])

// Convert Fiat2 to Fiat via API
  useEffect(() => {
    const cancelToken = axios.CancelToken.source()

    if (!changeState) return
    axios.get(`/.netlify/functions/fiat2ToFiat?amount=${fiatAmount2}&id=${fiat2}&convert_id=${fiat}`, 
    {cancelToken: cancelToken.token})
      .then(async response => {
        if (response.status === 200) {
          const result = await response.data
          setAmount(result.data.quote[fiat].price)
          setChangeState(false)
        } else {
          setError(response.status + ': API couldnt load')
        }
      })
      .catch(error => {
        if (axios.isCancel(error)) {
          console.log('axios cancelled!', error.message)
        } else {
          console.log('error', error);
        }
      })

    return () => {
      setError('')
      cancelToken.cancel()
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fiatAmount2, fiat2])

// Convert Crypto to Fiat via API
  useEffect(() => {
    const cancelToken = axios.CancelToken.source()

    if (!changeState) return
    if (filter === ENUM.FIAT_TO_CRYPTO) {
      axios.get(`/.netlify/functions/cryptoToFiat?amount=${cryptoAmount}&symbol=${currency}&convert_id=${fiat}`, 
      {cancelToken: cancelToken.token})
      .then(async response => {
        if (response.status === 200) {
          const result = await response.data
          setAmount(result.data[0].quote[fiat].price)
          setChangeState(false)
        } else {
          setError(response.status + ': API couldnt load')
        }
      })
      .catch(error => {
        if (axios.isCancel(error)) {
          console.log('axios cancelled!', error.message)
        } else {
          console.log('error', error);
        }
      })

    // Convert Crypto to Crypto2 via API
    } else if (filter === ENUM.CRYPTO_TO_CRYPTO) {
      // fetch(converter_url + `?amount=${cryptoAmount}&symbol=${currency}&convert=${currency2}`, requestOptions, {signal})
      axios.get(`/.netlify/functions/cryptoToCrypto2?amount=${cryptoAmount}&symbol=${currency}&convert=${currency2}`, 
      {cancelToken: cancelToken.token})
      .then(async response => {
        if (response.status === 200) {
          const result = await response.data
          setCryptoAmount2(result.data[0].quote[currency2].price)
          setChangeState(false)
        } else {
          setError(response.status + ': API couldnt load')
        }
      })
      .catch(error => {
          if (axios.isCancel(error)) {
            console.log('axios cancelled!', error.message)
          } else {
            console.log('error', error);
          }
        })
    }
    

    return () => {
      setError('')
      cancelToken.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cryptoAmount, currency])

  // Convert Crypto2 to Crypto via API
  useEffect(() => {
    const cancelToken = axios.CancelToken.source()

    if (!changeState) return
    axios.get(`/.netlify/functions/crypto2ToCrypto?amount=${cryptoAmount2}&symbol=${currency2}&convert=${currency}`, 
    {cancelToken: cancelToken.token})
      .then(async response => {
        if (response.status === 200) {
          const result = await response.data
          setCryptoAmount(result.data[0].quote[currency].price)
          setChangeState(false)
        } else {
          setError(response.status + ': API couldnt load')
        }
      })
      .catch(error => {
        if (axios.isCancel(error)) {
          console.log('axios cancelled!', error.message)
        } else {
          console.log('error', error);
        }
      })

    return () => {
      setError('')
      cancelToken.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cryptoAmount2, currency2])

  function handleAmountInput(a) {
    setAmount(a)
  }
  
  function handleCryptoAmountInput(a) {
    setCryptoAmount(a)
  }
 
  function handleCurrencySelection(c) {
    setCurrency(c)
  }

  function handleFiatSelection(f) {
    setFiat(f)
  }
  function handleToFiatAmountInput(a) {
    setFiatAmount2(a)
  }
  
  function handleFromCryptoAmountInput(a) {
    setCryptoAmount2(a)
  }
 
  function handleCurrencySelection2(c) {
    setCurrency2(c)
  }

  function handleFiatSelection2(f) {
    setFiat2(f)
  }
  function handleChangeState(s) {
    setChangeState(s)
  }

  function handleFilterState(f) {
    switch (f) {
      case ENUM.FIAT_TO_CRYPTO:
        setFilter(ENUM.FIAT_TO_CRYPTO)
        break;
      case ENUM.FIAT_TO_FIAT:
        setFilter(ENUM.FIAT_TO_FIAT)
        break;
      case ENUM.CRYPTO_TO_CRYPTO:
        setFilter(ENUM.CRYPTO_TO_CRYPTO)
        break;
    
      default:
        break;
    }
  }

  return (
    <>
      <div className='crypto-converter'>
        <h2 className='crypto-converter__title'>Cryptocurrency Converter</h2>
        {error !== '' && <span className='error'>{error}</span>}
        <div className="filter">
          <span 
            className={'filter__item' + (filter === ENUM.FIAT_TO_CRYPTO ? ' active' : '')} 
            onClick={e => handleFilterState(e.target.textContent)}
          >Fiat to Crypto
          </span>
          <span 
            className={'filter__item' + (filter === ENUM.FIAT_TO_FIAT ? ' active' : '')} 
            onClick={e => handleFilterState(e.target.textContent)}
          >Fiat to Fiat
          </span>
          <span 
            className={'filter__item' + (filter === ENUM.CRYPTO_TO_CRYPTO ? ' active' : '')} 
            onClick={e => handleFilterState(e.target.textContent)}
          >Crypto to Crypto
          </span>
        </div>
        {filter === ENUM.FIAT_TO_CRYPTO || filter === ENUM.FIAT_TO_FIAT ? 
        <FiatAmount 
          fiatSymbols={fiatSymbols} 
          amount={amount} 
          setAmount={handleAmountInput} 
          setFiat={handleFiatSelection}
          setChangeState={handleChangeState}
        /> : 
        <CryptoAmount
          currencySymbols={currencySymbols} 
          cryptoAmount={cryptoAmount2}
          setCryptoAmount={handleFromCryptoAmountInput}
          currency={currency2}
          setCurrency={handleCurrencySelection2}
          setChangeState={handleChangeState}
        />
        }
        {filter === ENUM.FIAT_TO_CRYPTO || filter === ENUM.CRYPTO_TO_CRYPTO ?
        <CryptoAmount
          currencySymbols={currencySymbols} 
          cryptoAmount={cryptoAmount}
          setCryptoAmount={handleCryptoAmountInput}
          setCurrency={handleCurrencySelection}
          setChangeState={handleChangeState}
        /> :
        <FiatAmount 
          fiatSymbols={fiatSymbols} 
          amount={fiatAmount2} 
          setAmount={handleToFiatAmountInput} 
          setFiat={handleFiatSelection2}
          fiat={fiat2}
          setChangeState={handleChangeState}
        />
        }
      </div>
    </>
  );
}

export default App;
