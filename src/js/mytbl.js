import { supabase } from './supabase_client.js';

var token = getCookie('token')

function trxYear(){
    const d = new Date();
    //let tyear = d.getFullYear();
    return d.getFullYear();
}

async function getTodayTrx (uid){
  const year = trxYear();
  const stTbl = 'transactions' + year;
  const { data } = await supabase.from(stTbl).select()
  .eq('shop_id', uid)
	
  return data;
}

// async function getCount(){
//     const year = trxYear();
//     const stTbl = 'transactions' + year;
//     const { data, count } = await supabase
//     .from(stTbl)
//     .select('*', { count: 'exact' })
//     .eq('shop_id', 21)
    
//     return count;
// }

//*******************
//* CHECK VALID USER
//*******************
var uemail;
var uid;
var visible = false;

function getCookie(cname) {
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
  
  if(token != null){// token.has
    const { data, error } = await supabase.auth.getUser(token)
    uemail = data['user']?.email;
}

if(uemail != null){
    const {data, error} = await supabase.from('shops').select('id')
    .eq('owner', uemail)

    if(error == null){
        uid = data[0]['id']
        console.log(uid)
        visible = true
    }//else
}else{
    window.location.href = "http://localhost:3000/login";
}
//*******************
//*******************


if(visible){
    var trxs = [];
    trxs = await getTodayTrx(uid);

    //alert(trxs.length)
    var mydata = [
        //[trxs[0].id, 'knatte', 4665],
    ];
    trxs.map((n) => mydata.push(new Array(n.id, n.created_at, n.sender_id, n.amount, n.currency, n.coin_type, n.coin_amount)))

    $(document).ready(function(){
        $("button").click(function(){
            $(location).attr('href', 'http://localhost:3000/u_startpage'); 
        });

        $('#tid').DataTable({
            data:mydata,
            columns: [
                {title: 'Id'},
                {title: 'Date'},
                //{title: 'Hash'},
                //{title: 'Receiver'},
                {title: 'Sender'},
                {title: 'Amount'},
                {title: 'Currency'},
                {title: 'Type'},
                {title: 'Type Amount'},
                // {title: 'shop Id'},
            ],
        });
    });
}
