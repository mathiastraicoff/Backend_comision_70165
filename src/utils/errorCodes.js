const errorCodes = {
    USER_ALREADY_EXISTS: {
        message: "El usuario ya existe.",
        status: 400
    },
    USER_NOT_FOUND: {
        message: "Usuario no encontrado.",
        status: 404
    },
    PET_CREATION_FAILED: {
        message: "Error al crear la mascota.",
        status: 500
    },
};

export default errorCodes;
