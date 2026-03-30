exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: { message: 'Method Not Allowed' } }) };
  }

  try {
    const apiKey = event.headers['x-api-key'];

    if (!apiKey || !apiKey.startsWith('sk-ant-')) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: { message: 'Chave API inválida ou ausente.' } }) };
    }

    const body = JSON.parse(event.body);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    });

    const text = await response.text();
    return { statusCode: response.status, headers, body: text };

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: { message: 'Erro interno: ' + err.message } }) };
  }
};
