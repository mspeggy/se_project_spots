import "./index.css";
import {
  enableValidation,
  validationConfig,
  resetValidation,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";

// Initialize API
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "f14e21ea-8f06-4616-983e-92c4689bb859",
    "Content-Type": "application/json",
  },
});

// Profile elements
const profileEditButton = document.querySelector(".profile__edit-btn");
const profileAddButton = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const avatarImage = document.querySelector(".profile__avatar");
const avatarEditButton = document.querySelector(".profile__avatar-btn");


// Edit profile modal elements
const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

// Add card modal elements
const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

// Avatar modal elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector("#edit-avatar-form");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarLinkInput = avatarModal.querySelector("#profile-avatar-input");

// Preview modal elements
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(".modal__close");

// Card template and container
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

// ----- Card Generator function -----
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardNameEl = cardElement.querySelector(".card__title");
  const likeBtn = cardElement.querySelector(".card__like-btn");
  const deleteBtn = cardElement.querySelector(".card__delete-btn");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  likeBtn.addEventListener("click", () => {
    likeBtn.classList.toggle("card__like-btn_liked");
  });

  deleteBtn.addEventListener("click", () => {
    cardElement.remove();
    openModal(document.querySelector("#delete-modal"));
  });

  cardImageEl.addEventListener("click", () => {
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

// ----- Modal utilities -----
function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscClose);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscClose);
}

function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openModal = document.querySelector(".modal_opened");
    if (openModal) closeModal(openModal);
  }
}

// Close modal on overlay click
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

// ----- API calls and initial rendering -----
api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    avatarImage.src = userInfo.avatar;
    avatarImage.alt = userInfo.name;
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;

    cards.forEach((cardData) => {
      const cardElement = getCardElement(cardData);
      cardsList.append(cardElement);
    });
  })
  .catch(console.error);
  

// ----- Event listeners -----
// Open Edit Profile modal
profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editModal,
    [editModalNameInput, editModalDescriptionInput],
    validationConfig
  );
  openModal(editModal);
});

// Open Add Card modal
profileAddButton.addEventListener("click", () => {
  resetValidation(cardModal, [cardNameInput, cardLinkInput], validationConfig);
  cardForm.reset();
  openModal(cardModal);
});

// Open Avatar modal
avatarEditButton.addEventListener("click", () => {
  // resetValidation(avatarModal, [avatarLinkInput], validationConfig);
  // avatarForm.reset();
  openModal(avatarModal);
});

// Close modal buttons
editModalCloseBtn.addEventListener("click", () => closeModal(editModal));
cardModalCloseBtn.addEventListener("click", () => closeModal(cardModal));
avatarModalCloseBtn.addEventListener("click", () => closeModal(avatarModal));
previewModalCloseBtn.addEventListener("click", () => closeModal(previewModal));

// ----- Form submission handlers -----
// Submit profile edit
editFormElement.addEventListener("submit", (evt) => {
  evt.preventDefault();
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error);
});

// Submit new card
cardForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const newCard = getCardElement({
    name: cardNameInput.value,
    link: cardLinkInput.value,
  });
  cardsList.prepend(newCard);
  closeModal(cardModal);
  cardForm.reset();
});

// Submit new avatar
avatarForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  //console.log("👤 Avatar form submitted with URL:", avatarLinkInput.value);

  api
    .updateAvatar(avatarLinkInput.value)
    .then((data) => {

      avatarImage.src = data.avatar;
      closeModal(avatarModal);
      avatarForm.reset();
    })
    .catch(console.error);
});

// ----- Enable form validation -----
enableValidation(validationConfig);
