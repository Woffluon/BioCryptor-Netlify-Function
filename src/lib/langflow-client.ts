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

const REQUEST_TIMEOUT = 30000;

const fetchWithTimeout = async (url: string, options: RequestInit, timeout: number): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new NetworkError('İstek zaman aşımına uğradı. Lütfen bağlantınızı kontrol edin ve tekrar deneyin.');
    }
    throw error;
  }
};

export const sendMessageToLangflow = async (
  message: string,
  sessionId: string | null = null,
  maxRetries: number = 2
): Promise<LangflowResult> => {
  const url = '/.netlify/functions/langflow-proxy';
  
  const body = {
    message,
    sessionId
  };

  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }

      const response = await fetchWithTimeout(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
        REQUEST_TIMEOUT
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new APIError(response.status, errorData.error || 'API isteği başarısız');
      }

      const data: LangflowResult = await response.json();
      return data;
      
    } catch (error) {
      lastError = error;
      
      if (error instanceof NetworkError) {
        if (attempt === maxRetries) {
          throw new NetworkError('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
        }
      } else if (error instanceof APIError) {
        if (attempt === maxRetries) {
          throw new APIError(error.status, `API isteği başarısız`);
        }
      } else if (error instanceof LangflowError) {
        throw error;
      } else {
        if (attempt === maxRetries) {
          const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu';
          throw new LangflowError(errorMessage);
        }
      }
    }
  }
  
  if (lastError instanceof NetworkError) {
    throw new NetworkError('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
  } else if (lastError instanceof APIError) {
    throw new APIError(lastError.status, `API isteği başarısız: ${lastError.message}`);
  } else if (lastError instanceof LangflowError) {
    throw lastError;
  } else {
    const errorMessage = lastError instanceof Error ? lastError.message : 'Bilinmeyen bir hata oluştu';
    throw new LangflowError(errorMessage);
  }
}