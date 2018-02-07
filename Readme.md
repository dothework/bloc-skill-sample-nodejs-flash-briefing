#  Build An Alexa Flash Briefing Skill

This Alexa sample skill is a template for a flash briefing skill. This flash briefing skill will read today's quote.

If this is your first time here, you're new to Alexa Skills Development, or you're looking for more detailed instructions, click the **Get Started** button below:

<p align='center'>
<a href='./instructions/0-intro.md'><img src='https://camo.githubusercontent.com/db9b9ce26327ad3bac57ec4daf0961a382d75790/68747470733a2f2f6d2e6d656469612d616d617a6f6e2e636f6d2f696d616765732f472f30312f6d6f62696c652d617070732f6465782f616c6578612f616c6578612d736b696c6c732d6b69742f7475746f7269616c732f67656e6572616c2f627574746f6e732f627574746f6e5f6765745f737461727465642e5f5454485f2e706e67'></a>
</p>


Be sure to take a look at the [Additional Resources](#additional-resources) at the bottom of this page!


## About
**Note:** The rest of this readme assumes you have your developer environment ready to go and that you have some familiarity with CLI (Command Line Interface) Tools, [AWS](https://aws.amazon.com/), and the [ASK Developer Portal](https://developer.amazon.com/alexa-skills-kit). If not, [click here](./instructions/0-intro.md) for a more detailed walkthrough.



### Usage

```text
Alexa, flash briefing.
	>> From My Flash Briefing, Hard work pays off...
```

### Repository Contents
* `/.ask`	- [ASK CLI (Command Line Interface) Configuration](https://developer.amazon.com/docs/smapi/ask-cli-intro.html)	 
* `/lambda/src` - Back-End Logic for the Alexa Skill hosted on [AWS Lambda](https://aws.amazon.com/lambda/)
* `/instructions` - Step-by-Step Instructions for Getting Started
* `skill.json`	- [Skill Manifest](https://developer.amazon.com/docs/smapi/skill-manifest.html)

## Setup w/ ASK CLI

### Pre-requisites

* Node.js (> v6.10)
* Register for an [AWS Account](https://aws.amazon.com/)
* Register for an [Amazon Developer Account](https://developer.amazon.com/)
* Install and Setup [ASK CLI](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html)

### Installation
1. Clone the repository.

	```bash
	$ git clone https://github.com/dothework/bloc-skill-sample-nodejs-flash-briefing/
	```

2. Initiatialize the [ASK CLI](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html) by Navigating into the repository and running npm command: `ask init`. Follow the prompts.

	```bash
	$ cd bloc-skill-sample-nodejs-flash-briefing
	$ ask init
	```

3. Install npm dependencies by navigating into the `/lambda/src` directory and running the npm command: `npm install`

	```bash
	$ cd lambda/src
	$ npm install
	```

### Deployment

1. Deploy the Lambda function. The Lambda function will be created in ```us-east-1 (Northern Virginia)``` by default. That can be changed by editing `/lambda/src/package.json`. You can also change the name of the function to suit your needs. Save the file. Then navigate into the `/lambda/src` directory and running the npm command: `npm run init` & `npm run deploy`

**Only run the `npm init` command once.** Subsequent executions will fail.  

```bash
$ npm run init
$ npm run deploy
```

2. Deploy to the API Gateway.

3. Edit the `url` key:value pair. Replace the existing value of `https://aaaaaaaaaa.execute-api.us-east-1.amazonaws.com/prod/alexaFBSkillQuoteToday` with your API endpoint.

4. Deploy the skill by running the following command:

	```bash
	$ ask deploy
	```

### Testing

1. To test, you need to login to Alexa Developer Console, and enable the "Test" switch on your skill from the "Test" Tab.

2. Simulate verbal interaction with your skill through the command line using the following example:

	```bash
	 $ ask simulate -l en-GB -t "start reindeer trivia"

	 ✓ Simulation created for simulation id: 4a7a9ed8-94b2-40c0-b3bd-fb63d9887fa7
	◡ Waiting for simulation response{
	  "status": "SUCCESSFUL",
	  ...
	 ```

3. Once the "Test" switch is enabled, your skill can be tested on devices associated with the developer account as well. Speak to Alexa from any enabled device or through your Amazon Mobile App and say :

	```text
	Alexa, flash briefing
	```

## Customization

1. ```./skill.json```

   Change the skill name, skill description, feed details, icons, testing instructions etc ...

   See the Skill [Manifest Documentation](https://developer.amazon.com/docs/smapi/skill-manifest.html) for more information.

2. ```./lambda/src/index.js```

   Modify the skillTitle constant.

3. Copy this [Google Sheet data template](https://docs.google.com/spreadsheets/d/1_pitjZcZ46vReytXG2sAOg4eD5U2VS_Pe83a1-PoKIQ/edit?usp=sharing) and replace the quote data with your own data. Copy column B, rows 3-368. Paste **Values** Only into column A, rows 3-368. Copy column A, rows 3-268.

4.  ```./lambda/src/data.js```

	 Paste the data from step 3 above.

## Additional Resources

### Community
* [Amazon Developer Forums](https://forums.developer.amazon.com/spaces/165/index.html) - Join the conversation!
* [Hackster.io](https://www.hackster.io/amazon-alexa) - See what others are building with Alexa.

### Tutorials & Guides
* [Voice Design Guide](https://developer.amazon.com/designing-for-voice/) - A great resource for learning conversational and voice user interface design.

### Documentation
* [Official Alexa Skills Kit Node.js SDK](https://www.npmjs.com/package/alexa-sdk) - The Official Node.js SDK Documentation
*  [Official Alexa Skills Kit Documentation](https://developer.amazon.com/docs/ask-overviews/build-skills-with-the-alexa-skills-kit.html) - Official Alexa Skills Kit Documentation
