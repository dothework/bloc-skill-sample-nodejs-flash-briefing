'use strict';

const data = require('./data');

// TODO change skillTitle
const skillTitle = 'My Flash Briefing';

const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const now = new Date();
const dateForGet = (now.getMonth() +1) +'/'+ now.getDate();
const dateForStream = months[now.getMonth()] + ' ' + now.getDate();
const jsonDate = now.toJSON();

exports.handler = function(event, context, callback) {
    // TODO diasble logging as desired
    console.log(params)
    db.getItem(params, function(err, data) {
        if (err) {
          // an error occurred
          // TODO add more extenisive error handling as desired
          console.log(err);
        }
        else {
            // TODO diasble logging as desired
            console.log(JSON.stringify(data));
            const response = {
                statusCode: 200,
                body: JSON.stringify({
                    // TODO change uid if desired
                    uid: 'urn:uuid:1335c695-cfb8-4ebb-abbd-81da344efa6b',
                    updateDate: jsonDate,
                    titleText: skillTitle + ': ' + dateForStream,
                    mainText: data[jsonDate]
                }),
            };
            callback(null, response);
        }
    });
};
