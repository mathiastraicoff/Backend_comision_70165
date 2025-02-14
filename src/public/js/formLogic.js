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
                console.log("Datos de IP:", data);
                if (data && data.country) {
                    const countryCode = data.country.toLowerCase();
                    callback(countryCode);
                } else {
                    console.warn(
                        "Propiedad 'country' no encontrada en la respuesta de IP",
                    );
                    callback("us");
                }
            })
            .catch((err) => {
                console.error("Error al obtener información de IP:", err);
                callback("us");
            });
    },
    utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
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
document
    .getElementById("login-form")
    .addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("/auth/login", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                window.location.href = data.redirectUrl;
            } else {
                const errorData = await response.json();
                document.getElementById("login-error").innerText = errorData.message;
                document.getElementById("login-error").style.display = "block";
            }
        } catch (error) {
            console.error("Error:", error);
            document.getElementById("login-error").innerText = "Error desconocido.";
            document.getElementById("login-error").style.display = "block";
        }
    });

// Función para manejar el registro
document
    .getElementById("register-form")
    .addEventListener("submit", async function (event) {
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
            document.getElementById("password-match-error").style.display = "block";
            return;
        }

        try {
            const response = await fetch("/api/sessions/register", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    register_email: registerEmail,
                    phone: phone,
                    age: age,
                    register_password: registerPassword,
                    confirm_password: confirmPassword,
                    admin_password: adminPassword,
                }),
            });

            if (response.ok) {
                window.location.href = "/home";
            } else {
                const errorData = await response.json();
                document.getElementById("register-email-error").innerText =
                    errorData.message;
                document.getElementById("register-email-error").style.display = "block";
            }
        } catch (error) {
            console.error("Error:", error);
            document.getElementById("register-email-error").innerText =
                "Error desconocido.";
            document.getElementById("register-email-error").style.display = "block";
        }
    });
