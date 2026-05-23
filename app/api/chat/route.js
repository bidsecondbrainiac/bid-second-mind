import { KNOWLEDGE_BASE } from '../../../lib/knowledge-base'

export async function POST(request) {
  const { messages } = await request.json()

  const systemPrompt = 'You are the AI assistant for a Behavioural Insights and Design Thinking team Second Brain.\n\nHere is the team complete knowledge base:\n\n' + KNOWLEDGE_BASE + '\n\nWhen answering:\n1. Be warm, clear, and practical\n2. Reference specific concepts and frameworks from the knowledge base\n3. When relevant, mention the 5D process: Define, Discover, Diagnose, Design, Test\n4. Give concrete examples from the knowledge base when possible\n5. Keep answers concise but thorough (2-4 paragraphs)\n6. Suggest related concepts the user might want to explore\n7. If the knowledge base does not cover something, say so honestly'

  const groqMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(function(m) { return { role: m.role, content: m.content } })
  ]

  try {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return Response.json(
        { reply: 'API key not configured. Set GROQ_API_KEY in Vercel environment variables.' },
        { status: 500 }
      )
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
      },
      body: JSON.stringify({
        model: 'gemma2-9b-it',
        messages: groqMessages,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    })

    const data = await response.json()

    if (data.error) {
      return Response.json(
        { reply: 'API error: ' + (data.error.message || 'Unknown error') },
        { status: 500 }
      )
    }

    const reply = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : 'Sorry, I could not process that.'
    return Response.json({ reply })
  } catch (error) {
    return Response.json(
      { reply: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
