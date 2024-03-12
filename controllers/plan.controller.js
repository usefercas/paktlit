/*module.exports.confirmar = (req, res, next) => {
    console.log("enpoin a confirmar plan ");

    // comprobar en la request que te viene el id del user y el id de GTPMessage(rectas)
    // update user(userId) campo idPlan -> id gptMessage
    
}*/

const mongoose = require("mongoose");


const User = require('../models/User.model');
const GPTMessage = require('../models/GPTMessage.model');

module.exports.getPlan = async (req, res, next) => {
    console.log("Hemos llegado " + JSON.stringify(req.query.userId));
    User.findById(new mongoose.Types.ObjectId(req.query.userId)).then(foundUser => {
        console.log("Este es el User " + foundUser);
        console.log("Buscando plan: " + foundUser.idPlan);
        GPTMessage.findById(new mongoose.Types.ObjectId(foundUser.idPlan)).then(foundPlan => {
            console.log("Este es el plan " + JSON.parse(foundPlan.response));
            return res.status(200).json(JSON.parse(foundPlan.response));
        }).catch(error => {
            console.error("Error finding: " + error);
            return res.status(500);
        });
    }).catch(error => {
        console.error("Error finding user " + error);
        return res.status(500);
    });
    // console.log("Este es el User " + user);
    // const plan = GPTMessage.findById(user.planId);
    // console.log("Este es el plan " + plan);
    // return res.status(200).json(plan.response);
}

module.exports.confirmar = async (req, res, next) => {
    console.log("Endpoint para confirmar plan");
    console.log("Request: " + JSON.stringify(req.body));

    try {
        // Verificar si los datos esperados están presentes en la solicitud
        const { userId, messageId } = req.body;
        if (!userId || !messageId) {
            return res.status(400).json({ message: 'Se requieren los campos userId y messageId en el cuerpo de la solicitud' });
        }
        // Actualizar el usuario en la base de datos
        const user = await User.findById(new mongoose.Types.ObjectId(userId));
        if (!user) {
            console.log("User no encontrado: " + userId);
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar si el mensaje GPT existe
        const message = await GPTMessage.findById(new mongoose.Types.ObjectId(messageId));
        if (!message) {
            console.log("Mensaje no encontrado: " + messageId);
            return res.status(404).json({ message: 'Mensaje GPT no encontrado' });
        }

        // Actualizar el campo idPlan del usuario con el ID del mensaje GPT
        user.idPlan = messageId;
        await user.save();

        // Envía una respuesta exitosa
        return res.status(200).json({ message: 'Usuario actualizado correctamente con el nuevo plan' });
    } catch (error) {
        console.error('Error al confirmar el plan:', error);
        return res.status(500).json({ message: 'Se produjo un error al confirmar el plan' });
    }
};
