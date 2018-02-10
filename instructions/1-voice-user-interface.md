# Build An Alexa Flash Briefing Skill
[![Voice User Interface](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/1-on._TTH_.png)](./1-voice-user-interface.md)[![Lambda Function](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/2-off._TTH_.png)](./2-lambda-function.md)[![Connect VUI to Code](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/3-off._TTH_.png)](./3-connect-vui-to-code.md)[![Testing](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/4-off._TTH_.png)](./4-testing.md)[![Customization](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/5-off._TTH_.png)](./5-customization.md)[![Publication](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/6-off._TTH_.png)](./6-publication.md)

## Setting up Your Alexa Skill in the Developer Portal

There are two parts to an Alexa flash briefing skill.  The first part is the skill configuration and public facing details.  This is where we define the skill and specify where the skill will access the flash briefing data.  The second part is the combination of the actual code logic and API endpoint for our skill, and we will handle that in the [Lambda Function step](./2-lambda-function.md) of this guide. 

1.  Go to the **[Amazon Developer Portal](http://developer.amazon.com).**  In the top-right corner of the screen, click the **Sign In** button.</br>(If you don't already have an account, you will be able to create a new one for free.)

    <a href="http://developer.amazon.com" target="_new"><img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/1-1-developer-portal._TTH_.png" /></a>

2.  Once you have signed in, click the **Alexa** button at the top of the screen.

	<a href="https://developer.amazon.com/edw/home.html#/" target="_new"><img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/1-2-alexa-button._TTH_.png" /></a>

3.  On the Alexa page, choose the **Get Started** button for the **Alexa Skills Kit**.

	<a href="https://developer.amazon.com/edw/home.html#/skills/list" target="_new"><img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/1-3-alexa-skills-kit._TTH_.png" /></a>

4.  Select **Add A New Skill**.

	<a href="https://developer.amazon.com/edw/home.html#/skill/create/" target="_new"><img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/1-4-add-a-new-skill._TTH_.png" /></a>

5.  Fill out the **Skill Information** screen. Make sure to review the **Skill Information Tips** below this screenshot.

	![](1-new-skill-information.png)

	### Skill Information Tips

    - **Skill Type** For this skill, we are creating a skill using the Flash Briefing Skill API.
    - **Language** Choose the language you want to support. A Flash Briefing Skill can only support one language. (This guide is using U.S. English to start.) 
    - **Name** This is the name that will be shown in the Alexa Skills Store and the name your users will refer to.

6.  Click the **Save** button, then click on **Next** to move to the **Interaction Model** screen.

	<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/1-6-next-button._TTH_.png" />

	> There is no interaction model for a flash briefing skill. 

6.  Click the **Next** button to move to the **Configuration** screen.

	<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/1-6-next-button._TTH_.png" />

7.  In our next step of this guide, we will be creating our Lambda function and API endpoint in the AWS developer console.

<br/><br/>
<a href="./2-lambda-function.md"><img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/buttons/button_next_lambda_function._TTH_.png" /></a>
