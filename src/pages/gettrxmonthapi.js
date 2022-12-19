
import { supabase } from '../js/supabase_client'

function plusOneDay(date) {
    const odate = new Date(date)
    odate.setDate(odate.getDate() + 1);
    return odate;
}

function trxYear(){
    const d = new Date();
    //let tyear = d.getFullYear();
    return d.getFullYear();
}

async function getSaldoTrxForCurMonth(shopid){
    var d = new Date()
    //alert(d)
    var day = d.getDate()
    var pday = parseInt(day)+1
    var month = d.getMonth()+1
    var dyear = d.getFullYear()
    var sd = dyear+'-'+month+'-'+day
    var sdp = dyear+'-'+month+'-'+pday
    //alert(sd)
    //alert(sdp)

    var start_date = dyear+'-'+month+'-01'
    var end = daysInMonth(month, dyear)
    var end_date = dyear+'-'+month+'-'+end
    alert(start_date)
    alert(end_date)

    const year = trxYear();
    const stTbl = 'transactions' + year;
    const { data } = await supabase.from(stTbl).select("*", {count: "exact"})
    .eq('shop_id', shopid)
    .eq('currency', 'sek')
    .gte('created_at', start_date)
    .lt('created_at', end_date)
   
    var saldo = 0;
    data.map( (nr) => saldo += parseInt(nr.amount) )
   //alert(saldo)
   return saldo;
}

//*
function daysInMonth (month, year) {
  return new Date(year, month, 0).getDate();
}
//*

export async function post({ request }) {
    
    const body = await request.json();
    const shopid = body.shopid;
    //const date = body.date;
    //alert(shopid)

    if(shopid == null || shopid == undefined){
      return new Response(null, {
        status: 404,
        statusText: 'Not found'
      });
    }

    //*
    
    const trxdata = await getSaldoTrxForCurMonth(shopid)
  
    return new Response(JSON.stringify({data: trxdata}), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }