import * as cheerio from 'cheerio';
import CoinGecko from 'coingecko-api';



async function getPriceDatax(){
    const coins = ['bitcoin', 'xrp', 'polygon', 'stellar', 'solana', 'algorand', 'fantom', 'tron']
    const data = await fetch('https://coinmarketcap.com')

    if(data){
        const html = await data.text();
        const $ = cheerio.load(html);

        const names = []
        let i = 0;


        const trRow = '#__next > div > div.main-content > div.sc-1a736df3-0.PimrZ.cmc-body-wrapper > div > div:nth-child(1) > div.sc-f7a61dda-2.efhsPu > table > tbody > tr'
        $(trRow).each( (inx, row) => {
            let kyinx = 0;
            //console.log( $(el).text() )
            //names.push($(el).text())
            if(inx < 100){
                $(row).children().each( (chix, td) => {
                    const tdVal = $(td).text();
                    if(tdVal){
                        names.push(tdVal)
                        //console.log(tdVal)
                    }
                    if(kyinx === 1){
                        i++;
                        const cryptoNameSel = '#__next > div > div.main-content > div.sc-1a736df3-0.PimrZ.cmc-body-wrapper > div > div:nth-child(1) > div.sc-f7a61dda-2.efhsPu > table > tbody > tr:nth-child(' + i + ') > td:nth-child(3) > div > a > div > div > p'

                        const dai = '#__next > div > div.main-content > div.sc-1a736df3-0.PimrZ.cmc-body-wrapper > div > div:nth-child(1) > div.sc-f7a61dda-2.efhsPu > table > tbody > tr:nth-child(11) > td:nth-child(3) > div > a > div > div > p'


                        const priceTag = '#__next > div > div.main-content > div.sc-1a736df3-0.PimrZ.cmc-body-wrapper > div > div:nth-child(1) > div.sc-f7a61dda-2.efhsPu > table > tbody > tr:nth-child(' + i + ') > td:nth-child(4) > div > a > span'
                        //console.log($(cryptoNameSel).text())
                        //console.log($(dai).text())
                        
                        if(coins.includes($(cryptoNameSel).text())){
                            //names.push($(cryptoNameSel).text())
                            //names.push(new CoinPriceModel($(cryptoNameSel).text(), $(priceTag).text()))
                        }
                        
                        //console.log($(priceTag).text())
                    }
                    if(tdVal){
                        
                        kyinx++
                    }
                    
                } )
            }
        } )

        var p=1;
        var nn = []
        for(var x=0; x<100; x++){
            nn.push(names[p].toLowerCase())
            //console.log(nn[0])
            nn.push(names[p+1])
            if(x < 9){
                p+=9;
            }else if(x == 9){
                p=90;
            }else{
                p+=2;
            }
        }
        
        //***
        var nnn = []
        coins.map( (coin) => {
            for(var w=0; w<200; w+=2)
            if(nn[w].includes(coin)){
               nnn.push(nn[w])
            }
        })

        
        //***
        console.log(nnn)
    }
}

class CoinPriceModel{
    constructor(name, price){
        this.name = name;
        this.price = price;
    }
}

async function getPriceDataxx(){
    const data = await fetch('https://www.coingecko.com/en/all-cryptocurrencies')

    const coinsname = ['bitcoin', 'xrp', 'polygon', 'stellar', 'solana', 'algorand', 'fantom', 'tron']
    const arFinal = []
    const coins = new Set();

    if(data){
        const html = await data.text();
        const $ = cheerio.load(html);

        let p = 0;
        
        let tdVal = '';
        let tdValPr = ''
        //let trRow = '#gecko-table-all > tbody > tr:nth-child(1)'
        //let trRow = '#gecko-table-all > tbody > tr:nth-child(1) > td:nth-child(2) > div > div:nth-child(2) > a >'
        let trRow = '#gecko-table-all > tbody > tr'

        let trRowchilds = 'td:nth-child(2) > div > div:nth-child(2) > a > span:nth-child(1)'
        let prices = 'td.td-price.price.text-right.px-0.pl-2 > span'

        //let tdName = '#gecko-table-all > tbody > tr:nth-child(1) > td:nth-child(2)'
        let tdNamex = '#gecko-table-all > tbody > tr:nth-child(1) > td:nth-child(2) > div > div:nth-child(2) > a > span:nth-child(1)'
        let tdPricex = '#gecko-table-all > tbody > tr:nth-child(1) > td.td-price.price.text-right.px-0.pl-2'
        //console.log( $(trRow).text() )
        $(trRow).each( (inxz, row) => {
            let inx = inxz + 1;
            //if(p<4){
                let tdName = '#gecko-table-all > tbody > tr:nth-child(' + inx + ') > td:nth-child(2) > div > div:nth-child(2) > a > span:nth-child(1)'
                let tdPrice = '#gecko-table-all > tbody > tr:nth-child(' + inx + ') > td.td-price.price.text-right.px-0.pl-2'
                tdVal = $(tdName).text()
                tdVal = tdVal.trim()
                if(coinsname.includes(tdVal.toLowerCase())){
                    tdValPr = $(tdPrice).text()
                    
                    tdValPr = tdValPr.trim()
                    arFinal.push(new CoinPriceModel(tdVal, tdValPr))
                }
                // console.log(tdVal)
                // console.log(tdValPr)
            //}
            //p++
        })
        console.log(arFinal)  
    }
}

function func(str){
    return str == this;
}

async function getPriceData(){
    // const key = '294AD80F-08D4-41A7-A543-59B4C08F2BEF'
    // const options = {"headers": {'X-CoinAPI-Key': '294AD80F-08D4-41A7-A543-59B4C08F2BEF'}};

    // const coins = ['BTC', 'ETH', 'CELO', 'XRP', 'ALGO', 'SOL', 'XLM', 'FTM', 'MATIC']
    // let prices = []

    // for(var p=0; p<coins.length;p++){
    //     const response = await fetch('https://rest.coinapi.io/v1/exchangerate/' + coins[p] + '/SEK', options);
    //     const data = await response.json();
    //     //prices.push(data.rate.toFixed(2))
    //     prices.push( new CoinPriceModel(coins[p], data.rate.toFixed(2)) )
    // }

    //console.log(prices)

    // const response = await fetch('https://rest.coinapi.io/v1/exchangerate/BTC/SEK', options);
    // const data = await response.json();
    // console.log(data.rate)

    ///********COINGECKO
    // const CoinGeckoClient = new CoinGecko();
    // let data = await CoinGeckoClient.exchanges.fetchTickers('bitfinex', {
    //     coin_ids: ['xrp']
    // });
    // var _coinList = {};
    // var _datacc = data.data.tickers.filter(t => t.target == 'EUR');
    // [
    //     'XRP'
    // ].forEach((i) => {
    //     var _temp = _datacc.filter(t => t.base == i);
    //     var _res = _temp.length == 0 ? [] : _temp[0];
    //     _coinList[i] = _res.last;
    // })
    const CoinGeckoClient = new CoinGecko();
    //let data = await CoinGeckoClient.coins.fetch('bitcoin', {});
    //let data = await CoinGeckoClient.exchanges.list();
    
    let data = await CoinGeckoClient.simple.price({
        ids: ['bitcoin', 'ethereum', 'celo', 'algorand', 'stellar', 'solana', 'fantom', 'matic-network', 'ripple', 'tron'],
        vs_currencies: ['sek'],
    });
    console.log(data.data)
    //console.log(_coinList);


   //return prices;
}

export { getPriceData }




/*
        let p = ''
        let tn = 9

        for(var a=0; a<3; a++){
            for(var c=0; c<coins.length; c++){
                    p = names[tn]
                    
                    let s = ''
                    p = p.split('$')

                    s = p[0].slice(a, coins[c].length)
                    s = s.toLowerCase()
                    console.log(s)
                    //if(s == tss){
                    if(coins.includes(s)){
                        p = p[1].split('%')
                        console.log(s)
                        console.log(p[0])
                    }
            }
        }
*/