
import { supabase } from '../js/supabase_client';


function srv_trxYear(){
    const d = new Date();
    //let tyear = d.getFullYear();
    return d.getFullYear();
}

async function srv_getTotSaldo(shopid){//TEST FUNC
   
    const year = srv_trxYear();
    const stTbl = 'transactions' + year;
    const { data } = await supabase.from(stTbl).select()
    .eq('shop_id', shopid)
    .eq('currency', 'sek')
    //.range(from, to)
    
    //console.log(data)
    return data;
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


 export { srv_getTotSaldo, srv_getUserBizId, srv_trxYear }