const url = `https://randomuser.me/api/?nat=us&exc=nat,gender,id,registered,login&results=12&noinfo`;
const gallery = document.getElementById("gallery");

class Person {
  constructor(obj) {
    const {
      name: { first, last },
      location: {
        street: { number, name },
        city,
        state,
        postcode,
      },
      dob: { date },
      phone,
      email,
      picture: { medium: pic },
    } = obj;
    this.name = `${first} ${last}`;
    this.image = pic;
    this.email = email;
    this.city = `${city}, ${state}`;
    this.location = `${number} ${name}<br>${city}, ${state} ${postcode}`;
    this.dob = date.replace(/^(\d{4})-(\d{2})-(\d{2}).+$/, "$2/$3/$1");
    this.phone = phone.replace(/^\D*(\d{3})\D*(\d{3}\D\d{4})$/, "($1) $2");
  }
  makeCard() {
    return `<div class="card">
      <div class="card-img-container">
        <img class="card-img" src="${this.image}" alt="profile picture">
      </div>
      <div class="card-info-container">
        <h3 class="card-name cap">${this.name}</h3>
        <p class="card-text">${this.email}</p>
        <p class="card-text cap">${this.city}</p>
      </div>
    </div>`;
  }
  makeModal() {
    return `
    <div class="modal-container">
      <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn">X</button>
        <div class="modal-info-container">
          <img class="modal-img" src="${this.image}" alt="profile picture">
          <h3 class="modal-name cap">${this.name}</h3>
          <p class="modal-text">${this.email}</p>
          <p class="modal-text cap">${this.city}</p>
          <hr>
          <p class="modal-text">${this.phone}</p>
          <p class="modal-text">${this.location}</p>
          <p class="modal-text">Birthday: ${this.dob}</p>
        </div>
      </div>
      <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
      </div>
    </div>`;
  }
}
let usersArray = [];
async function getUsers(url) {
  const res = await fetch(url);
  const { results } = await res.json();
  usersArray = await results.map((user) => new Person(user));
  usersArray.forEach((user, i) => {
    gallery.insertAdjacentHTML("beforeend", user.makeCard());
    gallery.lastElementChild.addEventListener("click", () => {
      const html = usersArray[i].makeModal();
      gallery.insertAdjacentHTML("beforeend", html);
      const modal = gallery.lastElementChild;
      modal.addEventListener("click", (e) => {
        if (e.target.id === "modal-close-btn")
          return gallery.removeChild(modal);
        if (e.target.id === "modal-prev") return arr[i];
      });
    });
  });
}
getUsers(url);
