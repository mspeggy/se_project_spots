class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  // Utility: Check response
  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

    // Get both cards + user info at once
  getAppInfo() {
    //TODO - call getUserInfo it in this array
    return Promise.all([this.getInitialCards(), this.getUserInfo()]);
  }

  // Cards
  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then(this._checkResponse);
  }

  // User profile info
  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    }).then(this._checkResponse);
  }

  // TODO - implement POST / cards
addCard({ name, link }) {
  return fetch(`${this._baseUrl}/cards`, {
    method: "POST",
    headers: this._headers,
    body: JSON.stringify({ name, link })
  }).then(this._handleResponse);
}

  // Edit profile (name + about)
  editUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ name, about }),
    }).then(this._checkResponse);
  }

  // Update avatar image
  updateAvatar(avatarUrl) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ avatar: avatarUrl }),
    }).then(this._checkResponse);
  }

deleteCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: "DELETE",
      headers: this._headers,
    }).then((res) => {
      if (res.ok) {
        return res.json();
    }
    Promise.reject(`Error: ${res.status}`);
  });
}

likeStatus(id, isLiked) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: isLiked ? "DELETE" : "PUT",
      headers: this._headers,
    }).then((res) => {
      if (res.ok) {
        return res.json();
    }
    Promise.reject(`Error: ${res.status}`);
  });
}
}
 
export default Api;
