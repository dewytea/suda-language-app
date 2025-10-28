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
  scenario: string = 'free',
  learningMode: boolean = false
): Promise<string> {
  try {
    const { systemPrompt } = getScenarioContext(scenario);
    
    const learningModeInstruction = learningMode ? `

IMPORTANT - Learning Mode is ON:
- If you notice grammar mistakes, gently correct them in a natural way
- Suggest better or more natural expressions when appropriate
- Example: "Good try! We usually say 'I went' instead of 'I go' for past tense."
- Keep corrections natural, brief, and encouraging
- Don't overwhelm with too many corrections at once
- Focus on one or two key improvements per response` : `

Learning Mode is OFF:
- Focus on natural conversation flow
- Don't point out mistakes unless specifically asked
- Prioritize communication and understanding over correction`;

    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt + learningModeInstruction },
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

interface SpeakingScenarioContext {
  scenarioTitle: string;
  stepTitle: string;
  situation: string;
  aiRole: string;
  aiPrompt: string;
  usefulExpressions: Array<{
    expression: string;
    meaning: string;
    examples: string[];
  }>;
}

export function getSpeakingScenarioSystemPrompt(context: SpeakingScenarioContext): string {
  const expressionsList = context.usefulExpressions
    .map((expr, idx) => `${idx + 1}. "${expr.expression}" - ${expr.meaning}`)
    .join('\n');

  return `You are practicing English conversation in a role-play scenario.

SCENARIO: ${context.scenarioTitle} - ${context.stepTitle}
YOUR ROLE: ${context.aiRole}
SITUATION: ${context.situation}

${context.aiPrompt}

IMPORTANT GUIDELINES:
1. Stay in character as ${context.aiRole}
2. Keep responses natural and conversational (2-4 sentences max)
3. Encourage the learner to use these useful expressions:
${expressionsList}

4. If the learner uses these expressions correctly, acknowledge it positively
5. Adapt to the learner's level - don't overwhelm them
6. Ask follow-up questions to keep the conversation flowing
7. Be patient and supportive - they are learning
8. Keep the conversation focused on the current step's situation

Remember: You are helping them practice real-world English in a ${context.scenarioTitle} context.`;
}

export async function getChatResponseForScenario(
  messages: ChatMessage[],
  context: SpeakingScenarioContext
): Promise<string> {
  try {
    const systemPrompt = getSpeakingScenarioSystemPrompt(context);

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      max_completion_tokens: 300,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I apologize, I couldn't generate a response. Please try again.";
  } catch (error: any) {
    console.error('OpenAI API error (scenario):', error);
    
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

export interface ConversationEvaluation {
  scores: {
    pronunciation: number;
    grammar: number;
    fluency: number;
    appropriateness: number;
    overall: number;
  };
  feedback: {
    wellDone: string[];
    improvements: string[];
  };
  detailedAnalysis: string;
}

export async function evaluateConversation(
  messages: Array<{ role: string; content: string }>,
  context: SpeakingScenarioContext,
  stepCriteria: {
    pronunciation: number;
    grammar: number;
    fluency: number;
    appropriateness: number;
  }
): Promise<ConversationEvaluation> {
  try {
    const userMessages = messages.filter(m => m.role === 'user').map(m => m.content);
    
    const evaluationPrompt = `You are an English language assessment expert. Evaluate this conversation practice.

SCENARIO: ${context.scenarioTitle} - ${context.stepTitle}
SITUATION: ${context.situation}

USER'S RESPONSES:
${userMessages.map((msg, idx) => `${idx + 1}. "${msg}"`).join('\n')}

EXPECTED EXPRESSIONS TO USE:
${context.usefulExpressions.map((expr, idx) => `${idx + 1}. "${expr.expression}"`).join('\n')}

Evaluate on these criteria (score 0-100):
1. Pronunciation & Clarity (${stepCriteria.pronunciation}% weight)
2. Grammar & Accuracy (${stepCriteria.grammar}% weight)
3. Fluency & Natural Flow (${stepCriteria.fluency}% weight)
4. Appropriateness for Context (${stepCriteria.appropriateness}% weight)

Provide your evaluation in JSON format:
{
  "scores": {
    "pronunciation": <0-100>,
    "grammar": <0-100>,
    "fluency": <0-100>,
    "appropriateness": <0-100>,
    "overall": <weighted average>
  },
  "feedback": {
    "wellDone": ["<positive point 1>", "<positive point 2>", "<positive point 3>"],
    "improvements": ["<improvement area 1>", "<improvement area 2>"]
  },
  "detailedAnalysis": "<brief paragraph analysis>"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: "You are an expert English language evaluator. Provide accurate, constructive feedback in JSON format." },
        { role: "user", content: evaluationPrompt }
      ],
      max_completion_tokens: 800,
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No evaluation content received');
    }

    const evaluation = JSON.parse(content);
    
    return {
      scores: {
        pronunciation: Math.round(evaluation.scores.pronunciation),
        grammar: Math.round(evaluation.scores.grammar),
        fluency: Math.round(evaluation.scores.fluency),
        appropriateness: Math.round(evaluation.scores.appropriateness),
        overall: Math.round(evaluation.scores.overall),
      },
      feedback: {
        wellDone: evaluation.feedback.wellDone || [],
        improvements: evaluation.feedback.improvements || [],
      },
      detailedAnalysis: evaluation.detailedAnalysis || ''
    };
  } catch (error: any) {
    console.error('OpenAI evaluation error:', error);
    
    if (error.status === 401) {
      throw new Error('OpenAI API 키가 유효하지 않습니다.');
    } else if (error.status === 429) {
      throw new Error('OpenAI API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
    }
    
    throw new Error('대화 평가 실패: ' + (error.message || '알 수 없는 오류'));
  }
}
