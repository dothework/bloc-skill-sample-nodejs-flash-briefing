# Build An Alexa Flash Briefing Skill
[![Voice User Interface](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/1-locked._TTH_.png)](./1-voice-user-interface.md)[![Lambda Function](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/2-locked._TTH_.png)](./2-lambda-function.md)[![Connect VUI to Code](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/3-on._TTH_.png)](./3-connect-vui-to-code.md)[![Testing](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/4-off._TTH_.png)](./4-testing.md)[![Customization](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/5-off._TTH_.png)](./5-customization.md)[![Publication](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/6-off._TTH_.png)](./6-publication.md)

## Connecting Your Flash Briefing Skill To Your API Endpoint

In [Voice User Interface](./1-voice-user-interface.md) step we created our skill.  In [Lambda Function](./2-lambda-function.md) step we created a Lambda function and API Endpoint for the skill. In this step, we connect those two pieces together.

1.  Go back to the **[Amazon Developer Portal](https://developer.amazon.com/edw/home.html#/skills/list)** and select your skill from the list. You may still have a browser tab open if you started at the beginning of this tutorial.

2.  Open the **Configuration** tab on the left side.

    <img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/3-2-configuration-tab._TTH_.png" />

3.  Enter a **Custom Error Message**, then click **Add new feed**.

    ![](03-custom-error.png)

4. Fill out the **Feed Information** screen. Make sure to review the **Feed Information Tips** below this screenshot.

   ![](03-feed-information.png)

	### Feed Information Tips

    - **Preamble** Enter an appropriate preamble.
    - **Name** The name is only shown in the developer portal.
    - **Content update frequency** This template provides an update daily.
    - **Content type** Select the **Text** option.
    - **Content genre** Choose the appropriate genre.
    - **URL** Enter the **Invoke URL** you created in the [Lambda Function step](./2-lambda-function.md) of this guide.
	- **Feed Icon** Upload your skill's 512x512px icon. You can find detailed instructions for icons in the [Publication step](6-publication.md).

5.  Click the **Save** button, then click on **Next** to move to the **Testing** screen.

	![Next](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/3-7-next-button._TTH_.png)

6.  In our next step of this guide, we will be testing the flash briefing skill.

<br/><br/>
<a href="./4-testing.md"><img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/buttons/button_next_testing._TTH_.png" /></a>
