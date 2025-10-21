import OpenAI from "openai";

// This is using OpenAI's API, which points to OpenAI's API servers and requires your own API key.
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ScenarioContext {
  scenario: string;
  systemPrompt: string;
}

const scenarioPrompts: Record<string, string> = {
  free: "You are a friendly English conversation partner helping a Korean speaker practice English. Keep responses natural, encouraging, and at an intermediate level. Ask follow-up questions to continue the conversation.",
  restaurant: "You are a server at an English-speaking restaurant. Help the customer practice ordering food, asking about menu items, and restaurant-related conversations in English. Be patient and encouraging.",
  hotel: "You are a hotel receptionist at an English-speaking hotel. Help the guest practice checking in, asking about facilities, room service, and other hotel-related conversations in English.",
  shopping: "You are a sales assistant at an English-speaking store. Help the customer practice asking about products, prices, sizes, and making purchases in English. Be helpful and patient.",
  interview: "You are conducting a friendly job interview in English. Ask common interview questions and help the candidate practice professional English conversation. Be encouraging and constructive.",
  travel: "You are a travel guide helping someone plan their trip in English. Discuss destinations, travel tips, and tourist activities. Be enthusiastic and helpful."
};

export function getScenarioContext(scenario: string): ScenarioContext {
  return {
    scenario,
    systemPrompt: scenarioPrompts[scenario] || scenarioPrompts.free
  };
}

export async function getChatResponse(
  messages: ChatMessage[],
  scenario: string = 'free'
): Promise<string> {
  try {
    const { systemPrompt } = getScenarioContext(scenario);
    
    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      max_completion_tokens: 500
    });

    return response.choices[0].message.content || "I apologize, I couldn't generate a response. Please try again.";
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    
    if (error.status === 401) {
      throw new Error('OpenAI API 키가 유효하지 않습니다. Settings에서 API 키를 확인해주세요.');
    } else if (error.status === 429) {
      if (error.code === 'insufficient_quota') {
        throw new Error('OpenAI API 크레딧이 부족합니다. https://platform.openai.com/settings/organization/billing 에서 크레딧을 충전해주세요.');
      }
      throw new Error('OpenAI API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
    } else if (error.status === 500) {
      throw new Error('OpenAI 서비스에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요.');
    }
    
    throw new Error('AI 응답 생성 실패: ' + (error.message || '알 수 없는 오류'));
  }
}

export async function checkOpenAIHealth(): Promise<{ status: string; message: string }> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return {
        status: 'error',
        message: 'OPENAI_API_KEY is not configured'
      };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [{ role: "user", content: "Hi" }],
      max_completion_tokens: 10
    });

    if (response.choices[0].message.content) {
      return {
        status: 'ok',
        message: 'OpenAI API is working correctly'
      };
    }

    return {
      status: 'error',
      message: 'OpenAI API returned invalid response'
    };
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'OpenAI API check failed'
    };
  }
}
