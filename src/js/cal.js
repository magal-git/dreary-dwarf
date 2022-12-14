import { supabase } from './supabase_client.js';
import { getTotSaldoForDate, getUserBizId, glgetCookie } from './functions'

var token = glgetCookie('token')
var shopId = await getUserBizId(token)
//alert(shopId)
// Check if user is looged in


// get the search date from user (get) = pdate
// var year = pdate.getFullYear
// var year = pdate.getMonth
// var year = pdate.getDate(day)

var date = new Date('2022', '10', '03', 0, 0, 0)//month-1 , 10=11
//alert(date)

//getTotSaldoForDate(shopId, date)

var mye = 'sale 29095';
        const myEvents = [
        { 
            id: "required-id-1",
            name: mye, 
            date: "Wed Dec 14 2022 00:00:00 GMT-0800 (Pacific Standard Time)", 
            type: "What", 
            everyYear: true 
        },
        { 
            id: "required-id-2",
            name: '<a href="/mytable">go</a>', 
            date: "Wed Dec 14 2022 00:00:00 GMT-0800 (Pacific Standard Time)", 
            type: "What", 
            everyYear: true 
        },
        ]

        // $('#evoCalendar').evoCalendar({
        //     todayHighlight: false,
        //     calendarEvents: myEvents,
            
        //     onSelectDate: function() {
        //     //console.log('onSelectDate!')
        //     alert('uwryieuw')
        //     //$('#title').text('test');
        //     }

        // });

        
        var date = new Date('2022', '10', '03', 0, 0, 0)
        alert(date)
        $('#evoCalendar').evoCalendar({
            calendarEvents: myEvents,
            sidebarDisplayDefault: false,
            eventDisplayDefault: false,
            eventListToggler: false,
        }).on('selectDate', function(event, newDate, oldDate) {
            //$('#date').text(newDate);
            $('a').attr('href', '/mytable?121005')
           
            getTotSaldoForDate('39', date).then( (res) =>{
                $('#date').text(res[0]['id'])
            })
        });
