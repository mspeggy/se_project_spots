// === Configuration ===
export const validationConfig = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible", // update this in your CSS
};

// === Reset Validation ===
export function resetValidation(modalElement, inputElements, config) {
  inputElements.forEach((input) => {
    const errorElement = modalElement.querySelector(`#${input.id}-error`);
    if (errorElement) {
      input.classList.remove(config.inputErrorClass);
      errorElement.textContent = "";
      errorElement.classList.remove(config.errorClass);
    }
  });

  const submitButton = modalElement.querySelector(config.submitButtonSelector);
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.classList.add(config.inactiveButtonClass);
  }
}

// === Input Error Handling ===
const showInputError = (formElement, inputElement, errorMsg, config) => {
  const errorMsgElement = formElement.querySelector(`#${inputElement.id}-error`);
  errorMsgElement.textContent = errorMsg;
  inputElement.classList.add(config.inputErrorClass);
  errorMsgElement.classList.add(config.errorClass);
};

const hideInputError = (formElement, inputElement, config) => {
  const errorMsgElement = formElement.querySelector(`#${inputElement.id}-error`);
  errorMsgElement.textContent = "";
  inputElement.classList.remove(config.inputErrorClass);
  errorMsgElement.classList.remove(config.errorClass);
};

// === Input Validity Check ===
const checkInputValidity = (formElement, inputElement, config) => {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, config);
  } else {
    hideInputError(formElement, inputElement, config);
  }
};

// === Button State Handling ===

// Check if any input is invalid
const hasInvalidInput = (inputList) => {
  return inputList.some((input) => !input.validity.valid);
};

// Enable the button
const enableButton = (buttonElement, config) => {
  buttonElement.disabled = false;
  buttonElement.classList.remove(config.inactiveButtonClass);
};

// Disable the button
const disableButton = (buttonElement, config) => {
  buttonElement.disabled = true;
  buttonElement.classList.add(config.inactiveButtonClass);
};

// Toggle button state based on input validity
const toggleButtonState = (inputList, buttonElement, config) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonElement, config);
  } else {
    enableButton(buttonElement, config);
  }
};

   //=== Set Event Listeners ===
const setEventListeners = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  if (!buttonElement) {
    //console.warn("Submit button not found for form:", formElement);
    return;
  }

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

  
// === Enable Validation on All Forms ===
 export const enableValidation = (config) => {
   const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    setEventListeners(formElement, config);
  });
 };

