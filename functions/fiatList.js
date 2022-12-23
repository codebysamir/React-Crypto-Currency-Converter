const axios = require('axios')

exports.handler = async function(event, context) {
    
    const fiatList_url = 'https://pro-api.coinmarketcap.com/v1/fiat/map'
    
    const requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: {
            'X-CMC_PRO_API_KEY': process.env.CMC_PRO_API_KEY
        }
    };
    
    const fetchData = await axios.get(fiatList_url, requestOptions)
    .then(resp => resp.data)
    
    try {
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(fetchData)
        }
    } catch (error) {
        console.error(error)
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        }
    }

}