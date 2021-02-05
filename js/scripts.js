class Person {
  /**
   * @param {object} data a user object from the randomuser.me API
   * @description creates a Person object with HTML relating to the incoming data
   */
  constructor(data) {
    //destructure the incoming object to utilize values in class properties
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
    } = data;

    //reformat date from "YYYY-MM-DD" to "MM/DD/YYYY"
    const bDay = date.replace(/^(\d{4})-(\d{2})-(\d{2}).+$/, "$2/$3/$1");
    //reformat phone number from "(xxx)-xxx-xxxx" to "(xxx) xxx-xxxx"
    const phoneNUm = phone.replace("-", " ");

    this.element = null;
    this.fullName = `${first} ${last}`;
    this.card = `<div class="card show">
      <div class="card-img-container">
        <img class="card-img" src="${pic}" alt="profile picture">
      </div>
      <div class="card-info-container">
        <h3 class="card-name cap">${this.fullName}</h3>
        <p class="card-text">${email}</p>
        <p class="card-text cap">${city}, ${state}</p>
      </div>
    </div>`;
    this.modal = `
    <div class="modal-container">
      <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn">X</button>
        <div class="modal-info-container">
          <img class="modal-img" src="${pic}" alt="profile picture">
          <h3 class="modal-name cap">${this.fullName}</h3>
          <p class="modal-text">${email}</p>
          <p class="modal-text cap">$${city}, ${state}</p>
          <hr>
          <p class="modal-text">${phoneNUm}</p>
          <p class="modal-text">${streetNum} ${streetName}<br>${city}, ${state} ${postcode}</p>
          <p class="modal-text">Birthday: ${bDay}</p>
        </div>
      </div>
      <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
      </div>
    </div>`;
  }
  showElement(show) {
    this.element.classList.toggle("show", show);
  }
}
class Gallery {
  /**
   * @param {element} target
   * @description constructs Gallery object that controlls interaction with Person objects
   */
  constructor(target) {
    this.people = [];
    this.activeProfile = null;
    this.target = target;
  }
  printUsers(data) {
    data.forEach((person) => {
      person = new Person(person);
      this.people.push(person);
      this.target.insertAdjacentHTML("beforeend", person.card);
      person.element = this.target.lastElementChild;
    });
  }
  printModal(selection) {
    this.activeProfile = selection;
    this.target.insertAdjacentHTML("beforeend", this.activeProfile.modal);
  }
  cycleModal(id) {
    const showing = this.people.filter((person) =>
      person.element.classList.contains("show")
    );
    const index = showing.indexOf(this.activeProfile);
    this.target.lastElementChild.remove();
    if (id === "modal-prev") {
      const person = showing[index === 0 ? showing.length - 1 : index - 1];
      this.printModal(person);
    }
    if (id === "modal-next") {
      const person = showing[index === showing.length - 1 ? 0 : index + 1];
      this.printModal(person);
    }
  }
  search(value) {
    this.people.forEach((person) => {
      person.fullName.toLowerCase().includes(value)
        ? person.showElement(true)
        : person.showElement(false);
    });
  }
}

const url = `https://randomuser.me/api/?nat=us&exc=nat,gender,id,registered,login&results=12&noinfo`;
const gallery = new Gallery(document.getElementById("gallery"));

async function getUsers(url) {
  try {
    const res = await fetch(url);
    const { results } = await res.json();
    gallery.printUsers(results);
  } catch (err) {
    console.error("Error: " + err.message);
  }
}
gallery.target.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    gallery.cycleModal(e.target.id);
  } else if (e.target.id !== "gallery") {
    const eventPath = e.composedPath();
    const selection = eventPath[eventPath.indexOf(gallery.target) - 1];
    const person = gallery.people.find((person) => person.element === selection);
    gallery.printModal(person);
  }
});

document.querySelector(".search-container").insertAdjacentHTML(
  "beforeend",
  `<form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
  </form>`
);

const form = document.querySelector("form");
const search = form.firstElementChild;

function searchPeople() {
  gallery.search(search.value.toLowerCase());
}

form.addEventListener("submit", searchPeople);
form.addEventListener("keyup", searchPeople);
getUsers(url);
