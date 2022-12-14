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
async function getTotSaldoForDate(shopid, date){

    //alert(date)
    const odate = new Date(date)
    //alert(odate)
    const addOne = addOneDay(date)
    //alert(addOne)
    const oaddOne = new Date(addOne)
    //alert(oaddOne)
    //const stDate = odate.toISOString()
    //alert(stDate)
    //const stAddone = oaddOne.toISOString()
    //alert(stAddone)

    const year = trxYear();
    const stTbl = 'transactions' + year;
    const { data } = await supabase.from(stTbl).select()
    .eq('shop_id', shopid)
    .eq('currency', 'sek')
    .gte('created_at', odate.toISOString())
    .lt('created_at', oaddOne.toISOString())
   
   //alert(data[0].id)
   //alert(data)
   console.log(data)
   return data;
}

async function getUserBizId(token){

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
        window.location.href = "http://localhost:3000/login";
    }
}

function glgetCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

// async function signOut(){
//     alert('signout')
//     const data = await supabase.auth.getSession();
//     await supabase.auth.api.signOut(session.access_token);
//     //const { error } = await supabase.auth.signOut()
//     // console.log(data.session)
// }
//const signOut = async () => await supabase.auth.getSession();

function getToday(){
    var d = new Date();
    var y = d.getFullYear();
    var m = d.getMonth();
    var day = d.getDate();
    var tdate = y + '-' + m + '-' + day;
    return tdate;
}

function addOneDay(date) {
    date.setDate(date.getDate() + 1);
    return date;
}


export { getTotSaldo, getUserBizId, getToday, glgetCookie, getTotSaldoForDate }