
import { supabase } from '../js/supabase_client'

let obj = {"name": '', "lname": '', "cname": '', "caddress": '', "cpnr": '', "pnr": '', "orgnr": '', "subt": '', "lat": '', "lon": '' };


export async function post({request}) {
    const data = await request.formData(); // Here's the data sent by the form
    obj.name = data.get('fname') // Here's how you get the value of a field
    obj.lname = data.get('lname')
    obj.cname = data.get('cname')
    obj.caddress = data.get('caddress')
    obj.cpnr = data.get('cpnr')
    obj.pnr = data.get('pnr')
    obj.orgnr = data.get('orgnr')
    obj.subt = data.get('subt')
    obj.lat = data.get('lat')
    obj.lon = data.get('lon')
    //console.log(obj.lat);
    // return new Response(JSON.stringify(request), {
    //       status: 200,
    // });
    const res = await writeUserInfoToDb(obj);
    if(res == 'ok'){
    //   return new Response('<a href="/userinfopg">Link</a>', {
    //     status: 200,
    //     statusText: '<a href="/userinfopg">Link</a>'
    //   });
    return Response.redirect('http:localhost:3000/userinfopg')
    }else{
      return new Response('error', {
        status: 503,
      });
    }
  }

  async function writeUserInfoToDb(obj){
    //console.log(obj)
    const { error } = await supabase
      .from('shops')
      .update({ shop_name: obj.cname, shop_address: obj.caddress, shop_orgnr: obj.orgnr, shop_subtitle: obj.subt, shop_latitud: obj.lat, shop_longitud: obj.lon })
      .eq('id', 39)

      if(error == null){
        return 'ok'
      }else{
        return 'err'
      }

  }

  export { writeUserInfoToDb }
