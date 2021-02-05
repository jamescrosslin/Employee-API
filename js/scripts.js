const url = `https://randomuser.me/api/?nat=us&exc=nat,gender,id,registered,login&results=12&noinfo`;

class Person {
  constructor(obj, container) {
    const {
      name: { first, last },
      location: {
        street: { number: streetNum, name: streetName },
        city,
        state,
        postcode,
      },
      dob: { date },
      phone,
      email,
      picture: { large: pic },
    } = obj;

    this.name = `${first} ${last}`;
    this.image = pic;
    this.email = email;
    this.city = `${city}, ${state}`;
    this.location = `${streetNum} ${streetName}<br>${city}, ${state} ${postcode}`;
    this.dob = date.replace(/^(\d{4})-(\d{2})-(\d{2}).+$/, "$2/$3/$1");
    this.phone = phone.replace(/^\D*(\d{3})\D*(\d{3}\D\d{4})$/, "($1) $2");
    this.container = container;
    this.modal = null;
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
class Gallery {
  constructor(target) {
    this.users = [];
    this.activeProfile = null;
    this.target = target;
  }
  printUsers(data) {
    data.forEach((user, i) => {
      user = new Person(user, this);
      this.users.push(user);
      this.target.insertAdjacentHTML("beforeend", user.makeCard());
      user.element = this.target.lastElementChild;
      user.element.person = user;
    });
  }
  printModal(selection) {
    this.activeProfile = selection;
    this.target.insertAdjacentHTML("beforeend", this.activeProfile.makeModal());
  }
  cycleModal(button) {
    const index = this.users.indexOf(this.activeProfile);
    let person;
    this.target.lastElementChild.remove();
    if (button === "modal-prev") {
      person = this.users[index === 0 ? this.users.length - 1 : index - 1];
      this.printModal(person);
    }
    if (button === "modal-next") {
      person = this.users[index === this.users.length - 1 ? 0 : index + 1];
      this.printModal(person);
    }
  }
}

const gallery = new Gallery(document.getElementById("gallery"));

async function getUsers(url) {
  const res = await fetch(url);
  const { results } = await res.json();
  gallery.printUsers(results);
}
gallery.target.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    gallery.cycleModal(e.target.id);
  } else {
    const selection = e.path[e.path.indexOf(gallery.target) - 1];
    gallery.printModal(selection.person);
  }
});
getUsers(url);
