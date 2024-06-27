const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario =require('../models/usuario');
const {validationResult}=require('express-validator');

const usuariosGet = async(req=request, res = response) => {
    //const {q, nombre='no envia', apikey}=req.query;
    const {limite=5, desde=0}=req.query;// indicamos que vamos ha recibir un parametro: limite,con volor por defecto 5
    const query={estado:true};//filtro para que solo muestre los usuarios activos
    const [total, usuarios] = await Promise.all([//ejecuta las dos promesas al mismo tiempo
        Usuario.countDocuments(query),//cuenta los usuarios
        Usuario.find(query)//busca todos los usuarios
            .skip(Number(desde))//salta los primeros 5
            .limit(Number(limite))//muestra 5
    ]);
    res.json({
        total,
        usuarios
    });
}

const usuariosPut = async(req, res = response) => {
    const {id}=req.params;// params puede traer muchos datos.
    //excluyo password, google y correo (no se actualizan) y todo lo demas lo almaceno es resto
    const {_id, password, google, correo, ...resto } = req.body;
    //POR HACER validar id contra la DB
    if(password){
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync(); // cantidad de vueltas que hará la encriptación, por defecto 10
        resto.password = bcryptjs.hashSync(password); // encripta el password
    }
    const usuario = await Usuario.findByIdAndUpdate(id, resto);//actualiza el usuario con el id y el resto de datos
    res.json({
        msg: 'put API - controller',
        usuario
    });
}


const usuariosPost = async(req, res = response) => {
    // Validación de errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json(errores);
    }

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        return res.status(400).json({
            msg: 'El correo ya está registrado'
        });
    }

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(); // cantidad de vueltas que hará la encriptación, por defecto 10
    usuario.password = bcryptjs.hashSync(password, salt); // encripta el password

    // Guardar en BD
    await usuario.save();

    res.json({
        msg: 'post API - controller',
        usuario
    });
}

module.exports = {
    usuariosPost
};




const usuariosDelete = async(req, res = response) => {
    const {id}=req.params;
    //BORRADO FISICO
    //const usuario = await Usuario.findByIdAndDelete(id);
    //BORRADO LOGICO
    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});
    res.json({
        usuario
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controller'
    });
}

// Se exporta un objeto pues van a haber muchos
module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}
