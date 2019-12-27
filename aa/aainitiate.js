const AWS = require('aws-sdk');

let response;

class InitiateWorkflowError extends Error {
    constructor(message) {
      super(message);
      this.name = "InitiateWorkflowError";
    }
  }
  

const CallStepFunction = async (params) => {
    return new Promise((resolve, reject) => {

        var stepfunctions = new AWS.StepFunctions();

        console.log('CallStepFunction called' );
        stepfunctions.startExecution(params).promise().then(() => {
            console.log('CallStepFunction started execution of step function' );
            resolve(true);
        }

    ).catch(err => {
        console.log('CallStepFunction err while executing step function=' + err);
        reject(err);
    })

});    
}


exports.lambdaHandler = async (event, context, callback) => {
    try {

        console.log("*** aainitiate called with event" + JSON.stringify(event));

        let updatedEvent = event;
        if(event.IsBatchEvent != null && event.IsBatchEvent){
            
            var date = new Date();
            var utcDate = new Date(date.toUTCString());
            utcDate.setHours(utcDate.getHours()-8);
            var d = new Date(utcDate);
            d.setDate(d.getDate() - 1); // Yesterday!
            var startDate = d.toISOString().slice(0,10) + "T00:00:00.000Z";
            var endDate = d.toISOString().slice(0,10) + "T23:59:59.000Z";
            
            console.log("*** aainitiate startDate=" + startDate);	
            
            updatedEvent["startDate"] = startDate;
            updatedEvent["endDate"] = endDate;

            var params = {
                stateMachineArn: process.env.statemachine_arn,
                input: JSON.stringify(updatedEvent)
              }
            
              console.log("*** aainitiate single day event calling step function with event" + JSON.stringify(updatedEvent));

               CallStepFunction(params);

        }else{
            console.log("*** aainitiate called with event batch type");

            var start = new Date(event.startDate);
            var end = new Date(event.endDate);
           // var newend = end.setDate(end.getDate()+1);
           // var end = new Date(newend);
            while(start < end){
               console.debug(formatDate(start));           

               var startDate = formatDate(start) + "T00:00:00.000Z";
               var endDate = formatDate(start) + "T23:59:59.000Z";
                  
                updatedEvent["startDate"] = startDate;
                updatedEvent["endDate"] = endDate;

                console.debug("updatedEvent startDate=" + updatedEvent["startDate"]);           
                console.debug("updatedEvent endDate=" + updatedEvent["endDate"]);           

                var params = {
                    stateMachineArn: process.env.statemachine_arn,
                    input: JSON.stringify(updatedEvent)
                }
                
                console.log("*** aainitiate batch loop before calling step function with event" + JSON.stringify(updatedEvent));

                 CallStepFunction(params);
               
               var newDate = start.setDate(start.getDate() + 1);
               start = new Date(newDate);
            }
    
        }

        console.log("*** aainitiate updated event" + JSON.stringify(event));
                 
        console.log("initiate done");
        callback(null, {res: null});

    } catch (err) {
        console.log(err);
        callback(new InitiateWorkflowError("AA failed to create new log request record in SFDC, error ->" + err));
    }

};


function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}
