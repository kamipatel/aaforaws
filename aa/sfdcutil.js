var jsforce = require('jsforce');

var sfdcutilmethods = {};

sfdcutilmethods.GetSfdcConnection= async(username, passwd, url)  => {
    return new Promise((resolve, reject) => {

        try {

            console.log('GetSfdcConnection called');

            var conn = new jsforce.Connection({version: "47.0"});

            console.log('GetSfdcConnection before login=');

            conn.login(username, passwd, function(err, res) {

                console.log('GetSfdcConnection err=' + err);
                
                if (err) { 
                    console.error('Authentication error=' + err);  
                    reject(err);
                }

                //console.log('GetSfdcConnection conn=' + JSON.stringify(conn));
                resolve(conn);
            });                
        } catch (error) {
            console.log("GetSfdcConnection error" + error);
            reject(error);
        }

    })
}

sfdcutilmethods.GetSfdcConnectionByToken= async(token, instanceUrl)  => {
    return new Promise((resolve, reject) => {

        var conn = null;
        try {

            console.log('GetSfdcConnectionByToken called');

            var conn = new jsforce.Connection({
                version: "47.0",
                serverUrl : instanceUrl,
                sessionId : token
              });

            //console.log('GetSfdcConnection conn=' + JSON.stringify(conn));
            resolve(conn);
                
        } catch (error) {
            console.log("GetSfdcConnectionByToken error" + error);
            reject(error);
        }

    })
}

module.exports = sfdcutilmethods;