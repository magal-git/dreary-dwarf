
import { supabase } from '../js/supabase_client'



async function monthTrxOnClick(shopid, month){
    var d = new Date()
    var dyear = d.getFullYear()

    var stime = ' 00:00:00';
    var time = ' 24:00:00';
    
    var start_date = dyear+'-'+ month +'-01'

    var endday = daysInMonth(month, dyear)
    start_date = start_date.toString() + stime;
    endday = endday.toString() + time;
    var end_date = dyear+'-'+ month +'-'+endday;
    //alert(start_date)
    //alert(end_date)
    
    const stTbl = 'transactions' + dyear;
    const { data } = await supabase.from(stTbl).select()
    .eq('shop_id', shopid)
    //.eq('id', 193)
    .eq('currency', 'sek')
    .gte('created_at', start_date)
    .lte('created_at', end_date)
   
    data.map( (obj) => obj.created_at = cropDate(obj.created_at) )
    //alert(data[0]['created_at'])
  
   return data;
}

function cropDate(date){
    let ds = date.slice(0,19)
    ds = ds.split('T')
    return ds[0]+ '\n' + ds[1]
    
}
//*
function daysInMonth (month, year) {
  return new Date(year, month, 0).getDate();
}
//*

export async function post({ request }) {
    
    const body = await request.json();
    const shopid = body.shopid;
    const month = body.month;
    //const date = body.date;
    //alert(shopid)

    if(shopid == null || shopid == undefined){
      return new Response(null, {
        status: 404,
        statusText: 'Not found'
      });
    }

    //*
    
    const trxdata = await monthTrxOnClick(shopid, month)
  
    return new Response(JSON.stringify({data: trxdata}), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
}