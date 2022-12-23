const axios = require('axios')

exports.handler = async function(event, context) {
    console.log(event)
    const converter_url = 'https://pro-api.coinmarketcap.com/v2/tools/price-conversion'
    
    const requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: {
            'X-CMC_PRO_API_KEY': process.env.CMC_PRO_API_KEY,
        }
    };
    
    try {
        console.log('httpMethod: ', event.httpMethod)
        const body = event.queryStringParameters
        console.log(body)
        const {amount: cryptoAmount, symbol: currency, convert_id: fiat} = body
        console.log(cryptoAmount, currency, fiat)
        const fetchData = await axios.get(converter_url + `?amount=${cryptoAmount}&symbol=${currency}&convert_id=${fiat}`, requestOptions)
        .then(resp => resp.data)
        return {
            statusCode: 200,
            headers: {
                // "Access-Control-Allow-Headers": "Authorization, Content-Type",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(fetchData)
        }
    } catch (error) {
        console.error('backend catch error: ', error)
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        }
    }

}