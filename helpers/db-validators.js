const res = require('express/lib/response');
const Role = require('../models/role');
const Usuario = require('../models/usuario'); 
const esRoleValido = async(rol='')=>{
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} no esta registrado en la DB`)
    }
}
const existeUsuarioPorId = async(id)=>{
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario){
        throw new Error(`El id ${id} no existe`);
    };
}
const emailExiste = async(correo)=>{
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){
        return res.status(400).json({
            msg: 'El correo ya está registrado'
        });
    };
}

module.exports = { 
    esRoleValido,
    existeUsuarioPorId,
emailExiste}