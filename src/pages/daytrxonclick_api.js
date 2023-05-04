
import moment from 'moment'
import { supabase } from '../js/supabase_client'


async function getTotSaldoForDate(shopid, date){
  console.log(date)
  const odate = new Date(date)
  const addOne = addOneDay(date)
  const oaddOne = new Date(addOne)
  
  // const stDate = odate.toISOString()
  // console.log('1 ' + stDate)
  // const stAddone = oaddOne.toISOString()
  // console.log('2 ' + stAddone)

  //const year = trxYear();
  const year = odate.getFullYear()
  //console.log('year ' + year)
  const stTbl = 'transactions' + year;
  const { data } = await supabase.from(stTbl).select()
  .eq('shop_id', shopid)
  .eq('currency', 'sek')
  .gte('created_at', odate.toISOString())
  .lt('created_at', oaddOne.toISOString())
  
  data.map( (obj) => obj.created_at = moment(obj.created_at).format('YYYY-MM-DD hh:mm:ss') )

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
function addOneDay(date) {
  let ddate = new Date(date)
  ddate.setDate(ddate.getDate() + 1);
  return ddate;
}
//*

export async function post({ request }) {
    
    const body = await request.json();
    const shopid = body.shopid;
    const sdate = body.sdate;
    //const date = body.date;
    //alert(shopid)

    if(shopid == null || shopid == undefined){
      return new Response(null, {
        status: 404,
        statusText: 'Not found'
      });
    }

    //*
    
    const trxdata = await getTotSaldoForDate(shopid, sdate)
  
    return new Response(JSON.stringify({data: trxdata}), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
}