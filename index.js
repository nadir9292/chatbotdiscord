import {
  Client,
  GatewayIntentBits,
  Events,
  EmbedBuilder,
  AttachmentBuilder,
} from "discord.js";
import OpenAI from "openai";
import "dotenv/config";
import limiterString from "./src/methods/limitString.js";
import { generateResponse } from "./src/methods/generateChat.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_TOKEN });
const token = process.env.DISCORD_TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.on("messageCreate", async (message) => {
  const mentionsImage =
    message.content.includes("<@&1063570913230082252>") &&
    message.content.includes("image");
  const mentionsBot =
    message.content.includes("<@1063533407751127060>") &&
    message.content.includes("image");

  if (mentionsImage || mentionsBot) {
    try {
      const file = new AttachmentBuilder(
        "https://upload.wikimedia.org/wikipedia/fr/thumb/7/76/Logo_Colombes.svg/1280px-Logo_Colombes.svg.png"
      );

      message.reply({ files: [file] }).catch((error) => {
        console.error("Erreur lors de l'envoi du message:", error);
      });
    } catch (err) {
      console.error(err);
    }
  } else if (
    message.content.includes("<@&1063570913230082252>") ||
    message.content.includes("<@1063533407751127060>")
  ) {
    try {
      const response = await generateResponse(message.content, openai);

      if (response) {
        message.reply(limiterString(response)).catch((error) => {
          console.error("Erreur lors de l'envoi du message:", error);
        });
      }
    } catch (err) {
      console.error(err);
    }
  }
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Prêt ! Connecté en tant que ${readyClient.user.tag}`);
});

client.login(token).catch((error) => {
  console.error("Erreur lors de la connexion:", error);
});
