'use strict';
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var db = new AWS.DynamoDB();

const debug_mode = (process.env.DEBUG_MODE == -1);

// TODO imprive the title, that is shown on the card, to include the date.
const skillTitle = 'Today In History';
const tableName = 'alexaSkillThisDayInHistory';

var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

var now = new Date();
var dateForGet = (now.getMonth() +1) +'/'+ now.getDate();
var dateForStream = months[now.getMonth()] + ' ' + now.getDate();
var jsonDate = now.toJSON();

var params = {
    AttributesToGet: [
      "fact"
    ],
    TableName : tableName,
    Key : {
      "date" : {
        "S" : dateForGet
      }
    }
  }

exports.handler = function(event, context, callback) {
    if (debug_mode) {console.log('Received event:', JSON.stringify(event, null, 2))}

    db.getItem(params, function(err, data) {
        if (err) {
          console.log(err); // an error occurred
        }
        else {
            if (debug_mode) {console.log(data)}
            // TODO track this usage in GA
            const response = {
                statusCode: 200,
                body: JSON.stringify({
                    uid: 'urn:uuid:1335c695-cfb8-4ebb-abbd-80da344efa6b',
                    updateDate: jsonDate,
                    titleText: skillTitle + ': ' + dateForStream,
                    mainText: data['Item']['fact']['S']
                    // TODO add redirectionURL when website is ready - promote other apps?
                }),
            };

            callback(null, response);
        }
        //return next();
    });

};
