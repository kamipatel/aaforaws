const sfdc = require("./sfdcutil");

let response;

class LoginError extends Error {
  constructor(message) {
    super(message);
    this.name = "LoginError";
  }
}

exports.lambdaHandler = async (event, context, callback) => {
        
    try {

        console.log("*** SFDC Login called");

        console.log("Login function, event=" + JSON.stringify(event));

        let conn = await sfdc.GetSfdcConnection(process.env.SfdcUserName, process.env.SfdcPassword, process.env.SfdcURL);

        console.log("login done, conn" + conn);
        console.log(conn.accessToken);
        console.log(conn.instanceUrl);

        let data = {
            accessToken: conn.accessToken,
            instanceUrl: conn.instanceUrl
        };

        callback(null, {res: data});

    } catch (err) {
        console.log(err);
        callback(new LoginError("Login failed, error ->" + err));
    }
};
