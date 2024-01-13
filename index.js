import { Client, GatewayIntentBits, Events } from "discord.js";
import OpenAI from "openai";
import "dotenv/config";
import limiterString from "./src/methods/limitString.js";

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

const main = async (messageToBotAI) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: messageToBotAI }],
      model: "gpt-3.5-turbo",
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Erreur lors de la génération de la réponse:", error);
    throw error;
  }
};

client.on("messageCreate", async (message) => {
  if (
    message.content.includes("<@&1063570913230082252>") ||
    message.content.includes("<@1063533407751127060>")
  ) {
    try {
      const msg = await main(message.content);

      if (msg) {
        message
          .reply(limiterString(msg))
          .catch((error) =>
            console.error("Erreur lors de l'envoi du message:", error)
          );
      }
    } catch (err) {
      console.error(err);
    }
  }
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Prêt ! Connecté en tant que ${readyClient.user.tag}`);
});

client
  .login(token)
  .catch((error) => console.error("Erreur lors de la connexion:", error));
