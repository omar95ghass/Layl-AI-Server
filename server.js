// server.js
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// Subabase
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('SUPABASE_URL', 'SUPABASE_KEY');

// Connect to AI
async function getAIResponse(prompt) {
  try {
    const response = await axios.post('https://api.runpod.ai/v1/YOUR_ENDPOINT', {
      prompt,
      max_tokens: 1000
    });
    return response.data.choices[0].text;
  } catch (error) {
    console.error('AI Error:', error);
    return "عذرًا، حدث خطأ في توليد الرد.";
  }
}

// Insert chat to DB
async function saveConversation(userId, question, answer) {
  const { error } = await supabase
    .from('conversations')
    .insert([{ user_id: userId, question, answer }]);
  if (error) throw new Error(error.message);
}

// Main Endpoint
app.post('/ask', async (req, res) => {
  try {
    const { userId, question } = req.body;
    
    // Get AI Response
    const aiResponse = await getAIResponse(question);
    
    // Save Chat
    await saveConversation(userId, question, aiResponse);
    
    // Reply
    res.json({ 
      success: true,
      response: aiResponse
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`السيرفر يعمل على بورت ${PORT}`));
