exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.dynamoDBTableName = 'WiFiPasswordSkillUserData';
    alexa.registerHandlers(handlers, startHandlers, setupPhoneHandlers, verifyPhoneHandlers, verifyHandlers, waitingForPasswordHandlers, verifyPasswordHandlers);
    alexa.execute();
};

'use strict';

const Alexa = require('alexa-sdk');

// import strings for speech and cards
// ie: SAMPLE_PASSWORD for speech and SAMPLE_PASSWORD_CARD for card text
const Messages = require('./messages');

// name of slot that contains the phone number
const slotName = "PhoneNumber";

// Get an instance of `PhoneNumberUtil`.
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

const APP_ID = 'amzn1.ask.skill.3ed262da-e7e4-4214-b0a9-bef5f85c5a8e';

// read environmental variable from Lambda
const debug_mode = (process.env.DEBUG_MODE == -1);

// VoiceLabs docs here > https://insights.voicelabs.co/analytics#!/admin/docs
const VoiceLabs = require("voicelabs")('e72e3fc0-9ed5-11a7-0c61-0eb19d13e26e');

// Twilio client
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN);

// ie {providedPhoneNumber:6165402552,cardPhoneNumber:'(616) 540-2552',speakPhoneNumber:'6<break time=\'.309\'>1<break time=\'.309\'>6<break time=\'.309\'> ...'}
var phoneNumberObject = {};

// is {providedPassword:'5ER334KO45M4K4',speakPassword:'5<break time=\'.618\'>upper case E ...'}
var passwordObject = {};

// STARTMODE intial state and also fully configured state = startHandlers
// VERIFYSETUPMODE stae of waiting for user to say they are ready to continue with the setup, or not
// SETUPPHONEMODE state of asking are you ready to provide your phone nubmer? = setupPhoneHandlers
// VERIFYPHONEMODE is the phone number correct? it is a valid US number = verifyPhoneHandlers
// WAITINGFORPASSWORDMODE state of text messaage was just sent and waiting for
// VERIFYPASSWORDMODE
// HELPMODE is user getting help state / probably need several of these...

const states = {
    STARTMODE: "_STARTMODE",
    READYTOGIVENUMBERSTATE: "_READYTOGIVENUMBERSTATE",
    SETUPPHONEMODE: "_SETUPPHONEMODE",
    VERIFYPHONEMODE: "_VERIFYPHONEMODE",
    WAITINGFORPASSWORDMODE: "_WAITINGFORPASSWORDMODE",
    VERIFYPASSWORDMODE: "_VERIFYPASSWORDMODE",
    HELPMODE: "_HELPMODE"
};

const handlers = {
     "LaunchRequest": function() {
        this.handler.state = states.STARTMODE;
        this.emitWithState("GetPasswordIntent");
     },
    "GetPasswordIntent": function() {
        this.handler.state = states.STARTMODE;
        this.emitWithState("GetPasswordIntent");
    },
    "AMAZON.HelpIntent": function() {
        this.handler.state = states.HELPMODE;
        this.emitWithState("HelpIntent");
        // this.response.speak(HELP_MESSAGE).listen(HELP_MESSAGE);
        // this.emit(":responseReady");
    },
    "Unhandled": function() {
        this.handler.state = states.STARTMODE;
        this.emitWithState("GetPasswordIntent");
    }
};

var startHandlers = Alexa.CreateStateHandler(states.STARTMODE,{
    "LaunchRequest": function () {
        if (debug_mode) {console.log('STARTMODE. LaunchRequest. request object: ' + JSON.stringify(this.event));};
        this.emit("GetPasswordIntent");
    },
    "GetPasswordIntent": function() {
      // new user - yay!
      if (debug_mode) {console.log('STARTMODE. GetPasswordIntent. request object: ' + JSON.stringify(this.event));};
      if(Object.keys(this.attributes).length === 0) { // Check if it's the first time the skill has been invoked
          if (debug_mode) {console.log('STARTMODE. GetPasswordIntent. First Use! Setting up data...');};
          this.attributes['phone_number_verified'] = 0;
          this.attributes['phone_number_blocked'] = 0;
          this.attributes['password_spoken_count'] = 0;
          this.attributes['password_received'] = 0;
          this.attributes['password_verified'] = 0;
          this.attributes['password_reset_count'] = 0;
          this.attributes['phoneNumberObject'] = {};
          this.attributes['passwordObject'] = {};
          this.attributes['first_use_timestamp'] = Date.now();
          this.response.speak('Welcome... this is how it will go... ask for help at any time. Are you ready to give me your ten digit phone number now?').listen('i did not win that one!');
          this.handler.state = states.READYTOGIVENUMBERSTATE
          this.emit(":responseReady");
      }
      // all setup, speak the password.
      else if (this.attributes['password_verified']) {
          passwordObject = this.attributes['passwordObject']
          if (debug_mode) {console.log('STARTMODE. GetPasswordIntent. Password is verified! Speaking it... ' + JSON.stringify(passwordObject));};
          this.attributes['password_spoken_count'] = (this.attributes['password_spoken_count'] + 1)
          this.response.speak('Your wifi password is ' + passwordObject.speakPassword).cardRenderer('WiFi Password',passwordObject.providedPassword, null);
          this.emit(":responseReady");
      }
      // owner of text number blocked it during setup
      else if (this.attributes['phone_number_verified'] && this.attributes['phone_number_blocked']) {
          phoneNumberObject = this.attributes['phoneNumberObject']
          this.response.speak('The phone number you provided and validated, ' + phoneNumberObject.speakPhoneNumber + ', was permanently blocked by the owner of the number. Do you want to continue with setup and provide a new phone number?').listen('i did not win that one!');
          this.handler.state = states.VERIFYSETUPMODE
          this.emitWithState("LaunchRequest");
      }
      else if (this.attributes['phone_number_verified']) {
          this.handler.state = states.SETUPPHONEMODE
          this.emit(':saveState', true);
          this.emitWithState("GetPasswordIntent");
      }
      else {
          if (debug_mode) {console.log('No phone number to work with at all...')};
          this.handler.state = states.VERIFYSETUPMODE
          this.emitWithState("LaunchRequest");
      }
    },
    "AMAZON.YesIntent": function() {
        this.emit(":responseReady");
    },
    "AMAZON.NoIntent": function() {
      this.emit(":responseReady");
    },
    "AMAZON.RepeatIntent": function() {
        this.emit("LaunchRequest");
    },
    "AMAZON.StopIntent": function() {
        this.emit(":responseReady");
    },
    "AMAZON.CancelIntent": function() {
        this.emit(":responseReady");
    },
    "AMAZON.StartOverIntent": function() {
        this.emit("LaunchRequest");
    },
    "AMAZON.HelpIntent": function() {
        this.response.speak(Messages.HELP).listen(Messages.HELP);
        this.emit(":responseReady");
    },
    "Unhandled": function() {
        this.emit("LaunchRequest");
    }
});

var verifyHandlers = Alexa.CreateStateHandler(states.READYTOGIVENUMBERSTATE,{
  "LaunchRequest": function () {
      if (debug_mode) {console.log('READYTOGIVENUMBERSTATE. LaunchRequest. request object: ' + JSON.stringify(this.event));};
      this.response.speak("I'm waiting for you to provide your twn digit phone number. Are you ready with that number now?").listen("If you want to continue the setup, simply launch me again.")
      this.emit(":responseReady");
  },
  "AMAZON.YesIntent": function() {
      this.handler.state = states.SETUPPHONEMODE;
      this.emitWithState(":responseReady");
  },
  "AMAZON.NoIntent": function() {
      this.response.speak("When you're ready to return and setup your wifi password, just launch me again.");
      this.handler.state = states.STARTMODE
      this.emitWithState(":responseReady");
  },
  "AMAZON.RepeatIntent": function() {
      this.response.speak("Are you ready to start the setup of your wifi password?").listen("If you want to continue the setup, simply launch me again.")
      this.emit(":responseReady");
  },
  "AMAZON.StopIntent": function() {
      this.emit(":responseReady");
  },
  "AMAZON.CancelIntent": function() {
      this.emit(":responseReady");
  },
  "AMAZON.StartOverIntent": function() {
      this.handler.state = states.STARTMODE
      this.emitWithState(":responseReady");
  },
  "AMAZON.HelpIntent": function() {
      //TODO
      this.response.speak(Messages.HELP).listen(Messages.HELP);
      this.emit(":responseReady");
  },
  "Unhandled": function() {
      if (debug_mode) {console.log('READYTOGIVENUMBERSTATE. Unhandled. request object: ' + JSON.stringify(this.event));};
      this.emit("LaunchRequest");
  }
});

var setupPhoneHandlers = Alexa.CreateStateHandler(states.SETUPPHONEMODE,{
    "LaunchRequest": function () {
        if (debug_mode) {console.log('SETUPPHONEMODE. LaunchRequest. request object: ' + JSON.stringify(this.event));};
        this.emit("GetPasswordIntent");
    },
    "GetPasswordIntent": function() {
      if (debug_mode) {console.log('SETUPPHONEMODE. GetPasswordIntent. request object: ' + JSON.stringify(this.event));};
      // password received but not verified - ask to verify
      if (this.attributes['wifi_password_verified'] == 0 && this.attributes['wifi_password']) {
          this.response.speak("I received your password. Thank you for sending me that." + Messages.SAMPLE_PASSWORD + "Is that correct?" ).listen("");
          this.handler.state = states.VERIFYMODE;
          this.emitWithState(":responseReady");
      }
      // password not received while phone number verified - ask for password
      else if (this.attributes['wifi_password_verified'] == 0 && this.attributes['phone_number_verified']) {
          this.response.speak("I have not received your password yet. Please reply to the text to send it to me. Did you recieve the text message?" ).listen("");
          this.handler.state = states.WAITINGMODE;
          this.emitWithState(":responseReady");
      }
      // user has provided phone number
      else if (this.event.request.hasOwnProperty('intent')) {
          if (this.event.request.intent.hasOwnProperty('slots')) {
              if (debug_mode) {console.log('verifying phone number from slot data...')};
              var phoneNumberToStore = isPhoneNumberValid(this.event.request, slotName); //slot value or false
              if (phoneNumberToStore) {
                  if (debug_mode){console.log("Saving Phone Number: " + JSON.stringify(phoneNumberObject))};
                  //save number, send text, tell user
                  this.attributes['phone_number'] = phoneNumberObject;
                  this.response.speak("Here\'s the number you gave me? " + phoneNumberObject['speakPhoneNumber'] + "Is that the correct number?").listen("well?").cardRenderer('Validate Your Phone Number','The number you provided was: ' + phoneNumberObject['cardPhoneNumber'] )
                  if (debug_mode) {console.log('just set the speak/listen/cardRenderer : ' + JSON.stringify(this.response))};
                  if (debug_mode) {console.log('STATE attirbute set the state : ' + this.attributes['STATE'])};
                  this.handler.state = states.VERIFYPHONEMODE;
                  this.emit(':saveState', true);
                  if (debug_mode) {console.log('just set the state : ' + JSON.stringify(this.handler.state))};
                  if (debug_mode) {console.log('STATE attirbute set the state : ' + this.attributes['STATE'])};
                  this.emitWithState(":responseReady");
              } else {
                  //no valid phone number or not provided at all
                  if (debug_mode) {console.log('Either no data, or invalid data in PhoneNumber slot')};
                  this.response.speak("In order to continue I require a valid U S based phone number. Be sure that you include your area. Are you ready to tell me the number?").listen("When you are ready to get setup, I will need to send you a text message.");
                  if (debug_mode) {console.log('Current response object : ' + JSON.stringify(this.response))};
                  if (debug_mode) {console.log('Current this.handler.state : ' + this.handler.state)};
                  this.emit(":responseReady");
              }
          }
      }
      // we have a phone number saved, need to verify it
      else if (this.attributes['phone_number']) {
          if (debug_mode) {console.log('going to verify saved phone number...')};
          // we have a saved phone number, no slot data...
          // assume we need validate it with the user and go from there...
          this.response.speak("Here\'s the number you gave me? " + phoneNumberObject['speakPhoneNumber'] + "Is that the correct number?").listen("well?").cardRenderer('Validate Your Phone Number','The number you provided was: ' + phoneNumberObject['cardPhoneNumber'] )
          this.handler.state = states.VERIFYPHONEMODE;
          this.emitWithState(":responseReady");
      }
      else if (this.event.request.hasOwnProperty('error')) {
          // log it!
          console.log(JSON.stringify(this.event.request.error));
          this.handler.state = states.STARTMODE;
          this.response.speak("Messed up!").cardRenderer("BOOM", JSON.stringify(this.event.request.error));
          this.emitWithState(":responseReady");
      }
      else {
          //no valid phone number or not provided at all
          if (debug_mode) {console.log('Either no data, or invalid data in PhoneNumber slot')};
          this.response.speak("In order to continue I require a valid U S based phone number. Be sure that you include your area. Are you ready to tell me the number?").listen("When you are ready to get setup, I will need to send you a text message.");
          if (debug_mode) {console.log('Current response object : ' + JSON.stringify(this.response))};
          if (debug_mode) {console.log('Current this.handler.state : ' + this.handler.state)};
          this.emit(":responseReady");
      }
    },
    "AMAZON.YesIntent": function() {
        this.response.speak("Give me your ten digit, U S based phone number now.").listen("When you are ready to get setup, I will need to send you a text message.");
        this.emit(":responseReady");
    },
    "AMAZON.NoIntent": function() {
        this.response.speak("I have been designed to only work with your phone number.");
        this.handler.state = states.STARTMODE;
        this.emitWithState(":responseReady");
    },
    "AMAZON.RepeatIntent": function() {
        //TODO
        this.emit(":responseReady");
    },
    "AMAZON.StartOverIntent": function() {
        this.handler.state = states.STARTMODE;
        this.emitWithState("GetPasswordIntent");
    },
    "AMAZON.StopIntent": function() {
        this.handler.state = states.STARTMODE;
        this.emit(':saveState', true);
    },
    "AMAZON.CancelIntent": function() {
        this.handler.state = states.STARTMODE;
        this.emit(':saveState', true);
    },
    "AMAZON.HelpIntent": function() {
        //TODO
        this.response.speak(Messages.HELP).listen(Messages.HELP);
        this.emit(":responseReady");
    },
    "Unhandled": function() {
        if (debug_mode) {console.log('SETUPPHONEMODE. Unhandled. request object: ' + JSON.stringify(this.event));};
        this.emitWithState("GetPasswordIntent");
    }
});

var verifyPhoneHandlers = Alexa.CreateStateHandler(states.VERIFYPHONEMODE,{
    "AMAZON.YesIntent": function() {
        this.attributes['phone_number_verified'] = -1;
        this.response.speak("I just sent you a text message. Please reply to that with your netowrk password. I'll save it as soon as I get it from you.");
        this.handler.state = states.WAITINGFORPASSWORDMODE;
        console.log(process.env.TWILIO_PHONE_NUMBER);
        console.log(phoneNumberObject.numberToText);
        client.messages.create({
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phoneNumberObject.numberToText,
          body: "Hello from the WiFi Password Skill. REPLY to this message with your WiFi password and I'll save it. You can then launch the Alexa skill and I will read it to you./nIf you did not request this text, REPLY with \'block\' and this this number will be permanently removed from our system. "
        }).then(function(err){
              if (err) {console.log(err);}
              this.emitWithState(":responseReady");
        });
        this.emit(":responseReady");
    },
    "AMAZON.NoIntent": function() {
        this.response.speak("Okay, let try this again. Give me your ten digit, U S based phone number now.").listen("When you are ready to get setup, I will need to send you a text message.");
        this.handler.state = states.SETUPPHONEMODE
        this.emitWithState(":responseReady");
    },
    "AMAZON.RepeatIntent": function() {
        this.response.speak("Here\'s the number you gave me? " + phoneNumberObject['speakPhoneNumber'] + "Is that the correct number?").listen("well?").cardRenderer('Validate Your Phone Number','The number you provided was: ' + phoneNumberObject['cardPhoneNumber'] )
        this.emit(":responseReady");
    },
    "AMAZON.StopIntent": function() {
        this.emit(":responseReady");
    },
    "AMAZON.CancelIntent": function() {
        this.emit(":responseReady");
    },
    "AMAZON.StartOverIntent": function() {
        this.handler.state = states.STARTMODE
        this.emit("LaunchRequest");
    },
    "AMAZON.HelpIntent": function() {
        //TODO
        this.response.speak(Messages.HELP).listen(Messages.HELP);
        this.emit(":responseReady");
    },
    "Unhandled": function() {
        if (debug_mode) {console.log('VERIFYPHONEMODE. Unhandled. request object: ' + JSON.stringify(this.event));};
        this.emit("AMAZON.RepeatIntent");
    }
});

var waitingForPasswordHandlers = Alexa.CreateStateHandler(states.WAITINGFORPASSWORDMODE,{
    "LaunchRequest": function () {
        if (debug_mode) {console.log('WAITINGFORPASSWORDMODE. LaunchRequest. request object: ' + JSON.stringify(this.event));};
        // did we get the password and it's not valdated
        // YES then say it and ask if it's correct
        // NO then tell them we are still waiting...
        if (this.attributes['password_received']){
            passwordObject = this.attributes['passwordObject']
            this.response.speak('Hi. I got your password. Here it is ' + passwordObject.speakPassword + ', is that the correct password?').listen('i did not win that one!').cardRenderer('Verify Wifi Password', passwordObject.providedPassword, null);
            this.handler.state = states.VERIFYSETUPMODE
            this.emitWithState("LaunchRequest");
        }
        else if (this.attributes['phone_number_verified'] && this.attributes['phone_number_blocked']) {
            phoneNumberObject = this.attributes['phoneNumberObject']
            this.response.speak('The phone number you provided and validated, ' + phoneNumberObject.speakPhoneNumber + ', was permanently blocked by the owner of the number. Do you want to continue with setup and provide a new phone number?').listen('i did not win that one!');
            this.handler.state = states.VERIFYSETUPMODE
            this.emitWithState("LaunchRequest");
        }
        else if (this.attributes['phone_number_verified']) {
            this.handler.state = states.SETUPPHONEMODE
            this.emit(':saveState', true);
            this.emitWithState("GetPasswordIntent");
        }
    },
    "AMAZON.YesIntent": function() {
        this.attributes['password_verified'] = -1;
        this.response.speak('YO!')
        this.emit(":responseReady");
    },
    "AMAZON.NoIntent": function() {
        this.emitWithState(":responseReady");
    },
    "AMAZON.RepeatIntent": function() {
        this.response.speak("Here\'s the number you gave me? " + phoneNumberObject['speakPhoneNumber'] + "Is that the correct number?").listen("well?").cardRenderer('Validate Your Phone Number','The number you provided was: ' + phoneNumberObject['cardPhoneNumber'] )
        this.emit(":responseReady");
    },
    "AMAZON.StopIntent": function() {
        this.emit(":responseReady");
    },
    "AMAZON.CancelIntent": function() {
        this.emit(":responseReady");
    },
    "AMAZON.StartOverIntent": function() {
        this.handler.state = states.STARTMODE
        this.emit("LaunchRequest");
    },
    "AMAZON.HelpIntent": function() {
        //TODO
        this.response.speak(Messages.HELP).listen(Messages.HELP);
        this.emit(":responseReady");
    },
    "Unhandled": function() {
        if (debug_mode) {console.log('WAITINGFORPASSWORDMODE. Unhandled. request object: ' + JSON.stringify(this.event));};
        this.emit("LaunchRequest");
    }
});

var verifyPasswordHandlers = Alexa.CreateStateHandler(states.VERIFYPASSWORDMODE,{
    "LaunchRequest": function () {
        if (debug_mode) {console.log('VERIFYPASSWORDMODE. LaunchRequest. request object: ' + JSON.stringify(this.event));};
        this.emit("AMAZON.RepeatIntent");
    },
    "AMAZON.YesIntent": function() {
        this.attributes['phone_number_verified'] = -1;
        this.response.speak("I just sent you a text message. Please reply to that with your netowrk password. I'll save it as soon as I get it from you.");
        this.handler.state = states.WAITINGFORPASSWORDMODE;
        console.log(process.env.TWILIO_PHONE_NUMBER);
        console.log(phoneNumberObject.numberToText);
        client.messages.create({
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phoneNumberObject.numberToText,
          body: "Hello from the WiFi Password Skill. REPLY to this message with your WiFi password and I'll save it. You can then launch the Alexa skill and I will read it to you./nIf you did not request this text, REPLY with \'block\' and this this number will be permanently removed from our system. "
        }).then(function(err){
              if (err) {console.log(err);}
              this.emitWithState(":responseReady");
        });
        this.emit(":responseReady");
    },
    "AMAZON.NoIntent": function() {
        this.response.speak("Okay, let try this again. Give me your ten digit, U S based phone number now.").listen("When you are ready to get setup, I will need to send you a text message.");
        this.handler.state = states.SETUPPHONEMODE
        this.emitWithState(":responseReady");
    },
    "AMAZON.RepeatIntent": function() {
        this.response.speak("Here\'s the number you gave me? " + phoneNumberObject['speakPhoneNumber'] + "Is that the correct number?").listen("well?").cardRenderer('Validate Your Phone Number','The number you provided was: ' + phoneNumberObject['cardPhoneNumber'] )
        this.emit(":responseReady");
    },
    "AMAZON.StopIntent": function() {
        this.emit(":responseReady");
    },
    "AMAZON.CancelIntent": function() {
        this.emit(":responseReady");
    },
    "AMAZON.StartOverIntent": function() {
        this.handler.state = states.STARTMODE
        this.emit("LaunchRequest");
    },
    "AMAZON.HelpIntent": function() {
        //TODO
        this.response.speak(Messages.HELP).listen(Messages.HELP);
        this.emit(":responseReady");
    },
    "Unhandled": function() {
        if (debug_mode) {console.log('VERIFYPASSWORDMODE. Unhandled. request object: ' + JSON.stringify(this.event));};
        this.emit("AMAZON.RepeatIntent");
    }
});

function isPhoneNumberValid(request, slotName){
    var slot = request.intent.slots[slotName];
    var slotPhoneNumber;
    //if we have a slot, get the text and store it into speechOutput
    if (slot && slot.value) {
        //we have a value in the slot
        slotPhoneNumber = slot.value.toLowerCase();
        if (debug_mode){console.log("Validaing Phone Number: " + slotPhoneNumber)};
        if (phoneUtil.isValidNumber(phoneUtil.parse(slotPhoneNumber, 'US'))) {
            if (debug_mode){console.log("VALID US PHONE NUBMER!")};
            buildPhoneNumberObject(slotPhoneNumber);
            return slotPhoneNumber;
        }
        else {
            if (debug_mode){console.log("NOT VALID US PHONE NUBMER!")};
            return false;
        }
    } else {
        //we didn't get a value in the slot.
        if (debug_mode){console.log("NO VALUE IN {PhoneNumber} SLOT OR SLOT NOT FOUND. Request Object: " + JSON.stringify(request))};
        return false;
    }
};

function buildPhoneNumberObject(PhoneNumber) {
    // providedPhoneNumber:6165402552, numberToText:'+16165402552' cardPhoneNumber:'(616) 540-2552',speakPhoneNumber:'6<break time=\'.309\'>1<break time=\'.309\'>6<break time=\'.309\'> ...'}
    phoneNumberObject["providedPhoneNumber"] = PhoneNumber;
    phoneNumberObject["numberToText"] = '+1' +PhoneNumber;
    phoneNumberObject["cardPhoneNumber"] = formatPhoneNumber(PhoneNumber);
    phoneNumberObject["speakPhoneNumber"] = formatSpokenPhoneNumber(PhoneNumber);
};

function formatPhoneNumber(num) {
    var str = num.toString();
    var matched = str.match(/\d+\.?\d*/g);

    // 10 digit
    if (matched.length === 3) {
        return '(' + matched[0] + ') ' + matched[1] + '-' + matched[2];
    // 7 digit
    } else if (matched.length === 2) {
        return matched[0] + '-' + matched[1];
    }
    // no formatting attempted only found integers (i.e. 1234567890)
    else if (matched.length === 1) {
        // 10 digit
        if (matched[0].length === 10) {
            return '(' + matched[0].substr(0, 3) + ') ' + matched[0].substr(3, 3) + '-' + matched[0].substr(6);
        }
        // 7 digit
        if (matched[0].length === 7) {
            return matched[0].substr(0, 3) + '-' + matched[0].substr(3);
        }
    }
    // Format failed, return number back
    return num;
};

function formatSpokenPhoneNumber(num) {
    var str = num.toString();
    var stringToSpeak = '';
    const BREAKSSML = '<break time=\'.309\' />';
    for(i=0; i<str.length; i++) {
      stringToSpeak += str.charAt(i) + BREAKSSML;
    }
    return stringToSpeak
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max-min+1)+min);
};

function getSpeechCon(type) {
    var speechCon = "";
    if (type) return "<say-as interpret-as='interjection'>" + Messages.SPEECHCONS_CORRECT[getRandom(0, speechConsCorrect.length-1)] + "! </say-as><break strength='strong'/>";
    else return "<say-as interpret-as='interjection'>" + Messages.SPEECHCONS_WRONG[getRandom(0, speechConsWrong.length-1)] + " </say-as><break strength='strong'/>";
};
