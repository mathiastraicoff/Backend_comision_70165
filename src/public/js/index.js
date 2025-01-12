let socket = io();

// Función para agregar un producto al carrito
function addProductToCart(productId) {
    let cartId = localStorage.getItem("cartId");
    if (!cartId) {
        socket.emit("createCart"); 
    } else {
        socket.emit("addProductToCart", { productId, cartId });
    }
}

// Escuchar el evento cuando el carrito es creado
socket.on("cartCreated", ({ cartId }) => {
    localStorage.setItem("cartId", cartId);
    updateCartCount();
});

// Escuchar el evento de éxito al agregar el producto
socket.on("addProductSuccess", (message) => {
    console.log(message);
    updateCartCount(); 
});

// Escuchar el evento de error al agregar un producto
socket.on("addProductError", (error) => {
    console.error("Error al agregar al carrito:", error.message);
});

// Función para actualizar el contador de productos en el carrito
function updateCartCount() {
    let cartId = localStorage.getItem("cartId");
    if (cartId) {
        socket.emit("getCart", { cartId });
    }
}

// Escuchar el evento cuando el carrito es actualizado
socket.on("cartUpdated", (cart) => {
    const cartCount = cart.products ? cart.products.reduce((sum, item) => sum + item.quantity, 0) : 0;
    document.getElementById("cart-count").innerText = cartCount;
});

// Función para obtener el usuario actual utilizando el token en las cookies
async function getCurrentUser() {
    console.log("Ejecutando getCurrentUser");
    const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];

    if (!token) {
        console.error("Token no encontrado. Redirigiendo al login.");
        window.location.href = "/login"; 
        return;
    }

    console.log("Token encontrado:", token);

    try {
        const response = await fetch("/api/sessions/current", {
            headers: { Authorization: `Bearer ${token}` }, 
        });

        console.log("Respuesta de fetch:", response);

        if (!response.ok) {
            console.error("Usuario no autorizado");
            throw new Error("No autorizado");
        }

        const data = await response.json();
        console.log("Usuario actual:", data);
        document.getElementById("user-info").innerText = `Bienvenido, ${data.first_name || "Usuario"}`;
    } catch (error) {
        console.error("Error al obtener usuario actual:", error.message);
        document.cookie = "token=; Max-Age=0";
    }
}

// Llamar solo en rutas protegidas
if (window.location.pathname !== "/login") {
    console.log("Ruta protegida, verificando el usuario actual");
    getCurrentUser(); 
}

// Función para iniciar sesión
async function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/api/sessions/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Token recibido:", data.token);
            document.cookie = `token=${data.token}; path=/;`;
            console.log("Redirigiendo a:", data.redirectUrl);
            window.location.href = data.redirectUrl; 
        } else {
            console.error("Error al iniciar sesión:", data.message);
            alert(data.message); 
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        alert("Error al intentar iniciar sesión");
    }
}

// Asegurarse de que el DOM esté completamente cargado antes de añadir el evento
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            loginUser();
        });
    } else {
        console.error("Formulario de login no encontrado.");
    }
});

