import { MessageMedia } from "whatsapp-web.js";
import * as cli from "../cli/ui";
import { Client, CraiyonOutput } from "craiyon"

const handleMessageDALLE_mini = async (message: any, prompt: any) => {
	try {
		const start = Date.now();

		cli.print(`[message] Received prompt from ${message.from}: ${prompt}`);

        const craiyon = new Client();

        const result = await craiyon.generate({
        prompt: prompt,
        maxRetries: 5,
        });

		// Convert the response to base64
		const base64Images = result.asBase64();

		const end = Date.now() - start;

		//Check images have return
		if (base64Images && base64Images.length > 0) {
			const base64 = base64Images[0];
			
			const image = new MessageMedia("image/jpeg", base64, "image.jpg");
  
			cli.print(`[DALLE_mini] Answer to ${message.from} | OpenAI request took ${end}ms`);
  
			message.reply(image);
		  } else {
			// Handle the case where no images were returned
			console.log("No images were returned");
			message.reply("No images were returned");
		  }


	} catch (error: any) {
		console.error("An error occured", error);
		message.reply("An error occured, please contact the administrator. (" + error.message + ")");
	}
};

export { handleMessageDALLE_mini };
