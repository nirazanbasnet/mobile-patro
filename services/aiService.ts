/**
 * Service to interact with Groq AI for cultural and ritual information.
 */

// IMPORTANT: The Groq API key is loaded from .env (EXPO_PUBLIC_GROQ_API_KEY)
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface RitualGuide {
    title: string;
    items: string[];
    steps: string[];
}

/**
 * Generates a ritual guide based on the Tithi using Groq.
 */
export async function generateRitualGuide(tithi: string, language: string): Promise<RitualGuide> {
    if (!GROQ_API_KEY) {
        throw new Error('Please configure EXPO_PUBLIC_GROQ_API_KEY in your .env file');
    }

    const isEn = language === 'en';
    
    const prompt = `
        As a Nepali cultural expert, provide a step-by-step ritual guide and a list of required items (Sait-Saaman) for the Tithi: "${tithi}".
        The response must be in ${isEn ? 'English' : 'Nepali'}.
        
        Format the response strictly as a JSON object with the following structure:
        {
            "title": "Short title of the ritual",
            "items": ["Item 1", "Item 2", ...],
            "steps": ["Step 1", "Step 2", ...]
        }
        
        Only return the JSON object. Do not add any conversational text or markdown.
    `;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "You are a Nepali cultural and ritual expert. You provide accurate and structured information about Nepali traditions."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                stream: false,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `Groq API Error: ${response.status}`);
        }

        const data = await response.json();
        const contentText = data.choices?.[0]?.message?.content;
        
        if (!contentText) {
            throw new Error('Groq returned an empty response.');
        }

        const ritualData: RitualGuide = JSON.parse(contentText);
        return ritualData;
    } catch (error) {
        console.error('Error in generateRitualGuide (Groq):', error);
        throw error;
    }
}
