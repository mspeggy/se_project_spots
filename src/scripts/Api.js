class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
      headers: {
        authorization: "f14e21ea-8f06-4616-983e-92c4689bb859",
      },
    }).then((res) => res.json());
  }

  // other methods for working with the API
}

 export default Api;