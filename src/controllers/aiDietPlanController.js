import { OpenAI } from "openai";

const generateDietPlan = async (patientInfo, availablePantry) => {
  try {
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.COHERE_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
        "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
      },
    });
    const prompt = `Generate a JSON object with 3 meals: morning, evening, and night (eg.- {
  morning: {
    name: 'Vegetable Omelette',
    ingredients: [ 'Eggs', 'Vegetables', 'Butter', 'Salt', 'Spices' ]  },
  evening: {
    name: 'Grilled Chicken with Rice',
    ingredients: [ 'Chicken', 'Rice', 'Spices', 'Salt', 'Oils' ]     
  },
  night: {
    name: 'Fish Curry with Bread',
    ingredients: [ 'Fish', 'Spices', 'Salt', 'Oils', 'Bread' ]       
  }
}
). Each meal must include:
- A "name" (the dish name),
- An "ingredients" array (try to use pantry items from the given pantry list 'not necessary' ).

The meals must:
- Be suitable for the patient's dietary restrictions,
- Match any known diseases or allergies,
- Use the pantry items listed below (not strictly necessary).

Return only the JSON object. No explanation, no extra text.

### Patient Info:
'''${patientInfo}'''

### Pantry Items:
'''${availablePantry}'''
`;

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 200,
      temperature: 0.8, // Controls randomness of response
      top_p: 1, // Nucleus sampling, often kept at 1
      frequency_penalty: 0, // Penalize repeated phrases
      presence_penalty: 0, // Encourage introducing new topics
    });
    const dietPlan = completion.choices[0].message.content
      .replace(/```json/i, "")
      .replace(/```/g, "")
      .trim();
    const dietPlanJson = JSON.parse(dietPlan);
    return dietPlanJson;
  } catch (error) {
    console.log(error);
    return;
  }
};

export default generateDietPlan;
