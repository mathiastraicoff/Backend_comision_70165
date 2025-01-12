document.addEventListener("DOMContentLoaded", () => {
    console.log("Página /home cargada");
    verificarAutenticacion();
});

async function verificarAutenticacion() {
    console.log("Verificando autenticación en /home");

    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
    if (!token) {
        console.error("Token no encontrado en /home. Redirigiendo al login.");
        window.location.href = "/login";
        return;
    }

    console.log("Token encontrado en /home:", token);

    try {
        const response = await fetch("/api/sessions/current", {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Respuesta de fetch en /home:", response);

        if (!response.ok) {
            console.error("Usuario no autorizado en /home");
            throw new Error("No autorizado");
        }

        const data = await response.json();
        console.log("Usuario autenticado en /home:", data);
    } catch (error) {
        console.error("Error al verificar autenticación en /home:", error.message);
        document.cookie = "token=; Max-Age=0";
        window.location.href = "/login";
    }
}
