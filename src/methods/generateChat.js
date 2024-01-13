export const generateResponse = async (messageToBotAI, openai) => {
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
