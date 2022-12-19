
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

async function getTrxForDate(shopid, date){
    var d = new Date(date)
    alert(d)
    var day = d.getDate()
    var pday = parseInt(day)+1
    var month = d.getMonth()+1
    var dyear = d.getFullYear()
    var sd = dyear+'-'+month+'-'+day
    var sdp = dyear+'-'+month+'-'+pday
    alert(sd)
    alert(sdp)
    // const odate = new Date(date)
    // const addOne = plusOneDay(date)
    // const oaddOne = new Date(addOne)

    const year = trxYear();
    const stTbl = 'transactions' + year;
    const { data } = await supabase.from(stTbl).select("*", {count: "exact"})
    .eq('shop_id', shopid)
    .eq('currency', 'sek')
    .gte('created_at', sd)
    .lt('created_at', sdp)
   
   //alert(data[0].id)
   //alert(data.length)
   
   return data;
}

export async function post({ request }) {
    
    const body = await request.json();
    const shopid = body.shopid;
    const date = body.date;

    if(shopid == null || shopid == undefined){
      return new Response(null, {
        status: 404,
        statusText: 'Not found'
      });
    }

    //*
    
    const trxdata = await getTrxForDate(shopid, date)
    //alert('trx: ' + trxdata)
    //*
  
    return new Response(JSON.stringify({data: trxdata}), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }