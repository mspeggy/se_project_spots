//TODO pass settings object to the validation functions that are called in this file

const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

// Profile elements
const profileEditButton = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileAddButton = document.querySelector(".profile__add-btn");

// Form elements
const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
//const profileForm = document.forms["profile-form"];
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

//select the modal
const closeButton = document.querySelector(".modal__close_type_preview");
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");

// Card related elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function handleDeleteCard(evt) {
  const card = evt.target.closest(".card");
  card.remove();
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  // select the delete button

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  // select the element
  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-btn_liked");
  });
  /*You need to format the markup (and code) to show indentation and to make the code more readable. 
  You can do that with Prettier or a combination SHIFT + ALT + F*/
  // add the event listener
  // write code that handles the event

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
  });

  // set the listener on the delete button
  // The handler should remove the card from the DOM

  cardDeleteBtn.addEventListener("click", handleDeleteCard);

  return cardElement;
}

const modals = document.querySelectorAll(".modal");
modals.forEach((modal) => {
  modal.addEventListener("mousedown", function (event) {
    if (event.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

function closeModalOnEscape(evt) {
if (evt.key==="Escape") {
  // use document.querySelector to find the modal with modal_opened
  // use .classList.remove to remove the modal_opened class
  const modal = document.querySelector('.modal_opened'); 
  closeModal(modal);
  }
}

function openModal(modal) { 
  modal.classList.add("modal_opened");
  document.addEventListener('keydown', closeModalOnEscape); 
} 

//function openModal(modal) {
  //editModalNameInput.value = profileName.textContent;
  ///editModalDescriptionInput.value = profileDescription.textContent;
  
//}

function closeModal(modal) {
  document.removeEventListener('keydown', closeModalOnEscape);
  modal.classList.remove("modal_opened");
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editModal);
  editFormElement.reset();
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  const cardEl = getCardElement(inputValues);
  cardsList.prepend(cardEl);
  disableButton(cardSubmitBtn, settings);
  closeModal(cardModal);
  cardForm.reset();
}

profileEditButton.addEventListener("click", () => {
  //profileEditButton.addEventListener("click", openModal);
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  //OPTIONAL
  resetValidation(
    editModal,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});

editModalCloseBtn.addEventListener("click", () => {
  //profileEditButton.addEventListener("click", closeModal);
  closeModal(editModal);
});

/* Make a universal handler for any close buttons.
 // Find all close buttons
const closeButtons = document.querySelectorAll('.modal__close');

closeButtons.forEach((button) => {
  // Find the closest popup only once
  const popup = button.closest('.modal');
  // Set the listener
  button.addEventListener('click', () => closeModal(popup));
}); 
That’s why we make universal css classes for similar elements: here it’s modal__close for any close button.
So now you can add 100 modals: their close buttons will be handled automatically.*/

profileAddButton.addEventListener("click", () => {
  //editModalBtn.addEventListener("click", openModal);
  openModal(cardModal);
});

cardModalCloseBtn.addEventListener("click", () => {
  //editModalCloseBtn.addEventListener("click", closeModal);
  closeModal(cardModal);
});

closeButton.addEventListener("click", () => {
  //closeButton.addEventListener("click", closeButton);
  closeModal(previewModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);
//editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

initialCards.forEach((item) => {
  const cardEl = getCardElement(item);
  cardsList.append(cardEl);
});
/* // The function accepts a card object and a method of adding to the section
// The method is initially `prepend`, but you can pass `append` 
function renderCard(item, method = "prepend") {
  
  const cardElement = getCardElement(item);
  // Add the card into the section using the method
  cardsList[ method ](cardElement);
}
Every DOM element is an object with methods, that’s why you can get the methods in 2 ways: cardsList.prepend(…) (with a dot) or cardsList["prepend"](…). It’s the same.
This way you’ll not duplicate the code of card creation in 2 or more places in the code.*/
