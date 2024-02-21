// Función para calcular las calorías para ganar masa muscular utilizando la fórmula de Harris-Benedict
function calcularCaloriasGanarMasaMuscular(edad, peso, altura, factorActividad, sexo) {
  // Fórmula de Harris-Benedict para hombres
  if (sexo === 'hombre') {
    const caloriasBase = 66.5 + (13.75 * peso) + (5.003 * altura) - (6.75 * edad);
    const caloriasGanarMasaMuscular = caloriasBase * factorActividad + 300; // Aumentar 300 calorías para ganar masa muscular
    return caloriasGanarMasaMuscular;
  }
  // Fórmula de Harris-Benedict para mujeres
  else if (sexo === 'mujer') {
    const caloriasBase = 655.1 + (9.563 * peso) + (1.85 * altura) - (4.676 * edad);
    const caloriasGanarMasaMuscular = caloriasBase * factorActividad + 300; // Aumentar 300 calorías para ganar masa muscular
    return caloriasGanarMasaMuscular;
  } else {
    throw new Error('Sexo no válido');
  }
}

// Función para calcular las calorías para mantener el peso utilizando la fórmula de Harris-Benedict
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

// Exportar la función generarRecetas
exports.generarRecetas = (req, res) => {
  // Obtener los datos del usuario desde el cuerpo de la solicitud
  const { objetivo, edad, peso, altura, estado_fisico, preferencias_alimentarias, alergias, sexo } = req.body;

  // Verificar si los datos necesarios están presentes en el cuerpo de la solicitud
  if (!objetivo || !edad || !peso || !altura || !estado_fisico || !sexo) {
    return res.status(400).json({ success: false, message: 'Faltan datos necesarios en la solicitud' });
  }

  // Calcular las calorías necesarias según el objetivo del usuario
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
      factorActividad = 1.2; // Por defecto, se asume un factor de actividad sedentario
  }

  // Utilizar promesas para realizar el cálculo de calorías
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
      
      // Calcular las proteínas necesarias (en gramos)
      const proteinasNecesarias = peso * 2.2; // 2.2 gramos de proteína por kg de peso corporal
      
      // Calcular los carbohidratos necesarios (en gramos)
      const caloriasProteinas = proteinasNecesarias * 4; // 4 calorías por gramo de proteína
      const caloriasCarbohidratos = caloriasNecesarias - caloriasProteinas; // Restar las calorías de las proteínas
      const carbohidratosNecesarios = caloriasCarbohidratos / 4; // 4 calorías por gramo de carbohidrato

      // Calcular las grasas necesarias (en gramos)
      const porcentajeGrasas = 0.3; // Porcentaje de calorías provenientes de grasas (30%)
      const caloriasGrasas = caloriasNecesarias * porcentajeGrasas; // Calorías provenientes de grasas
      const grasasNecesarias = caloriasGrasas / 9; // 9 calorías por gramo de grasa
      
      // Devolver las calorías, proteínas, carbohidratos, grasas y sexo necesarios para el usuario
      res.json({
        success: true,
        message: 'Datos calculados con éxito',
        data: {
          caloriasNecesarias,
          proteinasNecesarias,
          carbohidratosNecesarios,
          grasasNecesarias,
          sexo
        }
      });
    })
    .catch(error => {
      console.error('Error al calcular los datos necesarios:', error);
      res.status(500).json({ success: false, message: 'Error al calcular los datos necesarios' });
    });
};
