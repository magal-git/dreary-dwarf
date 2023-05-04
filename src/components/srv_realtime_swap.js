import { supabase } from '../js/supabase_client';

//https://supabase.com/docs/guides/realtime/postgres-changes
export function what(){
    console.log('swap')
}


//**************************************************************************
//**************************** USER_SWAP ***********************************
//*********************************V****************************************

const channel = supabase
  .channel('schema-db-changes')
  .on(
    'postgres_changes',
    {
        event: 'INSERT',
        schema: 'public',
        table: 'user_swap',
    },
      (payload) => {
        //console.log(payload)

        //**DATA
        //get swap amount in fiat
        var amou = payload.new['swap_amount']//fiat
        //get from coin_name ( ex. celo)
        var from_coin = payload.new['from_coin']//**ex. celo
        //get to coin_name ( ex. algo)
        var to_coin = payload.new['to_coin']//**ex. algo
        //where should we send the swaped amount
        var to_addr = payload.new['respond_to_addr']
        //get the swap id
        var swapid = payload.new['id']
        
        //to whom, just for security
        var usid = payload.new['user_id']
        
        respondSwap(/*from_coin,*/ amou, to_coin, to_addr, swapid)//!why from_coin??        

      }
    )
    .subscribe()

//**************************************************************************
//******************************** END *************************************
//**************************************************************************
//!write swap success trxid to user_swap where id = swap_id
async function respSuccess(swid, txid){
  const { error } = await supabase
  .from('user_swap')
  .update({ response_successTrxid: txid})
  .eq('id', swid)

  if(error == null){
    return 'swap ok'
  }else{
    return 'swap err'
  }
}
//!write swap to transaction db
async function writeToDb(hash, to, sender, amount, currency, to_coin, coin_amount){
  var stdate = new Date()
  var year = stdate.getFullYear()

  var trxtbl = 'transactions' + year
  console.log(trxtbl)

  const { error } = await supabase
  .from(trxtbl)
  .insert(
    { trx_hash: hash, to_receiver: to, sender_id: sender, amount: amount, currency: currency, coin_type: to_coin, coin_amount: coin_amount, shop_id: '-2'
    });

  if(error == null){
    console.log('cpay write to db')
    return 'swap ok'
  }else{
    console.log('cpay ERR to db')
    return 'swap err'
  }
}
//? ////////////////////////////////////////////////////////////////////////


async function respondSwap(amou, to_coin, to_addr, swapid){

  switch (to_coin) {
    case 'algorand':
     
   ////TODO Switch case: coin type
   //// get "from coin" rate - 1 sek = 0.1379 celo - #ex. 1 celo = 7.25 sek
   //// get "to coin" rate - 1 sek = 0.4082 algo - #ex. 1 algo = 2.45 sek
   //? calculation: fiat(1 sek)/coin_rate(algo 2.45) = algo to send
   //? algo to send = ( 0.4082 alg0)
   const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=algorand&vs_currencies=sek');
   const datax = await res.json()
   const rate = datax['algorand']['sek']
   
   var algo_toSend = amou / rate

   //***FETCH ***************************************************
   const send_url = "https://api-eu1.tatum.io/v3/algorand/transaction";

   var headers = {
       'x-api-key': 'e0734a47-73c1-4e2f-86e4-0a54822a48e4',
       'Content-Type': 'application/json'
   };
   var cpayalgopub = 'H4Z3Y4KV54QDJYLC2AJQZSPH57HQA4LPGETK3NCK2BN6VSAIAVIRYRIHVY'
   var query = 
       {
       "from": 'H4Z3Y4KV54QDJYLC2AJQZSPH57HQA4LPGETK3NCK2BN6VSAIAVIRYRIHVY',//cpay algorand pubaddr
       "to": to_addr,
       "fee": "0.001",
       "amount": algo_toSend,//algo to send
       "fromPrivateKey": '7RGFSLZAXCYZKPVFWCXMNO7CORJKXC2YYSZOYHS2F6F6IJBS25AD6M54OFK66IBU4FRNAEYMZHT67TYAOFXTCJVNWRFNAW7KZAEAKUI'
       //TODO cpay sec key OBS DECRYPT
       }

   //send algo to user pub addr
   fetch(send_url, {
   method: "POST",
   body: JSON.stringify(query),
   headers: headers
   })
   .then(response => response.json()) 
   .then(json => {
       console.log(json.txId)
       //**
       respSuccess(swapid, json.txId)
       writeToDb(json.txId, to_addr, cpayalgopub, amou, 'sek', to_coin, algo_toSend)
       //**
     }
   );

   break;

   default:
    break;
 }
}