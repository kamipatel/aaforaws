const sfdc = require("./sfdcutil");

let response;

class PollAARequestError extends Error {
    constructor(message) {
      super(message);
      this.name = "PollAARequestError";
    }
  }

exports.lambdaHandler = async (event, context, callback) => {
    try {

        console.log("*** AA status request called");

        console.log("AA status request, event=" + JSON.stringify(event));
        console.log("AA status request, context=" + JSON.stringify(context));

        let conn = await sfdc.GetSfdcConnectionByToken(event.sfdc.res.accessToken, event.sfdc.res.instanceUrl);
        console.log("AA status SFDC login done, conn" + conn);

        let recordid = event.aareq.res.id;
        let query = "SELECT Id, DataType, DownloadUrl, PackageIds, LastModifiedDate, RequestState FROM AppAnalyticsQueryRequest where Id='" + recordid + "'";
        console.log("query=" + query);

        let aarecord = await conn.query(query, function(err, result) {
            if (err) { return console.error(err); }
            console.log("total : " + result.totalSize);
            console.log("fetched : " + result.records.length);
            return result.records;

          });
        
        console.log("aarecords" + JSON.stringify(aarecord));

        callback(null, {res: aarecord});

    } catch (err) {
        console.log(err);
        callback(new PollAARequestError("AA get log request status in SFDC, error ->" + err));
    }

};
