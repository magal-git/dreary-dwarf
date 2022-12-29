
import { supabase } from '../js/supabase_client';


function srv_trxYear(){
    const d = new Date();
    //let tyear = d.getFullYear();
    return d.getFullYear();
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


 export { srv_getTotSaldo, srv_getUserBizId, srv_trxYear, srv_getCoinList, srv_getCoinPrices }