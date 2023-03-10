import qrcode from "qrcode-terminal";
import { Client, Message, Events, LocalAuth } from "whatsapp-web.js";

// Constants
import constants from "./constants";

// CLI
import * as cli from "./cli/ui";
import { handleIncomingMessage } from "./handlers/message";

// Entrypoint
const start = async () => {
	cli.printIntro();

	// WhatsApp Client
	const client = new Client({
		puppeteer: {
			args: ["--no-sandbox"]
		},
		authStrategy: new LocalAuth({
			clientId: undefined,
			dataPath: constants.sessionPath
		})
	});

	// WhatsApp auth
	client.on(Events.QR_RECEIVED, (qr: string) => {
		qrcode.generate(qr, { small: true }, (qrcode: string) => {
			cli.printQRCode(qrcode);
		});
	});

	// WhatsApp loading
	client.on(Events.LOADING_SCREEN, (percent) => {
		if (percent == "0") {
			cli.printLoading();
		}
	});

	// WhatsApp authenticated
	client.on(Events.AUTHENTICATED, () => {
		cli.printAuthenticated();
	});

	// WhatsApp authentication failure
	client.on(Events.AUTHENTICATION_FAILURE, () => {
		cli.printAuthenticationFailure();
	});

	// WhatsApp ready
	client.on(Events.READY, () => {
		cli.printOutro();
	});

	// WhatsApp message
	client.on(Events.MESSAGE_RECEIVED, async (message: any) => {
		// Ignore if message is from status broadcast
		if (message.from == constants.statusBroadcast) return;

		// // Ignore if it's a quoted message, (e.g. Bot reply)
		// if (message.hasQuotedMsg) return;

		// Ignore if it's not from me
		if (message.fromMe) return;

		// // Check if the message mentions the bot with "@"
		// const mentions = await message.getMentions();

		// const botMentioned = mentions.some((contact) => contact.isMe);

		// // Check if the message body contains "@Chatgpt_test"
		// const includesText = message.body.includes("Chatgpt_test");

		// if ( botMentioned || includesText ) {
		// 	await handleIncomingMessage(message);
		// }
		
		await handleIncomingMessage(message);

		
	});

	// Reply to own message
	// client.on(Events.MESSAGE_CREATE, async (message: Message) => {
	// 	// Ignore if message is from status broadcast
	// 	if (message.from == constants.statusBroadcast) return;

	// 	// // Ignore if it's a quoted message, (e.g. Bot reply)
	// 	// if (message.hasQuotedMsg) return;

	// 	// Ignore if it's not from me
	// 	if (message.fromMe) return;

	// 	// // Check if the message body contains "@Chatgpt_test"
	// 	// if (message.body.includes("@Chatgpt_test")) 


	// 	await handleIncomingMessage(message);
	// });

	// WhatsApp initialization
	client.initialize();
};

start();
