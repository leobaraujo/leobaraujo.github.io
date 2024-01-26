const arrowUpElement = document.querySelector("#util-arrow-up");

document.body.onscroll = () => {
    const headerElement = document.querySelector("header.header");

    if (window.scrollY > 0) {
        headerElement.classList.add("header--scrolled");
        arrowUpElement.classList.remove("hidden");
    } else {
        headerElement.classList.remove("header--scrolled");
        arrowUpElement.classList.add("hidden");
    }
};

arrowUpElement.addEventListener("click", (e) => {
    window.scrollTo(0, 0);
});

const hamburgerBtnElement = document.querySelector("button.hamburger");
const headerMenuNavElement = document.querySelector("nav.header__menu");

hamburgerBtnElement.addEventListener("click", () => {
    hamburgerBtnElement.classList.toggle("is-active");
    headerMenuNavElement.classList.toggle("header__menu--hidden");
    headerMenuNavElement.classList.toggle("header__menu--visible");
});

const expandProjectsElement = document.querySelector("span.project__expand");

expandProjectsElement.addEventListener("click", (e) => {
    const expandableProjectsElement = document.querySelector("div.projects__expandable");
    const defaultShowMoreText = "Mostrar mais projetos";
    const defaultShowLessText = "Esconder projetos";

    if (expandProjectsElement.innerHTML.trim() === defaultShowMoreText) {
        expandProjectsElement.innerHTML = defaultShowLessText;
        expandProjectsElement.setAttribute("data-content", defaultShowLessText);
    } else {
        expandProjectsElement.innerHTML = defaultShowMoreText;
        expandProjectsElement.setAttribute("data-content", defaultShowMoreText);
    }

    expandableProjectsElement.classList.toggle("collapsed");
    expandableProjectsElement.classList.toggle("expanded");
});

const contactFormElement = document.querySelector("#contact__form");
const emailFeedbackElement = document.querySelector("#util-email-feedback");

function setFeedbackMessage(cssClass, message) {
    const TIMEOUT_DELAY = 3000;

    emailFeedbackElement.classList.add(cssClass);
    emailFeedbackElement.innerHTML = message;

    setTimeout(() => {
        emailFeedbackElement.classList.remove(cssClass);
    }, TIMEOUT_DELAY);
}

contactFormElement.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = await getFormData();

    if (formData.grecaptcha.length === 0) {
        setFeedbackMessage("error", "Por favor, verifique se você não é um robô.");
        return;
    }

    sendEmail("https://rockyracum-email-api.vercel.app/api/v1/email", formData);
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
    const sendEmailButtonElement = document.querySelector("#sendEmailBtn");
    sendEmailButtonElement.disabled = true;

    setFeedbackMessage("info", "Enviando email...");

    fetch(addressURL, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(formData),
    })
        .then((res) => {
            if (res.status === 200) {
                setFeedbackMessage("success", "Email enviado");
                clearFormInputs();
                return;
            }

            setFeedbackMessage("error", "Não foi possível enviar o email");
        })
        .catch(() => {
            setFeedbackMessage("error", "Não foi possível enviar o email");
        })
        .finally(() => {
            sendEmailButtonElement.disabled = false;
        });
}

function clearFormInputs() {
    document.querySelector("#contato .contact__email").value = "";
    document.querySelector("#contato .contact__message").value = "";
}

const whatsappBtnElement = document.querySelector("#whatsapp-action");

whatsappBtnElement.addEventListener("click", (e) => {
    window.open(atob("aHR0cHM6Ly9hcGkud2hhdHNhcHAuY29tL3NlbmQ/cGhvbmU9NTUzMTk5OTkzOTMyOA=="), "_blank");
});
