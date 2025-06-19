import { Handler } from '@netlify/functions';

interface LangflowResponse {
  outputs?: Array<{
    outputs?: Array<{
      results?: { message?: { text?: string } };
      outputs?: { message?: { message?: string } };
      messages?: Array<{ message?: string }>;
    }>;
  }>;
  session_id?: string;
}

interface LangflowResult {
  response: string;
  sessionId: string;
}

class LangflowError extends Error {
  constructor(message: string, public code: string = 'LANGFLOW_ERROR') {
    super(message);
    this.name = 'LangflowError';
  }
}

class NetworkError extends LangflowError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

class APIError extends LangflowError {
  constructor(public status: number, message: string) {
    super(message, 'API_ERROR');
    this.name = 'APIError';
  }
}

const extractResponseText = (data: LangflowResponse): string => {
  if (!data) {
    throw new LangflowError('API\'den veri alınamadı');
  }

  const responseText = 
    data?.outputs?.[0]?.outputs?.[0]?.results?.message?.text ??
    data?.outputs?.[0]?.outputs?.[0]?.outputs?.message?.message ??
    data?.outputs?.[0]?.outputs?.[0]?.messages?.[0]?.message;

  if (!responseText) {
    throw new LangflowError('API\'den beklenmeyen yanıt formatı');
  }

  return responseText;
};

const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  try {
    const { message, sessionId } = JSON.parse(event.body || '{}');

    if (!message) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    const url = `${process.env.VITE_LANGFLOW_BASE_URL}/api/v1/run/${process.env.VITE_FLOW_ID}`;
    const currentSessionId = sessionId || generateSessionId();
    
    const body = {
      input_value: message,
      output_type: 'chat',
      input_type: 'chat',
      session_id: currentSessionId,
      tweaks: null
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.VITE_LANGFLOW_API_KEY || '',
        'Authorization': `Bearer ${process.env.VITE_HF_TOKEN || ''}`
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new APIError(response.status, errorText);
    }

    let data: LangflowResponse;
    try {
      data = await response.json();
    } catch (parseError) {
      throw new LangflowError('API yanıtı ayrıştırılamadı');
    }
    
    const responseText = extractResponseText(data);
    
    const result: LangflowResult = {
      response: responseText,
      sessionId: data.session_id || currentSessionId
    };

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    };

  } catch (error) {
    console.error('Langflow proxy error:', error);
    
    let errorMessage = 'Bilinmeyen bir hata oluştu';
    let statusCode = 500;

    if (error instanceof NetworkError) {
      errorMessage = 'Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.';
      statusCode = 503;
    } else if (error instanceof APIError) {
      errorMessage = `API isteği başarısız: ${error.message}`;
      statusCode = error.status;
    } else if (error instanceof LangflowError) {
      errorMessage = error.message;
      statusCode = 400;
    }

    return {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};