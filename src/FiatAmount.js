import React from 'react'

export default function FiatAmount({fiatSymbols, amount, setAmount, setFiat, fiat, setChangeState}) {
    
  return (
    <div className='FiatAmount'>
        <input className='FiatAmount__input' type="number" value={amount} onChange={(e) => {
            setAmount(e.target.value)
            setChangeState(true)
        }}/>
        <select className='FiatAmount__select' defaultValue={fiat} name="" id="" onChange={(e) => {
            setFiat(e.target.value)
            setChangeState(true)
        }}>
            {fiatSymbols.map(obj => (
                <option key={obj.id} value={obj.id}>{obj.symbol} - {obj.name}</option>
            ))}
        </select>
    </div>
  )
}
