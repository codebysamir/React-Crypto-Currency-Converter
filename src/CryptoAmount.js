import React from 'react'

export default function CryptoAmount({currencySymbols, cryptoAmount, setCryptoAmount, setCurrency, currency, setChangeState}) {
  return (
    <div className='CryptoAmount'>
        <input className='CryptoAmount__input' type="number" value={cryptoAmount} onChange={(e) => {
            setCryptoAmount(e.target.value)
            setChangeState(true)
        }}/>
        <select className='CryptoAmount__select' defaultValue={currency} name="" id="" onChange={(e) => {
                setCurrency(e.target.value)
                setChangeState(true)
        }}>
            {currencySymbols.map(obj => (
                <option key={obj.symbol} value={obj.symbol}>{obj.symbol} - {obj.name}</option>
            ))}
        </select>
    </div>
  )
}
