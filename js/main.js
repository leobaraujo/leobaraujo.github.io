const hamburgerBtnElement = document.querySelector("button.hamburger");
const headerMenuNavElement = document.querySelector("nav.header__menu");

hamburgerBtnElement.addEventListener("click", () => {
    hamburgerBtnElement.classList.toggle("is-active");
    headerMenuNavElement.classList.toggle("header__menu--hidden");
    headerMenuNavElement.classList.toggle("header__menu--visible");
});

const contactFormElement = document.querySelector("#contact__form");

contactFormElement.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = await getFormData();

    if (formData.grecaptcha.length === 0) {
        alert("Por favor, verifique se você não é um robô.");
        return;
    }

    sendEmail("https://ordanael-email-api.vercel.app/api/v1/email", formData);
});

async function getFormData() {
    return {
        name: "undefined",
        email: document.querySelector("#contato .contact__email").value,
        message: document.querySelector("#contato .contact__message").value,
        grecaptcha: await grecaptcha.getResponse(),
    };
}

function sendEmail(addressURL, formData) {
    fetch(addressURL, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(formData),
    })
        .then(() => {
            console.log("Email enviado");
            clearFormInputs();
        })
        .catch(() => {
            console.error("Não foi possível enviar o email");
        });
}

function clearFormInputs() {
    document.querySelector("#contato .contact__email").value = "";
    document.querySelector("#contato .contact__message").value = "";
}
