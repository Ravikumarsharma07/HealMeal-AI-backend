import OpenAI from "openai";

const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1-mini";

const generateDietPlan = async (patientInfo, availablePantry) => {
  try {
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
- An "ingredients" array (try to use pantry items from the given pantry list 'not necessary').

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

    const client = new OpenAI({ baseURL: endpoint, apiKey: process.env.GITHUB_TOKEN });

    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful nutritionist." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      top_p: 1,
      model: model,
    });

    const rawOutput = response.choices[0].message.content.trim();
    const cleanedOutput = rawOutput
    .replace(/```json/i, "")
    .replace(/```/g, "")
    .trim();
    
    const dietPlanJson = JSON.parse(cleanedOutput);
    return dietPlanJson;
  } catch (error) {
    console.log(
      "Error generating diet plan:",
      error.response?.data || error.message
    );
    return null;
  }
};

export default generateDietPlan;
