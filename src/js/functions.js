import { supabase } from './supabase_client.js';

function trxYear(){
    const d = new Date();
    //let tyear = d.getFullYear();
    return d.getFullYear();
}

async function getTotSaldo(shopid){
   
   const year = trxYear();
   const stTbl = 'transactions' + year;
   const { data } = await supabase.from(stTbl).select()
   .eq('shop_id', shopid)
   .eq('currency', 'sek')
   //.range(from, to)
   
   //console.log(data)
   return data;
}

async function getUserBizId(token){

    var uemail;
    var uid;

    if(token.value != null){// token.has
        const { data, error } = await supabase.auth.getUser(token.value)//** ONLY FOR BUSINESS USER
        uemail = data['user']?.email;
    }
    if(uemail != null){
        const {data, error} = await supabase.from('shops').select('id')
        .eq('owner', uemail)

        if(error == null){
            uid = data[0]['id']//** SHOP_ID
            return uid;
            
        }//else
    }
}

export { getTotSaldo, getUserBizId }