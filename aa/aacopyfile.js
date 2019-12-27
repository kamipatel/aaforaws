const axios = require("axios");

const https = require("https");
const AWS = require('aws-sdk');

const BUCKET_TEST_NAME = 'aa-daily-original';
const REMOTE_TEST_FILE = 'https://www.w3.org/TR/PNG/iso_8859-1.txt';

const s3 = new AWS.S3({
});

let response;

class CopyFileError extends Error {
    constructor(message) {
      super(message);
      this.name = "CopyFileError";
    }
  }

const uploadFile = async (remotefile, filename, bucketname) => {

    //remotefile = REMOTE_TEST_FILE;
    console.log("DoCopy uploadFile called, remotefile=" +remotefile);
    const response = await axios.get(remotefile);
    const data = response.data;
    
    //console.log("DoCopy uploadFile called, data size=" + data);
            
    // Uploading files to the bucket
    const res = await new Promise((resolve, reject) => {

    
        try {    

                //console.log("DoCopy uploadFile called, remotefile=" + remotefile);
                    // Setting up S3 upload parameters
                const params = {
                    Bucket: bucketname,
                    Key: filename, // File name you want to save as in S3
                    Body: data
                };
            
                s3.putObject(params, function(err, data) {
                    if (err) {
                        console.log('File uploaded error=' + err);
                        reject(err);
                    } else {
                        console.log('File uploaded success' );
                        resolve(data);
                    }
                });

            } catch (error) {
                console.log("uploadFile error" + error);
                reject(error);
            }
    });            

    console.log('File uploaded function complete' );
    
};

exports.lambdaHandler = async (event, context, callback) => {
    try {

        console.log("*** Do Copy function called");

        console.log("Copy function, event=" + JSON.stringify(event));
        console.log("Copy function, context=" + JSON.stringify(context));

        let appbucket = process.env.CopyBucket + '/' + event.AppName + '/' + 'dailyraw' ;
        let newfilename = event.AppName + ':' + event.startDate.substring(0, 10);
        let payload = {
            remotefile: event.aarecord.res[0].DownloadUrl,
            destfilename: newfilename,
            bucketname: appbucket 
        };
        
        console.log("event=" + payload);

        await uploadFile(payload.remotefile , payload.destfilename, payload.bucketname);

        console.log("Upload done");

        callback(null, {res: null});

    } catch (err) {
        console.log(err);
        callback(new CopyFileError("AA failed to create new log request record in SFDC, error ->" + err));
    }

};
