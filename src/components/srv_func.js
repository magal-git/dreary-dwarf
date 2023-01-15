
import { supabase } from '../js/supabase_client';
import { RealtimeClient } from '@supabase/realtime-js'




function srv_trxYear(){
    const d = new Date();
    //let tyear = d.getFullYear();
    return d.getFullYear();
}

async function srv_getCoinCount(shopid){

    var coins = ['stellar', 'solana', 'fantom', 'algorand', 'celo', 'matic', 'tron', 'xrp']//GLOBAL
    const finArr = []
    const year = srv_trxYear();
    const stTbl = 'transactions' + year;
    for(var i=0; i<coins.length; i++){
        const { data } = await supabase.from(stTbl).select('*', {count: "exact"})
        .eq('shop_id', shopid)
        .eq('currency', 'sek')
        .eq('coin_type', coins[i])

        finArr.push(new CoinModel(coins[i], data.length))
        finArr.sort( (a,b) => b.amount - a.amount )
    }

    //console.log(finArr)
    return finArr
}

async function srv_getTotSaldo(shopid){
   
    const year = srv_trxYear();
    const stTbl = 'transactions' + year;
    const { data } = await supabase.from(stTbl).select()
    .eq('shop_id', shopid)
    .eq('currency', 'sek')
    //.range(from, to)
    
    //console.log(data.length)
    return data;
 }

var findcoins = [];
function srv_getCoinList(trxList){
   
    let findcoins = []
    let ofindcoins = []
    var p = 0;
    var ix = 0;
    var sal = 0;

    //trxList.map( (obj) => coinList.push(new CoinModel(trxList.obj.coin_type, trxList.obj.coin_amount)) )
    trxList.map( (obj) => {
        
        if(findcoins.includes(obj.coin_type)){
            //alert('found')
           ix = findcoins.findIndex(mysf, obj.coin_type)
           //alert(ix)
           ix++
           sal = parseFloat(findcoins[ix])
           sal += parseFloat(obj.coin_amount);
           findcoins[ix] = sal.toFixed(2)
        }else{
            //findcoins.push(new CoinModel(obj.coin_type, obj.coin_amount))
            findcoins.push(obj.coin_type, obj.coin_amount)
        }
    });
    //alert(findcoins.length)
    let m = 0;
    for(var i=0; i<findcoins.length-1; i+=2){
        m = i+1;
        ofindcoins.push(new CoinModel(findcoins[i], findcoins[m]))
    }
    //alert(ofindcoins)
    return ofindcoins;
 }

 function mysf(fc){
    //alert(this)
    return fc == this;
 }

 class CoinModel{
    constructor(name, amount) {
        this.name = name;
        this.amount = amount;
      }

 }

 async function srv_getUserBizId(token){

    var uemail;
    var uid;

    if(token != null){// token.has
        const { data, error } = await supabase.auth.getUser(token)//** ONLY FOR BUSINESS USER
        uemail = data['user']?.email;
    }
    if(uemail != null){
        const {data, error} = await supabase.from('shops').select('id')
        .eq('owner', uemail)

        if(error == null){
            uid = data[0]['id']//** SHOP_ID
            return uid;
            
        }//else
    }else{
        //window.location.href = "http://localhost:3000/login";
    }
}

async function srv_getUserFrontInfo(shopid){
    const infoArr = []
    const { data } = await supabase.from('shops').select()
    .eq('id', shopid)

    //console.log(data[0].id)
    infoArr.push(data[0].id, data[0].shop_name, data[0].shop_address, data[0].shop_orgnr, data[0].shop_subtitle,
         data[0].shop_latitud, data[0].shop_longitud, data[0].owner, data[0].shop_postalnr)
    //infoArr.push(data[0])
    return infoArr
}

//***COINGECKO OBS NOT GOOD
async function srv_getCoinPrices(){
    const list = ['ripple', 'matic-network', 'celo', 'algorand', 'stellar', 'solana', 'fantom', 'tron']//MAKE GLOBAL
    let glList = []
    for(let i=0; i<list.length; i++){
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=' + list[i] + '&vs_currencies=sek');//OK FOR NOW BUT PRICE?
        
        //const cg = await res.json();
        //glList.push(cg)
        //console.log(res.body)
    }
    //console.log(glList[0]['ripple'])
    //return glList;
}
//***

function realt(){
    // console.log('howdy')
    // const res = supabase.channel('postgres_changes')
    // .on('INSERT', (e) => console.log(e) )
    // .subscribe()

    // console.log('in realt')
    // supabase
    // .from('*')
    // .on('*', (payload) => {
    //     console.log(payload)
    // })

    var client = new RealtimeClient('ws://pdqbveeydttlvoumfxpm.supabase.co/realtime/v1')
    client.connect()

    var databaseChanges = client.channel('realtime')
    databaseChanges.on('INSERT', (e) => console.log(e))
}




 export { srv_getTotSaldo, srv_getUserBizId, srv_trxYear, srv_getCoinList, srv_getCoinPrices, srv_getCoinCount, srv_getUserFrontInfo, realt }