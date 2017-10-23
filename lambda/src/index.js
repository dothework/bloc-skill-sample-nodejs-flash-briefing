'use strict';
const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const db = new AWS.DynamoDB();
const APP_ID = 'amzn1.ask.skill.e4f39f24-69e8-4166-87fd-88281166e588';
const tableName = 'alexaSkillThisDayInHistory';
const SKILL_NAME = 'Today In History';
const HELP_MESSAGE = 'Simply launch me and I\'ll tell you about what happened on this day in history. Would you like to hear the history for today?';
const HELP_REPROMPT = 'Hope to see you again soon.';

// read environmental variable from Lambda
const debug_mode = (process.env.DEBUG_MODE == -1);

//TODO add VoiceLabs Tracking. USE Promises?

var speechOutput = '';

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
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // user data table name
    alexa.dynamoDBTableName = 'TodayInHistorySkillUserData';
    alexa.registerHandlers(handlers);
    alexa.execute();
};

function readDynamoItem(params, callback) {
    db.getItem(params, (err, data) => {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            if (debug_mode) {console.log("GetItem succeeded:", JSON.stringify(data, null, 2))};
            callback(data['Item']['fact']['S']);
        }
    });

}
const handlers = {
    'LaunchRequest': function () {
      var speechOutput = '';
      initIfNeeded(this);
      this.attributes['use_count'] = this.attributes['use_count'] + 1;
      readDynamoItem(params, factData=>{
          // TODO after 5 uses add details about the flash briefing to the cardRenderer (every third time)
          // TODO after 10 uses add details about the flash brieginf to the speak (only once)
          // if(supportsDisplay.call(this)||isSimulator.call(this)) {
          //   if (debug_mode) {console.log("has display:"+ supportsDisplay.call(this))};
          //   if (debug_mode) {console.log("is simulator:"+isSimulator.call(this))};
          //   var content = {
          //      "hasDisplaySpeechOutput" : factData,
          //      "hasDisplayRepromptText" : '',
          //      "simpleCardTitle" : SKILL_NAME + ': ' + dateForStream,
          //      "simpleCardContent" : factData,
          //      "bodyTemplateTitle" : SKILL_NAME + ': ' + dateForStream,
          //      "bodyTemplateContent" : '',
          //      //"backgroundImage" : backgroundImage,
          //      //"cardImageLarge" : cardImageLarge,
          //      //"cardImageSmall" : cardImageSmall,
          //      "templateToken" : "sceneBodyTemplate",
          //      //"hintText" : hintText,
          //      "askOrTell" : ":tell",
          //      "sessionAttributes": {}
          //   };
          //   renderTemplate.call(this, content);
          // } else {
            this.response.speak(speechOutput + factData + '<break time=\"1.618s\" />');
            this.emit(':responseReady');
          // }

      });
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        // do nothing, save track it
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        // do nothing, save track it
        this.emit(':responseReady');
    },
    'AMAZON.RepeatIntent': function () {
        this.emit('LaunchRequest');
    },
    'AMAZON.NextIntent': function () {
        // next fact, same number
        this.emit('LaunchRequest');
    },
    'AMAZON.MoreIntent': function () {
        // next fact, same number
        this.emit('LaunchRequest');
    },
    'AMAZON.NoIntent': function () {
        // done
        this.emit(':responseReady');
    },
    'AMAZON.YesIntent': function () {
        // next fact, same number
        this.emit('LaunchRequest');
    },
    'Unhandled': function () {
        // odditiy intent, track it
        this.emit('LaunchRequest');
    },
};

var initIfNeeded = function(obj) {
  if(Object.keys(obj.attributes).length === 0) { // Check if it's the first time the skill has been invoked
      if (debug_mode) {console.log('First Use! Setting up data...');};
      obj.attributes['first_use_timestamp'] = Date.now();
      obj.attributes['use_count'] = 0;
      speechOutput = 'Welcome, to Today In History<break time=\".618s\" />';
  }
};

function supportsDisplay() {
  var hasDisplay =
    this.event.context &&
    this.event.context.System &&
    this.event.context.System.device &&
    this.event.context.System.device.supportedInterfaces &&
    this.event.context.System.device.supportedInterfaces.Display

  return hasDisplay;
}

function isSimulator() {
  var isSimulator = !this.event.context; //simulator doesn't send context
  return isSimulator;
}

function renderTemplate (content) {

  //create a template for each screen you want to display.
  //This example has one that I called "factBodyTemplate".
  //define your templates using one of several built in Display Templates
  //https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference#display-template-reference

   switch(content.templateToken) {
       case "sceneBodyTemplate":
           var response = {
             "version": "1.0",
             "response": {
               "directives": [
                 {
                   "type": "Display.RenderTemplate",
                   "template": {
                     "type": "BodyTemplate1",
                     "title": content.bodyTemplateTitle,
                     "token": content.templateToken,
                     "textContent": {
                       "primaryText": {
                         "type": "RichText",
                         "text": "<font size = '5'>" + content.simpleCardContent +"</font>"
                       }
                     },
                     "backButton": "HIDDEN"
                   }
                 }
               ],
               "outputSpeech": {
                 "type": "SSML",
                 "ssml": "<speak>"+content.hasDisplaySpeechOutput+"</speak>"
               },
               "reprompt": {
                 "outputSpeech": {
                   "type": "SSML",
                   "ssml": "<speak>"+content.hasDisplayRepromptText+"</speak>"
                 }
               },
               "shouldEndSession": content.askOrTell==":tell" //,
              //  "card": {
              //    "type": "Standard",
              //    "title": content.simpleCardTitle,
              //    "text": content.simpleCardContent,
              //    "image": {
              //      "smallImageUrl": content.cardImageSmall,
              //      "largeImageUrl": content.cardImageLarge
              //    }
              //  }
             },
             "sessionAttributes": content.sessionAttributes
           }
           this.context.succeed(response);
           break;

       default:
          //this.response.speak("Thanks for chatting, goodbye");
          this.emit(':responseReady');
   }
}
