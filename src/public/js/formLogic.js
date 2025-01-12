const phoneInput = document.querySelector("#phone");
const iti = window.intlTelInput(phoneInput, {
    separateDialCode: true,
    initialCountry: "auto",
    geoIpLookup: function (callback) {
        fetch("/api/ipinfo")
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error("Error al obtener la información de IP");
                }
                return resp.json();
            })
            .then((data) => {
                const countryCode = data.country;
                callback(countryCode);
            })
            .catch((err) => {
                console.error("Error al obtener información de IP:", err);
                callback("us");
            });
    },
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
});

// Alternar entre login y registro
document.getElementById("toggle-form").addEventListener("click", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const formTitle = document.getElementById("form-title");
    const toggleButton = document.getElementById("toggle-form");

    if (loginForm.style.display === "none") {
        loginForm.style.display = "block";
        registerForm.style.display = "none";
        formTitle.innerText = "Iniciar Sesión";
        toggleButton.innerText = "¿No tienes una cuenta? Regístrate aquí";
    } else {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
        formTitle.innerText = "Registrar Cuenta";
        toggleButton.innerText = "¿Ya tienes cuenta? Inicia sesión aquí";
    }
});

// Función para manejar el inicio de sesión
document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("/api/sessions/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })
        .then(async (response) => {
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error desconocido.");
            }
            const data = await response.json();
            if (data.redirectUrl) {
                window.location.href = data.redirectUrl; 
            } else {
                throw new Error("No se recibió URL de redirección.");
            }
        })
        .catch((error) => {
            const loginError = document.getElementById("login-error");
            loginError.innerText = error.message;
            loginError.style.display = "block";
        });
});

// Función para manejar el registro
document.getElementById("register-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const firstName = document.getElementById("first_name").value;
    const lastName = document.getElementById("last_name").value;
    const registerEmail = document.getElementById("register_email").value;
    const phone = document.getElementById("phone").value;
    const age = document.getElementById("age").value;
    const registerPassword = document.getElementById("register_password").value;
    const confirmPassword = document.getElementById("confirm_password").value;
    const adminPassword = document.getElementById("admin_password").value;

    if (registerPassword !== confirmPassword) {
        const passwordMatchError = document.getElementById("password-match-error");
        passwordMatchError.style.display = "block";
        return;
    }

    try {
        const response = await fetch("/api/sessions/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email: registerEmail,
                phone: phone,
                age: age,
                password: registerPassword,
                admin_password: adminPassword,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al registrar usuario");
        }

        window.location.href = "/home";
    } catch (error) {
        const registerError = document.getElementById("register-email-error");
        registerError.innerText = error.message;
        registerError.style.display = "block";
    }
});
