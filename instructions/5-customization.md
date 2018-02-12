# Build An Alexa Flash Briefing Skill
[![Voice User Interface](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/1-locked._TTH_.png)](./1-voice-user-interface.md)[![Lambda Function](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/2-locked._TTH_.png)](./2-lambda-function.md)[![Connect VUI to Code](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/3-locked._TTH_.png)](./3-connect-vui-to-code.md)[![Testing](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/4-locked._TTH_.png)](./4-testing.md)[![Customization](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/5-on._TTH_.png)](./5-customization.md)[![Publication](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/6-off._TTH_.png)](./6-publication.md)

## Required Customization

### Replace the Provided Data with Your Own

1. Modify the Node.js code to edit the **skill's title**.

	![](05-customization-index.png)

	- Open ```./lambda/src/index.js```
	- Edit the **skillTitle** constant
	- Save the file

2. Modify the Node.js code to edit the **daily data**.

	![](05-customization-data.png)

	- Use this [Google Sheets template](https://docs.google.com/spreadsheets/d/1_pitjZcZ46vReytXG2sAOg4eD5U2VS_Pe83a1-PoKIQ/edit?usp=sharing) to ease the creation of your data.
	- Open```./lambda/src/data.js```
	- Replace the existing data your own
	- Save the file

3. **Archive the Lambda function code**. Navigate into the `/lambda/src` directory and run the npm command: `npm run zip`. This will overwrite or create `/lambda/index.zip`.

	```bash
	$ npm run zip
	```

4.  **Upload the code**.
  * Open your skill's Lambda funciton in the AWS [Lambda Management Console](https://console.aws.amazon.com/lambda/home).
  * Under **code entry type** select **Upload a .ZIP file**.
  * **Upload** the **lambda/index.zip** file you just created.
  * Click **Save**.

5. **Test** your updated skill using the same methods in the [Testing](./4-testing.md) step and resolve any errors or issues as needed.

5. Move on to the [Publication](./6-publication.md) step.

<br/><br/>
<a href="./6-publication.md"><img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/buttons/button_next_publication._TTH_.png" /></a>
