import { supabase } from './supabase_client.js';
import moment from 'moment';
import { getTotSaldoForDate, getUserBizId, glgetCookie } from './functions'

var token = glgetCookie('token')
var shopId = await getUserBizId(token)
// Check if user is looged in


// get the search date from user (get) = pdate
// var year = pdate.getFullYear
// var year = pdate.getMonth
// var year = pdate.getDate(day)



//var date = new Date('2022', '10', '03', 0, 0, 0)//TEST DATE

//alert(date)
let today = new Date();
let stToday = today.toISOString()
stToday = moment().format('MMMM DD YYYY');
//today = moment().format('YYYY-MM')
$('#date').text(stToday)

showSaldo(today)

async function showSaldo(date){// When a new date is selected
    const odate = makeObj2Date(date)
    
    var totam;
    var saldo = 0.00;
    var tdate;
    var prov = 0;
    var avail = 0.00;

    totam = await getTotSaldoForDate(shopId, odate)
    totam?.map( (nr) => saldo += parseFloat(nr.amount) )

    prov = saldo * 0.004;//*MAKE GLOBAL
    avail = saldo-prov;
    avail = parseFloat(avail.toFixed(2));
    prov = parseFloat(prov.toFixed(2));
   
    var d = new Date();
    var y = d.getFullYear();
    var m = d.getMonth();
    var day = d.getDate();
    tdate = y + '-' + m+1 + '-' + day;

    $('#sale').text('Sale: ' + saldo)
    $('#prov').text('Prov: ' + prov)
    $('#avail').text('Avail: ' + avail)
}


$('#evoCalendar').evoCalendar({
    //calendarEvents: myEvents,
    sidebarDisplayDefault: false,
    eventDisplayDefault: false,
    eventListToggler: false,
    //theme: 'Midnight Blue',
}).on('selectDate', function(event, newDate, oldDate) {
    
    // let obDate = makeObjDate(newDate)
    // let stDate = obDate.toISOString()
    // let stmomDate = moment(stDate).format('MMMM DD YYYY');
    
    let stmomDate = moment(newDate).format('MMMM DD YYYY');
    
    $('#date').text(stmomDate);

    const onewDate = makeObjDate(newDate)
    //$('a').attr('href', '/simday?sdate=' + onewDate).attr('target', 'sf')
    //location.href = '/simday?sdate=' + onewDate
    // $(location).prop('href', '/simday?sdate=' + onewDate)
    // $('ecoCalendar').attr('target', 'sf')
    var a = document.createElement('a')
    a.href = '/simday?sdate=' + onewDate
    a.target = 'sf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
   
    showSaldo(onewDate);
});

function makeObjDate(stdate){
    var split = stdate.split('/')
    var y = split[2]
    var m = split[0]
    var d = split[1]
    //const dt = y + '-' + m + '-' + d
    var od = new Date(y, m-1, d)
    return od;
}
function makeObj2Date(stdate){
    
    var y = stdate.getFullYear()
    var m = stdate.getMonth()+1
    var d = stdate.getDate()
    //const dt = y + '-' + m + '-' + d
    var od = new Date(y, m-1, d)
    return od;
}