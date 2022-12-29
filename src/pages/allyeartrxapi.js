import { supabase } from '../js/supabase_client'

//************************
//*** NOT IN USE RIGHT NOW
//************************
async function getAllYearTrxSaldo(shopid){
    var d = new Date()
    var dyear = d.getFullYear()

    var stime = ' 00:00:00';
    var time = ' 24:00:00';
    
    var start_date = dyear+'-01-01';
    start_date = start_date.toString() + stime;
    var end_date = dyear+'-12-31';
    end_date = end_date.toString() + time;
    alert(start_date)
    alert(end_date)
    
    const stTbl = 'transactions' + dyear;
    const { data } = await supabase.from(stTbl).select()
    .eq('shop_id', shopid)
    //.eq('id', 193)
    .eq('currency', 'sek')
    .gte('created_at', start_date)
    .lte('created_at', end_date)
   
    var saldo = 0;
    data.map( (nr) => saldo += parseInt(nr.amount) )
    alert(data)
  
   return saldo;
}


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
    
    const trxdata = await getAllYearTrxSaldo(shopid)
  
    return new Response(JSON.stringify({data: trxdata}), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }