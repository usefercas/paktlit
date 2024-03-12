const GPTMessage = require("../models/GPTMessage.model");
const fetchGpt = require("../middlewares/gpt.middleware");

function calcularCaloriasGanarMasaMuscular(edad, peso, altura, factorActividad, sexo) {
  if (sexo === 'hombre') {
    const caloriasBase = 66.5 + (13.75 * peso) + (5.003 * altura) - (6.75 * edad);
    const caloriasGanarMasaMuscular = caloriasBase * factorActividad + 300;
    return caloriasGanarMasaMuscular;
  }

  else if (sexo === 'mujer') {
    const caloriasBase = 655.1 + (9.563 * peso) + (1.85 * altura) - (4.676 * edad);
    const caloriasGanarMasaMuscular = caloriasBase * factorActividad + 300;
    return caloriasGanarMasaMuscular;
  } else {
    throw new Error('Sexo no válido');
  }
}


function calcularCaloriasMantenerPeso(edad, peso, altura, factorActividad, sexo) {
  // Fórmula de Harris-Benedict para hombres
  if (sexo === 'hombre') {
    const caloriasBase = 66.5 + (13.75 * peso) + (5.003 * altura) - (6.75 * edad);
    const caloriasMantenerPeso = caloriasBase * factorActividad; // Mantener el mismo número de calorías
    return caloriasMantenerPeso;
  }
  // Fórmula de Harris-Benedict para mujeres
  else if (sexo === 'mujer') {
    const caloriasBase = 655.1 + (9.563 * peso) + (1.85 * altura) - (4.676 * edad);
    const caloriasMantenerPeso = caloriasBase * factorActividad; // Mantener el mismo número de calorías
    return caloriasMantenerPeso;
  } else {
    throw new Error('Sexo no válido');
  }
}

module.exports.generarRecetas = (req, res) => {
  const { objetivo, edad, peso, altura, estado_fisico, preferencias_alimentarias, alergias, sexo } = req.body;

  if (!objetivo || !edad || !peso || !altura || !estado_fisico || !sexo) {
    return res.status(400).json({ success: false, message: 'Faltan datos necesarios en la solicitud' });
  }

  let caloriasNecesarias;
  let factorActividad;
  switch (estado_fisico) {
    case 'sedentario':
      factorActividad = 1.2;
      break;
    case 'ligero':
      factorActividad = 1.375;
      break;
    case 'moderado':
      factorActividad = 1.55;
      break;
    case 'activo':
      factorActividad = 1.725;
      break;
    case 'muy_activo':
      factorActividad = 1.9;
      break;
    default:
      factorActividad = 1.2;
  }

  Promise.resolve()
    .then(() => {
      switch (objetivo) {
        case 'perder_peso':
          caloriasNecesarias = calcularCaloriasMantenerPeso(edad, peso, altura, factorActividad, sexo);
          break;
        case 'ganar_masa_muscular':
          caloriasNecesarias = calcularCaloriasGanarMasaMuscular(edad, peso, altura, factorActividad, sexo);
          break;
        default:
          throw new Error('Objetivo no válido');
      }

      const proteinasNecesariasEnGramos = peso * 2.2;

      const caloriasProteinas = proteinasNecesariasEnGramos * 4;
      const caloriasCarbohidratos = caloriasNecesarias - caloriasProteinas;
      const carbohidratosNecesariosEnGramos = caloriasCarbohidratos / 4;

      const porcentajeGrasas = 0.3;
      const caloriasGrasas = caloriasNecesarias * porcentajeGrasas;
      const grasasNecesariasEnGramos = caloriasGrasas / 9;

      const gramosDeProteinaPorComida = proteinasNecesariasEnGramos / 3;
      const gramosDeCarbohidratosPorComida = carbohidratosNecesariosEnGramos / 3;
      const gramosDeGrasaNecesariosPorComida = grasasNecesariasEnGramos / 3;
      const totalCaloriasPorComida = caloriasCarbohidratos + caloriasGrasas + caloriasProteinas / 3;
      let xxx = 'Piensa que eres un experto en nutrición.' +
      `Dame 7 recetas de desayuno diferentes con ${totalCaloriasPorComida} calorias por comida.` +
      `También 7 dame recetas de comida diferentes con ${totalCaloriasPorComida} calorias por comida..` +
      `También 7 dame recetas de cena diferentes con ${totalCaloriasPorComida} calorias por comida.` +
      `Devuelve las recetas en un JSON que desayuno contenga las suyas, comida las suyas y cena las suyas.`;

      let questionToChatGPT = 'Piensa que eres un experto en nutrición.' +
        `Dame 7 recetas de desayuno diferentes con ${gramosDeProteinaPorComida} gramos de proteina, ${gramosDeCarbohidratosPorComida} gramos de carbohidratos y ${gramosDeGrasaNecesariosPorComida} gramos de grasa.` +
        `También 7 dame recetas de comida diferentes con ${gramosDeProteinaPorComida} gramos de proteina, ${gramosDeCarbohidratosPorComida} gramos de carbohidratos y ${gramosDeGrasaNecesariosPorComida} gramos de grasa.` +
        `También 7 dame recetas de cena diferentes con ${gramosDeProteinaPorComida} gramos de proteina, ${gramosDeCarbohidratosPorComida} gramos de carbohidratos y ${gramosDeGrasaNecesariosPorComida} gramos de grasa
        
        .` +
        `Devuelve las recetas en un JSON que desayuno contenga las suyas, comida las suyas y cena las suyas.`;

      console.log("Pregunta para el gtp: " + xxx);

      GPTMessage.findOne({ question: xxx })
        .then((pregunta) => {
          if (!pregunta) { // todo comprobar el status code para errores
            console.log("No existe la pregunta. Buscando en chat gpt");
            fetchGpt.fetchGPTData(xxx)
              .then(respuestaGtp => {
                console.log("respuesta que recibo-->" + JSON.stringify(respuestaGtp));
                const recetas = JSON.stringify(respuestaGtp.choices[0].message.content);
                console.log("Respuesta consulta gpt: " + JSON.stringify(recetas));
                let objetoParaGuardar = {
                  question: questionToChatGPT,
                  response: recetas
                };
            GPTMessage.create(objetoParaGuardar)
                .then(createdM => {
                  console.log("Creado: " + createdM._id);
                  return res.json({
                    success: true,
                    message: 'Datos calculados con éxito',
                    userId: createdM._id,
                    messageId: createdM._id, 
                    data: JSON.parse(objetoParaGuardar.response)
                  });
                });
      
                // return res.json({
                //   success: true,
                //   message: 'Datos calculados con éxito',
                //   userId: createdMessage.id,
                //   messageId: pregunta.id, 
                //   data: JSON.parse(objetoParaGuardar.response)
                // });
              })
              .catch(error => {
                console.log("Error procesando respuesta chatGPT -> " + error);
                throw error;
              });

          } else {
            console.log("La pregunta ya existe: " + pregunta);
            return res.json({
              success: true,
              message: 'Datos calculados con éxito',
              userId: "xzzxxx",
              messageId: pregunta.id, 
              data: JSON.parse(pregunta.response)
            });
          }
        })
        .catch((err) => {
          console.log("Error con recomendaciones : " + err);
        })

    })
    .catch(error => {
      console.error('Error al calcular los datos necesarios:', error);
      res.status(500).json({ success: false, message: 'Error al calcular los datos necesarios' });
    });
};
