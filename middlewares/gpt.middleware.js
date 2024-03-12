const fetch = require('node-fetch');

const baseBody = {
    model: "gpt-3.5-turbo",
    messages: [{
      role: "user",
      content: ""
    }],
    temperature: 0.7
}

module.exports.fetchGPTData = (message) => {
  const body = baseBody;
  body.messages[0].content = message;
  return fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer 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`
    },
    body: JSON.stringify(body)
  })
    .then(response => response.json())
}