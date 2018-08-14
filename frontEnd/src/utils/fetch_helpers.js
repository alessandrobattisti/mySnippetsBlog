import {getToken} from './../components/auth'
import fetch from 'isomorphic-fetch';

function create_request(method, url, data){
    var myHeaders = new Headers();
    myHeaders.append("Authorization", getToken());
    myHeaders.append('Content-Type', 'application/json');
    var myInit = { method: method,
                   headers: myHeaders,
                   body : JSON.stringify(data),
                  };
    return new Request(url, myInit);
}

var request = function(url, loader){
  return new Promise(function(resolve, reject) {
    fetch(url)
      .then(function(response){
        if(response.status===204){
          const obj = '{"status": "object deleted"}'
          return obj
        }
        if(response.ok){
          if(response.statusText==="No Content"){
            resolve({'status':'success'})
          }
          return response.text()
        }
        else{
          throw response
        }
      })
      .then( responseBodyAsText => {
          try {
              const bodyAsJson = JSON.parse(responseBodyAsText);
              return bodyAsJson;
          } catch (e) {
              console.log(e)
              reject({body:responseBodyAsText, type:'unparsable'});
          }
      })
      .then(
        function(resp){
          resolve(resp)
        }
      )
      .catch( err => {
           if (typeof err.text === 'function') {
             err.text().then(errorMessage => {
               console.log(errorMessage)
               let msg = `There was a problem communicating with the server. <span class="small-error">${errorMessage}</span>`

               if(errorMessage.includes("Invalid token.") || errorMessage.includes("Authentication credentials")){
                 msg = "Guest users can't modify database"
               }
               if(errorMessage.includes("Unable to log in with provided credentials")){
                 msg = 'invalid credentials'
               }
               if(errorMessage.includes('Not found')){
                 msg = 'not found'
               }

               reject(msg)
             });
           } else {
              console.log(err)
              reject("There was a problem communicating with the server. Check console for more information")
           }
       })
  });
}


export {create_request, request}
