// Importa la clase OpenAI desde el paquete openai.
/*const OpenAI = require('openai');

// Importa tu clave API desde tu archivo de configuración.
const openaiConfig = require('../config/openai.config');

// Crea una instancia del cliente OpenAI usando tu clave API.
const openai = new OpenAI({ apiKey: openaiConfig.apiKey });

module.exports.generarTexto = async (req, res, next) => {
  const { texto } = req.body;
  console.log('Texto recibido:', texto);

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003", // Verifica que este modelo sea el que quieres usar.
      prompt: texto,
      max_tokens: 150,
    });

    const textoGenerado = response.data.choices[0].text.trim();
    console.log('Texto generado:', textoGenerado);
    res.json({ textoGenerado });
  } catch (error) {
    console.error('Error en la generación de texto:', error);
    next(error);
  }
};
*/