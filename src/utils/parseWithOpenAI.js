export default async function parseWithOpenAI(ocrText) {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'user',
          content: `
You are a smart parser for OCR text from betting slip screenshots.

Your task:
- Extract all bets from the text.
- Return data as a JSON array where each object represents a bet.

If a bet is a **parlay**:
- Include type: "parlay"
- Include legs: an array of individual legs, where each leg includes:
  - market
  - side
- Include combined_odds (e.g. "8.92")

For all bets (including parlays and singles), include:
- game (e.g. "Spain v England")
- market (e.g. "Moneyline", "Anytime Goalscorer")
- side (e.g. "Spain", "Dani Olmo")
- odds (e.g. "+470", "-154", "1.04")
- stake (e.g. "$5.00")
- payout (e.g. "$49.50")
- status (e.g. "Finished", "Open")
- bet_id (e.g. "#92421933.25")
- placed (e.g. "Jul 14, 2024 3:32PM ET")
- other_info: include any additional useful details to fully identify the bet (such as sportsbook name, time period, or other labels found in the text)

Rules:
- Output valid JSON only, no code block markers, no explanation
- If a field is missing, leave it as an empty string ""
- Group multiple bets in a single JSON array

Here is the OCR text:
${ocrText}
`
        }
      ],
      temperature: 0
    })
  });

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || '';
  const cleanContent = content
    .replace(/```json/, '')
    .replace(/```/, '')
    .trim();

  try {
    console.log('OpenAI response:', cleanContent);
    return JSON.parse(cleanContent);
  } catch (e) {
    console.error('Invalid JSON from OpenAI:', cleanContent);
    return [];
  }
}
