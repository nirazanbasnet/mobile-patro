/**
 * Service to interact with Cerebras AI for cultural and ritual information.
 *
 * Requests go through our own backend (supabase/functions/ai-proxy), which holds
 * the Cerebras API key. Nothing secret is referenced here — anything inlined into
 * this file with an EXPO_PUBLIC_ prefix ends up readable inside the shipped app
 * binary (verified: a plain `strings` on the Hermes bundle recovers it).
 *
 * Note: the Cerebras key must come from a Personal account, not a Team org —
 * Team org keys return 402 unless the org has a subscription or credit balance.
 */

const AI_PROXY_URL = process.env.EXPO_PUBLIC_AI_PROXY_URL;

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

async function callProxy<T>(payload: Record<string, unknown>): Promise<T> {
    if (!AI_PROXY_URL) {
        throw new Error('AI features are unavailable: EXPO_PUBLIC_AI_PROXY_URL is not configured.');
    }

    let response: Response;
    try {
        response = await fetch(AI_PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    } catch {
        throw new Error('Could not reach the AI service. Check your connection.');
    }

    // Errors come back as { error }, successes as { data }.
    let body: { data?: T; error?: string };
    try {
        body = await response.json();
    } catch {
        throw new Error(`AI request failed (${response.status}).`);
    }

    if (!response.ok) {
        throw new Error(body?.error || `AI request failed (${response.status}).`);
    }
    if (body?.data === undefined) {
        throw new Error('AI returned an empty response.');
    }
    return body.data;
}

/**
 * Generates a ritual guide based on the Tithi.
 */
export async function generateRitualGuide(tithi: string, language: string): Promise<RitualGuide> {
    try {
        return await callProxy<RitualGuide>({ action: 'ritual_guide', tithi, language });
    } catch (error) {
        console.error('Error in generateRitualGuide:', error);
        throw error;
    }
}

/**
 * Parses a natural language input into a structured event object.
 */
export async function parseSmartEvent(input: string, currentBsDate: { year: number, month: number, day: number }): Promise<SmartEvent> {
    try {
        return await callProxy<SmartEvent>({ action: 'smart_event', input, currentBsDate });
    } catch (error) {
        console.error('Error in parseSmartEvent:', error);
        throw error;
    }
}
