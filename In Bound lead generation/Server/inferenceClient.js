const axios = require('axios');

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-mnli';
const HUGGINGFACE_API_KEY = process.env.HF_API_KEY; // make sure it's set in your .env

const analyzeComment = async (commentText) => {
  try {
    const response = await axios.post(
      HUGGINGFACE_API_URL,
      {
        inputs: commentText,
        parameters: {
          candidate_labels: [
            "interested",
            "asking question",
            "just browsing",
            "not interested"
          ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = response.data;

    if (!data || !data.labels || !data.scores) {
      throw new Error('Unexpected response format from Hugging Face');
    }

    return {
      label: data.labels[0],             // highest score label
      confidence: data.scores[0]         // highest score
    };

  } catch (err) {
    console.error('Hugging Face API error:', err.message);
    return { error: err.message };
  }
};

module.exports = {
  analyzeComment
};
