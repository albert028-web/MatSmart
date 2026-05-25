export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { budget, idea } = req.body;

    const prompt = `
Du er MatSmart AI, en norsk middagsassistent.

Brukeren har følgende budsjett: ${budget} kr
Ønske: ${idea || "ingen spesifikk rett"}

Gi:
1. Et billig og realistisk middagsforslag i Norge
2. Ingredienser som kan kjøpes på Kiwi, Rema 1000 eller Coop Extra
3. Ca pris
4. En enkel steg-for-steg oppskrift
5. Tips for å holde det billig

Svar kort, praktisk og vennlig.
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Du er en hjelpsom norsk matassistent." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    const answer = data.choices?.[0]?.message?.content;

    res.status(200).json({ result: answer });

  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
}
