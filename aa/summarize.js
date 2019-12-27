var AWS = require('aws-sdk');

const athena = new AWS.Athena();

exports.doAggregation = (event, context, callback) => {

let appsumbucket = process.env.CopyBucket + '/' + event.AppName + '/' + 'dailysum' ;

  const params = {
    QueryString: event.aggquery,
    ResultConfiguration: {
      OutputLocation: appsumbucket
    }
  };

  console.log("Athena query params=" + JSON.stringify(params));
  athena.startQueryExecution(params, (error, data) => {

    if (error) {
        console.log("Athena query error=" + JSON.stringify(error));
        callback(error);    
    } else {      
        const response = {
        aggQueryExecutionId: data.QueryExecutionId
      }

      console.log("Athena query response=" + JSON.stringify(response));
      callback(null, response);
    }
  })
}

