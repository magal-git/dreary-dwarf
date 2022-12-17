import { supabase } from './supabase_client.js';
import { getTotSaldoForDate, getUserBizId, glgetCookie } from './functions'

var token = glgetCookie('token')
var shopId = await getUserBizId(token)
// Check if user is looged in


// get the search date from user (get) = pdate
// var year = pdate.getFullYear
// var year = pdate.getMonth
// var year = pdate.getDate(day)



var date = new Date('2022', '10', '03', 0, 0, 0)//TEST DATE

//alert(date)
const today = new Date();
//alert(today)

showSaldo(today)

async function showSaldo(date){// When a new date is selected
    var totam;
    var saldo = 0;
    var tdate;
    var prov = 0;
    var avail = 0;

    totam = await getTotSaldoForDate(shopId, date)
    totam?.map( (nr) => saldo += parseInt(nr.amount) )

    prov = saldo * 0.004;//*MAKE GLOBAL
    avail = saldo-prov;
    avail = parseFloat(avail.toFixed(2));
    prov = parseFloat(prov.toFixed(2));
   
    var d = new Date();
    var y = d.getFullYear();
    var m = d.getMonth();
    var day = d.getDate();
    tdate = y + '-' + m + '-' + day;

    $('#sale').text('Sale: ' + saldo)
    $('#prov').text('Prov: ' + prov)
    $('#avail').text('Avail: ' + avail)
}


$('#evoCalendar').evoCalendar({
    //calendarEvents: myEvents,
    sidebarDisplayDefault: false,
    eventDisplayDefault: false,
    eventListToggler: false,
}).on('selectDate', function(event, newDate, oldDate) {
    $('#date').text(newDate);
    $('a').attr('href', '/mytable?121005')
    const onewDate = makeObjDate(newDate)
    showSaldo(onewDate);
});

function makeObjDate(stdate){
    var split = stdate.split('/')
    var y = split[2]
    var m = split[0]
    var d = split[1]
    const dt = y + '-' + m + '-' + d
    var od = new Date(y, m-1, d)
    return od;
}