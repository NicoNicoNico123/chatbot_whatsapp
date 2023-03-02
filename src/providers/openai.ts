import { ChatGPTAPI,ChatGPTUnofficialProxyAPI } from "chatgpt";
import { Configuration, OpenAIApi } from "openai";
import config from "../config";

//ChatGPT Client (text-davinci-003)
// export const chatgpt = new ChatGPTAPI({
// 	apiKey: config.openAIAPIKey

// });

// // ChatGPT Client (ChatGPTUnofficialProxyAPI)
export const chatgpt = new ChatGPTUnofficialProxyAPI({
    accessToken: config.opentoken,
	debug: false,
	apiReverseProxyUrl:"https://gpt.pawan.krd/backend-api/conversation"
  });

// OpenAI Client (DALL-E)
export const openai = new OpenAIApi(
	new Configuration({
		apiKey: config.openAIAPIKey
	})
);
