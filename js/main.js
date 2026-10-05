"use strict";

/**
 * Portfolio - Leandro Araújo
 * Main JavaScript
 */

document.addEventListener("DOMContentLoaded", () => {
    const arrowUpElement = document.querySelector("#util-arrow-up");
    const headerElement = document.querySelector("header.header");

    const hamburgerBtnElement = document.querySelector("button.hamburger");
    const headerMenuNavElement = document.querySelector("nav.header__menu");

    const expandProjectsElement = document.querySelector("button.project__expand");
    const expandableProjectsElement = document.querySelector("div.projects__expandable");

    const contactFormElement = document.querySelector("#contact__form");
    const emailFeedbackElement = document.querySelector("#util-email-feedback");

    const whatsappBtnElement = document.querySelector("#whatsapp-action");

    /*
     * Header / botão voltar ao topo
     */

    function handleScroll() {
        const isScrolled = window.scrollY > 0;

        if (headerElement) {
            headerElement.classList.toggle("header--scrolled", isScrolled);
        }

        if (arrowUpElement) {
            arrowUpElement.classList.toggle("hidden", !isScrolled);
        }
    }

    window.addEventListener("scroll", handleScroll, {
        passive: true,
    });

    // Executa uma vez ao carregar a página.
    handleScroll();

    if (arrowUpElement) {
        arrowUpElement.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        });
    }

    /*
     * Menu mobile
     */

    if (hamburgerBtnElement && headerMenuNavElement) {
        hamburgerBtnElement.addEventListener("click", () => {
            const isActive = hamburgerBtnElement.classList.toggle("is-active");

            headerMenuNavElement.classList.toggle("header__menu--hidden", !isActive);
            headerMenuNavElement.classList.toggle("header__menu--visible", isActive);
            hamburgerBtnElement.setAttribute("aria-expanded", String(isActive));
        });

        /*
         * Fecha o menu ao clicar em um link.
         * Isso é especialmente importante no mobile.
         */
        const menuLinks = headerMenuNavElement.querySelectorAll("a");

        menuLinks.forEach((link) => {
            link.addEventListener("click", () => {
                hamburgerBtnElement.classList.remove("is-active");
                headerMenuNavElement.classList.remove("header__menu--visible");
                headerMenuNavElement.classList.add("header__menu--hidden");
                hamburgerBtnElement.setAttribute("aria-expanded", "false");
            });
        });
    }

    /*
     * Expandir / esconder projetos
     */

    if (expandProjectsElement && expandableProjectsElement) {
        const SHOW_MORE_TEXT = "Mostrar mais projetos";
        const SHOW_LESS_TEXT = "Esconder projetos";

        expandProjectsElement.addEventListener("click", () => {
            const isCollapsed = expandableProjectsElement.classList.contains("collapsed");
            const newText = isCollapsed ? SHOW_LESS_TEXT : SHOW_MORE_TEXT;

            expandProjectsElement.textContent = newText;
            expandProjectsElement.setAttribute("data-content", newText);
            expandableProjectsElement.classList.toggle("collapsed", !isCollapsed);
            expandableProjectsElement.classList.toggle("expanded", isCollapsed);
            expandProjectsElement.setAttribute("aria-expanded", String(isCollapsed));
        });
    }

    /*
     * Formulário de contato
     */

    function setFeedbackMessage(cssClass, message) {
        if (!emailFeedbackElement) {
            return;
        }

        const feedbackClasses = ["info", "success", "error"];

        feedbackClasses.forEach((className) => {
            emailFeedbackElement.classList.remove(className);
        });

        emailFeedbackElement.classList.add(cssClass);
        emailFeedbackElement.textContent = message;

        setTimeout(() => {
            emailFeedbackElement.classList.remove(cssClass);
        }, 3000);
    }

    async function getFormData() {
        const emailElement = document.querySelector("#contato .contact__email");
        const messageElement = document.querySelector("#contato .contact__message");

        let grecaptchaResponse = "";

        /*
         * O reCAPTCHA pode ainda não ter carregado.
         */
        if (typeof grecaptcha !== "undefined" && typeof grecaptcha.getResponse === "function") {
            grecaptchaResponse = grecaptcha.getResponse();
        }

        return {
            name: "undefined",
            email: emailElement ? emailElement.value.trim() : "",
            message: messageElement ? messageElement.value.trim() : "",
            grecaptcha: grecaptchaResponse,
        };
    }

    function clearFormInputs() {
        const emailElement = document.querySelector("#contato .contact__email");
        const messageElement = document.querySelector("#contato .contact__message");

        if (emailElement) {
            emailElement.value = "";
        }

        if (messageElement) {
            messageElement.value = "";
        }

        /*
         * Reseta o reCAPTCHA depois do envio.
         */
        if (typeof grecaptcha !== "undefined" && typeof grecaptcha.reset === "function") {
            grecaptcha.reset();
        }
    }

    async function sendEmail(addressURL, formData) {
        const sendEmailButtonElement = document.querySelector("#sendEmailBtn");

        if (sendEmailButtonElement) {
            sendEmailButtonElement.disabled = true;
        }

        setFeedbackMessage("info", "Enviando email...");

        try {
            const response = await fetch(addressURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            setFeedbackMessage("success", "Email enviado");
            clearFormInputs();
        } catch (error) {
            console.error("Erro ao enviar email:", error);
            setFeedbackMessage("error", "Não foi possível enviar o email");
        } finally {
            if (sendEmailButtonElement) {
                sendEmailButtonElement.disabled = false;
            }
        }
    }

    if (contactFormElement) {
        contactFormElement.addEventListener("submit", async (event) => {
            event.preventDefault();

            const formData = await getFormData();

            if (!formData.email || !formData.message) {
                setFeedbackMessage("error", "Preencha todos os campos.");
                return;
            }

            if (!formData.grecaptcha) {
                setFeedbackMessage("error", "Por favor, verifique se você não é um robô.");
                return;
            }

            await sendEmail("https://leobaraujo-email-api.vercel.app/api/v1/email", formData);
        });
    }

    /*
     * WhatsApp
     */

    if (whatsappBtnElement) {
        whatsappBtnElement.addEventListener("click", () => {
            const whatsappURL = atob("aHR0cHM6Ly9hcGkud2hhdHNhcHAuY29tL3NlbmQ/cGhvbmU9NTUzMTk5OTkzOTMyOA==");

            window.open(whatsappURL, "_blank", "noopener,noreferrer");
        });
    }
});
