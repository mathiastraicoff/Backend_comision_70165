let socket = io();

function addProductToCart(productId) {
    let cartId = localStorage.getItem("cartId");
    if (!cartId) {
        socket.emit("createCart");
    } else {
        socket.emit("addProductToCart", { productId, cartId });
    }
}

socket.on("cartCreated", ({ cartId }) => {
    localStorage.setItem("cartId", cartId);
    updateCartCount();
});

socket.on("addProductSuccess", (message) => {
    console.log(message);
    updateCartCount();
});

socket.on("addProductError", (error) => {
    console.error("Error al agregar al carrito:", error.message);
});

function updateCartCount() {
    let cartId = localStorage.getItem("cartId");
    if (cartId) {
        socket.emit("getCart", { cartId });
    }
}

socket.on("cartUpdated", (cart) => {
    const cartCount = cart.products
        ? cart.products.reduce((sum, item) => sum + item.quantity, 0)
        : 0;
    document.getElementById("cart-count").innerText = cartCount;
});

async function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/auth/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        if (data.redirectUrl) {
            console.log("Redirigiendo a:", data.redirectUrl);
            window.location.href = data.redirectUrl;
        } else {
            console.error('No redirect URL found in the response.');
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("Error al intentar iniciar sesión: " + error.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname === "/login") {
        const loginForm = document.getElementById("login-form");
        if (loginForm) {
            loginForm.addEventListener("submit", (e) => {
                e.preventDefault();
                loginUser();
            });
        } else {
            console.error("Formulario de login no encontrado.");
        }
    }
});
