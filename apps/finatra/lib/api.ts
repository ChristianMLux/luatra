export const API_URL = "http://localhost:8000"; // Placeholder

export async function mockChatStream(message: string, chatId: string, onChunk: (chunk: string) => void) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const responses = [
    `{"type":"log","content":"Analyzing request..."}\n`,
    `{"type":"log","content":"Fetching financial data..."}\n`,
    `{"type":"log","content":"Calculating projections..."}\n`,
    `I have analyzed your request regarding "${message}".\n`,
    `Based on current trends, everything looks stable.\n`
  ];

  for (const chunk of responses) {
    await new Promise(resolve => setTimeout(resolve, 300));
    onChunk(chunk);
  }
}
