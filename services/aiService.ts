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

export interface SmartEvent {
    title: string;
    date: {
        year: number;
        month: number;
        day: number;
    };
    note: string;
    reminderEnabled: boolean;
    remindAtTime?: string; // e.g. "10:00"
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

/**
 * Parses a natural language input into a structured event object.
 */
export async function parseSmartEvent(input: string, currentBsDate: { year: number, month: number, day: number }): Promise<SmartEvent> {
    if (!GROQ_API_KEY) {
        throw new Error('Please configure EXPO_PUBLIC_GROQ_API_KEY in your .env file');
    }

    const prompt = `
        As a smart assistant for a Nepali Calendar app, parse the following user input into a structured event JSON.
        
        Today's Bikram Sambat (BS) date is: ${currentBsDate.year}-${currentBsDate.month}-${currentBsDate.day}.
        Current Year is ${currentBsDate.year} BS.
        
        User Input: "${input}"
        
        Bikram Sambat Months (in order):
        1. Baisakh
        2. Jestha
        3. Ashadh
        4. Shrawan
        5. Bhadra
        6. Ashwin
        7. Kartik
        8. Mangsir
        9. Poush
        10. Magh
        11. Falgun
        12. Chaitra
        
        Guidelines:
        1. Resolve relative dates like "tomorrow", "day after tomorrow", "next Monday" based on the provided current BS date.
        2. If a specific BS month is mentioned (e.g., "15th Baisakh", "Baisakh 15", "Chaitra 26"), map it to the correct month number using the month list above. If no year is mentioned, assume ${currentBsDate.year} or the next occurrence.
        3. Extract the event title and any additional notes.
        4. Detect if the user wants a reminder or mentioned a specific time (e.g., "at 10 AM", "remind me").
        
        Format the response strictly as a JSON object:
        {
            "title": "Clean event title",
            "date": { "year": number, "month": number, "day": number },
            "note": "Any additional context or the original input if no specific note",
            "reminderEnabled": boolean,
            "remindAtTime": "HH:mm" (24h format, if time detected, else omit)
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
                        content: "You are a precise date parsing assistant. You output only valid JSON."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.1, // Low temperature for high precision
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

        return JSON.parse(contentText) as SmartEvent;
    } catch (error) {
        console.error('Error in parseSmartEvent (Groq):', error);
        throw error;
    }
}

