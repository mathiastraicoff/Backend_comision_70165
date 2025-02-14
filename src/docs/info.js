export default {
	openapi: "3.0.0",
	info: {
		title: "Comision 70165 - Documentacion de Usuarios de PSA",
		version: "1.0.0",
		description:
			"Documentación de los endpoints para el módulo de 'Users' (autenticación, sesiones y perfil).",
	},
	servers: [
		{
			url: "http://localhost:8080",
		},
	],
	components: {
		securitySchemes: {
			bearerAuth: {
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT",
			},
		},
	},
};
