
import { supabase } from '../js/supabase_client'


function trxYear(){
    const d = new Date();
    //let tyear = d.getFullYear();
    return d.getFullYear();
}

var saldo = 0;
var curmon = '';

async function getSaldoMonthForChart(shopid){
    var d = new Date()
    var dyear = d.getFullYear()

    const month_array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const month_name = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]

    var m = 0;
    var stime = ' 00:00:00';
    var time = ' 24:00:00';
    var saldo_array = [];
  for(var i=1; i<13; i++){
    m = i-1;
    
    var start_date = dyear+'-'+ i +'-01'

    var endday = daysInMonth(month_array[m], dyear)
    start_date = start_date.toString() + stime;
    endday = endday.toString() + time;
    var end_date = dyear+'-'+ month_array[m] +'-'+endday;
    //alert(start_date)
    //alert(end_date)
    
    const stTbl = 'transactions' + dyear;
    const { data } = await supabase.from(stTbl).select()
    .eq('shop_id', shopid)
    //.eq('id', 193)
    .eq('currency', 'sek')
    .gte('created_at', start_date)
    .lte('created_at', end_date)
   
    data.map( (nr) => saldo += parseInt(nr.amount) )
    curmon = month_name[m]
    
    saldo_array.push(new ObjMonth(curmon, saldo))
    saldo = 0;
  }
    //alert(saldo_array)
  
   return saldo_array;
}

//******CLASS********
class ObjMonth {
  constructor(monthName, saldo) {
    this.monthName = monthName;
    this.saldo = saldo;
  }
}
//******************

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
    
    const trxdata = await getSaldoMonthForChart(shopid)
  
    return new Response(JSON.stringify({data: trxdata}), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }





  /*
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
    

    const year = trxYear();
    const stTbl = 'transactions' + year;
    const { data } = await supabase.from(stTbl).select("*", {count: "exact"})
    .eq('shop_id', shopid)
    .eq('currency', 'sek')
    .gte('created_at', start_date)
    .lt('created_at', end_date)
   
    var saldo = 0;
    data.map( (nr) => saldo += parseInt(nr.amount) )
   const obj_data = {saldo: saldo, count: data.length, total: data}
   return obj_data;
   //return saldo;
}
  */