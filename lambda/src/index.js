'use strict';

const data = require('./data');

// TODO change skillTitle
const skillTitle = 'My Flash Briefing';

const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const now = new Date();
const dateForData = (now.getMonth()+1) +'/'+ now.getDate();
const dateForStream = months[now.getMonth()] + ' ' + now.getDate();
const jsonDate = now.toJSON();

exports.handler = function(event, context, callback) {
    // TODO diasble logging as desired
    console.log(JSON.stringify(event));
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            // TODO change uid if desired
            uid: 'urn:uuid:1335c695-cfb8-4ebb-abbd-81da344efa6b',
            updateDate: jsonDate,
            titleText: skillTitle + ': ' + dateForStream,
            mainText: data[dateForData]
        })
    };
    callback(null, response);
};
