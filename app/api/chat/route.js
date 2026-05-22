import { KNOWLEDGE_BASE } from '../../../lib/knowledge-base'

export async function POST(request) {
  const { messages } = await request.json()

  const systemPrompt = `You are the AI assistant for a Behavioural Insights & Design Thinking team's "Second Brain" — a shared knowledge management system.

Your team works on: human-centred research, systems thinking, the understand-design-test-evaluate cycle, trial design, evaluation methods, testing methodology, problem scoping, diagnostics, nudge design, and choice architecture.

Here is the team's complete knowledge base — use it to answer every question:

---
${KNOWLEDGE_BASE}
---

When answering:
1. Be warm, clear, and practical — like explaining to a smart colleague
2. Reference specific concepts, frameworks, and notes from the knowledge base above
3. When relevant, mention the 5D process: Define → Discover → Diagnose → Design → Test
4. Give concrete examples from the knowledge base when possible
5. Keep answers concise but thorough — aim for 2-4 paragraphs
6. Suggest related concepts the user might want to explore next
7. If the knowledge base doesn't cover something, say so honestly and give your best general answer`

  // Build the conversation history for Gemini
  const geminiContents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return Response.json(
        { reply: 'API key not configured. Please set GEMINI_API_KEY in your Vercel environment variables.' },
        { status: 500 }
      )
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: geminiContents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      }
    )

    const data = await response.json()

    if (data.error) {
      console.error('Gemini API error:', data.error)
      return Response.json(
        { reply: `API error: ${data.error.message || 'Unknown error'}. Check your API key.` },
        { status: 500 }
      )
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Sorry, I could not process that. Please try again.'

    return Response.json({ reply })
  } catch (error) {
    console.error('Chat error:', error)
    return Response.json(
      { reply: 'Something went wrong connecting to the AI. Please try again in a moment.' },
      { status: 500 }
    )
  }
}
