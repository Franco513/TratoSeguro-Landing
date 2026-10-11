const supabaseClient = window.supabase.createClient(
    window.SUPABASE_URL,
    window.SUPABASE_KEY
);

const form = document.getElementById("betaForm");
const message = document.getElementById("formMessage");
const submitButton = document.getElementById("submitButton");

const fields = {
    nombre: document.getElementById("nombre"),
    correo: document.getElementById("correo"),
    perfil: document.getElementById("perfil"),
    empresa: document.getElementById("empresa"),
    necesidad: document.getElementById("necesidad"),
    interes: document.getElementById("interes"),
    acepta: document.getElementById("acepta")
};

function setError(fieldName, text) {
    const error = document.getElementById(`${fieldName}Error`);
    if (error) error.textContent = text;

    if (fields[fieldName] && fields[fieldName].type !== "checkbox") {
        fields[fieldName].classList.add("invalid");
    }
}

function clearErrors() {
    document.querySelectorAll(".field small, #aceptaError").forEach((element) => {
        element.textContent = "";
    });

    document.querySelectorAll("input, select, textarea").forEach((element) => {
        element.classList.remove("invalid");
    });

    message.textContent = "";
    message.className = "form-message";
}

function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm() {
    clearErrors();

    let valid = true;

    if (fields.nombre.value.trim().length < 3) {
        setError("nombre", "Ingresa tu nombre completo.");
        valid = false;
    }

    if (!validEmail(fields.correo.value.trim())) {
        setError("correo", "Ingresa un correo electrónico válido.");
        valid = false;
    }

    if (!fields.perfil.value) {
        setError("perfil", "Selecciona tu perfil.");
        valid = false;
    }

    if (fields.necesidad.value.trim().length < 10) {
        setError("necesidad", "Describe brevemente tu necesidad.");
        valid = false;
    }

    if (!fields.interes.value) {
        setError("interes", "Selecciona tu interés.");
        valid = false;
    }

    if (!fields.acepta.checked) {
        document.getElementById("aceptaError").textContent =
            "Debes aceptar participar en la beta.";
        valid = false;
    }

    return valid;
}

function showMessage(type, text) {
    message.className = `form-message ${type}`;
    message.textContent = text;
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateForm()) {
        showMessage("error", "Revisa los campos marcados e inténtalo nuevamente.");
        return;
    }

    if (
        !window.SUPABASE_URL ||
        !window.SUPABASE_KEY ||
        window.SUPABASE_URL.includes("PEGA_AQUI") ||
        window.SUPABASE_KEY.includes("PEGA_AQUI")
    ) {
        showMessage(
            "error",
            "La conexión con Supabase todavía no está configurada."
        );
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Registrando...";

    const registro = {
        nombre: fields.nombre.value.trim(),
        correo: fields.correo.value.trim().toLowerCase(),
        perfil: fields.perfil.value,
        empresa: fields.empresa.value.trim() || null,
        necesidad: fields.necesidad.value.trim(),
        interes: fields.interes.value
    };

    const { error } = await supabaseClient
        .from("registro_beta")
        .insert([registro]);

    submitButton.disabled = false;
    submitButton.textContent = "Inscribirme a la beta";

    if (error) {
        console.error(error);

        if (error.code === "23505") {
            showMessage(
                "error",
                "Este correo ya está registrado en la beta."
            );
            return;
        }

        showMessage(
            "error",
            "No pudimos guardar tu registro. Verifica la conexión e inténtalo nuevamente."
        );
        return;
    }

    form.reset();

    showMessage(
        "success",
        "¡Registro exitoso! Gracias por inscribirte a la beta de TratoSeguro."
    );
});

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    const opened = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", opened ? "true" : "false");
});

document.querySelectorAll("#navLinks a").forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});
