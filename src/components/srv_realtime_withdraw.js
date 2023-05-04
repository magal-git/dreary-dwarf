import { supabase } from '../js/supabase_client';

export function wdraw(){
    console.log('withdraw')
}
//**************************************************************************
//************************* BIZ_REQ_WITHDRAW *******************************
//*********************************V****************************************

//cpay xlm pub //GBDGS7ONR274F3IUJ2URMUU5Y6IOJDFXV7RF3KOX2PHF2SHE6ZPMN7EV
//cpay xlm priv //SBWXSTTA3ZYGH65I25S2UC357OWC5YAQFQTQPUJRTX3TIEK4BUXKQDBG

const chan = supabase
.channel('schema-db-changes')
.on(
  'postgres_changes',
  {
    event: 'INSERT',
    schema: 'public',
    table: 'biz_req_withdraw',
  },
  //(payload) => console.log(payload)
  (payload) => {
    console.log(payload)
    var amou = payload.new['amount']//fiat
    var shid = payload.new['shop_id']
    var waddr = payload.new['wallet_addr']
    var wdid = payload.new['id']

    respond_to_withdraw(amou, waddr, wdid);
    
  }
)
.subscribe()

//**************************************************************************
//************************* END BIZ_REQ_WITHDRAW ***************************
//**************************************************************************
async function respSuccess(wdid, txid){
    const { error } = await supabase
    .from('biz_req_withdraw')
    .update({ confirmTrxid: txid})
    .eq('id', wdid)
  
    if(error == null){
      return 'withdraw ok'
    }else{
      return 'withdraw err'
    }
  }
  //!write withdraw confirm to transaction db
  async function writeToDb(hash, to, sender, amount, currency, to_coin, coin_amount){
    var stdate = new Date()
    var year = stdate.getFullYear()//TODO change to selected year
  
    var trxtbl = 'transactions' + year
    console.log(trxtbl)
  
    const { error } = await supabase
    .from(trxtbl)
    .insert(
      { trx_hash: hash, to_receiver: to, sender_id: sender, amount: amount, currency: currency, coin_type: to_coin, coin_amount: coin_amount, shop_id: '-2'
      });
  
    if(error == null){
      console.log('cpay write to db')
      return 'withdraw ok'
    }else{
      console.log('cpay ERR to db')
      return 'withdraw err'
    }
  }


async function respond_to_withdraw(amou, to_addr, wdid){
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=sek');
    const datax = await res.json()
    const rate = datax['stellar']['sek']
    var amount_in_xlm = amou / rate;
    var stamount_in_xlm = amount_in_xlm.toFixed(4)

    const cpaypub = 'GBDGS7ONR274F3IUJ2URMUU5Y6IOJDFXV7RF3KOX2PHF2SHE6ZPMN7EV';
    
    const send_url = "https://api-eu1.tatum.io/v3/xlm/transaction";

    var headers = {
        'x-api-key': 'e0734a47-73c1-4e2f-86e4-0a54822a48e4',
        'Content-Type': 'application/json'
    };
    var query = 
    {
        "fromAccount": cpaypub,
        "to": to_addr,
        "amount": stamount_in_xlm,
        "fromSecret": "SBWXSTTA3ZYGH65I25S2UC357OWC5YAQFQTQPUJRTX3TIEK4BUXKQDBG"
    }


    fetch(send_url, {
    method: "POST",
    body: JSON.stringify(query),
    headers: headers
    })
    .then(response => response.json()) 
    .then(json => {
            console.log(json)
            respSuccess(wdid, json.txId)
            writeToDb(json.txId, to_addr, cpaypub, amou, 'sek', 'stellar', stamount_in_xlm)
        }
    );


}