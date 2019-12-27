const sfdc = require("./sfdcutil");

let response;

class NewAARequestError extends Error {
    constructor(message) {
      super(message);
      this.name = "NewAARequestError";
    }
  }


exports.lambdaHandler = async (event, context, callback) => {
    try {

        console.log("*** SFDC new AA request called");

        console.log("SFDC new AA request , event=" + JSON.stringify(event));
        console.log("SFDC new AA request , context=" + JSON.stringify(context));

        let conn = await sfdc.GetSfdcConnectionByToken(event.sfdc.res.accessToken, event.sfdc.res.instanceUrl);
        console.log("SFDC new AA request login done, conn" + conn);
            
       let aareq = { 
           DataType : 'CustomObjectUsageLog',
           PackageIds: event.packages,
           StartTime: event.startDate,
           endTime: event.endDate
        };
        
       // let aarecord = '0331U000000EHq2';

       /*
       let aarecord =  {
        "id": "0XI1U000000KynDWAS",
        "success": true,
        "errors": []
      }*/
        
       
        let aarecord = await conn.sobject("AppAnalyticsQueryRequest").create(aareq, function(err, ret) {
            if (err || !ret.success) { return console.error("aarequest insert error=" + err); }
            console.log("Created record id : " + ret.id);
        });
        

        console.log("Created aarecord : " + JSON.stringify(aarecord));
        //select Id, DataType, DownloadUrl, PackageIds, LastModifiedDate, RequestState from AppAnalyticsQueryRequest where Id='0XI1U000000KyjkWAC'

        callback(null, {res: aarecord});

    } catch (err) {
        console.log(err);
        callback(new NewAARequestError("AA failed to create new log request record in SFDC, error ->" + err));
    }

};
