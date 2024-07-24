const dotenv = require('dotenv');

dotenv.config();

const openaiConfiguration = {
  apiKey: process.env.OPENAI_API_KEY,
};

module.exports = openaiConfiguration;
