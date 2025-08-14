import "./index.css";
import {
  enableValidation,
  validationConfig,
  resetValidation,
} from "../scripts/validation.js";
import { setButtonText } from "../utils/helpers.js";
import Api from "../utils/Api.js";

// Initialize API
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "f14e21ea-8f06-4616-983e-92c4689bb859",
    "Content-Type": "application/json",
  },
});

// ---------- DOM ELEMENTS ---------- //

// Profile
const profileEditButton = document.querySelector(".profile__edit-btn");
const profileAddButton = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const avatarImage = document.querySelector(".profile__avatar");
const avatarEditButton = document.querySelector(".profile__avatar-btn");

// Modals
const editModal = document.querySelector("#edit-modal");
const cardModal = document.querySelector("#add-card-modal");
const avatarModal = document.querySelector("#avatar-modal");
const previewModal = document.querySelector("#preview-modal");
const deleteModal = document.querySelector("#delete-modal");

// Forms
const editFormElement = editModal.querySelector(".modal__form");
const cardForm = cardModal.querySelector(".modal__form");
const avatarForm = avatarModal.querySelector("#edit-avatar-form");
const deleteForm = deleteModal.querySelector("#delete-form");

// Form Inputs
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");
const avatarLinkInput = avatarModal.querySelector("#profile-avatar-input");

// Close Buttons
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");

// Delete modal buttons
const deleteSubmitBtn = deleteForm.querySelector('button[type="submit"]');
const deleteCancelBtn = deleteForm.querySelector('button[type="button"]');

// Preview modal content
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");

// Card template
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

// Track card to delete
let selectedCardElement = null;
let selectedCardId = null;

// ---------- MODAL UTILS ---------- //
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

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target === modal) {
      closeModal(modal);
    }
  });
});

// ---------- GENERATE CARD---------- //
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardNameEl = cardElement.querySelector(".card__title");
  const likeBtn = cardElement.querySelector(".card__like-btn");
  const deleteBtn = cardElement.querySelector(".card__delete-btn");

  // Set image and title
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardNameEl.textContent = data.name;

  // Mark liked button if user already liked the card
  if (data.isLiked) {
    likeBtn.classList.add("card__like-btn_liked");
  }

  // Like toggle
  likeBtn.addEventListener("click", () => {
    const isLiked = likeBtn.classList.contains("card__like-btn_liked");

    api
      .likeStatus(data._id, isLiked)
      .then(() => {
        likeBtn.classList.toggle("card__like-btn_liked");
      })
      .catch((err) => {
        console.error("Failed to toggle like:", err);
      });
  });

  // Open image in preview modal
  cardImageEl.addEventListener("click", () => {
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  // Delete button opens delete modal
  deleteBtn.addEventListener("click", () => {
    selectedCardElement = cardElement;
    selectedCardId = data._id;
    openModal(deleteModal);
  });

  return cardElement;
}

// ---------- API: INITIAL FETCH ---------- //

let currentUserId = null;

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    currentUserId = userInfo._id;
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

// ---------- MODAL EVENT LISTENERS ---------- //

// Profile edit
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

editFormElement.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

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
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Save");
    });
});

// Add Card Form
profileAddButton.addEventListener("click", () => {
  resetValidation(cardModal, [cardNameInput, cardLinkInput], validationConfig);
  cardForm.reset();
  openModal(cardModal);
});

cardForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .addCard({
      name: cardNameInput.value,
      link: cardLinkInput.value,
    })
    .then((data) => {
      const newCard = getCardElement(data);
      cardsList.prepend(newCard);
      cardForm.reset();
      closeModal(cardModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Save");
    });
});

// Edit Avatar
avatarEditButton.addEventListener("click", () => {
  resetValidation(avatarModal, [avatarLinkInput], validationConfig);
  avatarForm.reset();
  openModal(avatarModal);
});

avatarForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .updateAvatar(avatarLinkInput.value)
    .then((data) => {
      avatarImage.src = data.avatar;
      closeModal(avatarModal);
      avatarForm.reset();
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Save");
    });
});

// Preview modal close
previewModalCloseBtn.addEventListener("click", () => closeModal(previewModal));

// Delete modal logic
deleteForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Yes", "Deleting...");

  if (!selectedCardId || !selectedCardElement) return;

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCardElement.remove();
      closeModal(deleteModal);
      selectedCardId = null;
      selectedCardElement = null;
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Yes");
    });
});

deleteCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
  selectedCardElement = null;
  selectedCardId = null;
});

deleteModalCloseBtn.addEventListener("click", () => {
  closeModal(deleteModal);
  selectedCardElement = null;
  selectedCardId = null;
});

// Close modal buttons
editModalCloseBtn.addEventListener("click", () => closeModal(editModal));
cardModalCloseBtn.addEventListener("click", () => closeModal(cardModal));
avatarModalCloseBtn.addEventListener("click", () => closeModal(avatarModal));

// ---------- VALIDATION ---------- //
enableValidation(validationConfig);
