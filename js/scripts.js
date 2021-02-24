/* FSJS TECHDEGREE - Unit 5 Project
   I'm aiming for exceeds or meets expectations. Thanks for reviewing my project!
 */

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
          <p class="modal-text cap">${city}, ${state}</p>
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
   * @param {element} target DOM element that will contain Person cards
   * @description constructs Gallery object that controlls interaction with Person objects
   */
  constructor(target) {
    this.people = [];
    this.activeProfile = null;
    this.target = target;
  }

  /**
   * @param {array} data Array containing user objects from the randomuser.me API
   * @description creates a new Person object from each data object and stores them
       in the this.people array
   */
  printUsers(data) {
    this.people = data.map((person) => {
      person = new Person(person);
      this.target.insertAdjacentHTML("beforeend", person.card);
      person.element = this.target.lastElementChild;
      return person;
    });
  }

  /**
   * @param {object} selection Person object 
   */
  printModal(selection) {
    this.activeProfile = selection;
    this.target.insertAdjacentHTML("beforeend", this.activeProfile.modal);
  }

  /**
   * @param {string} id the element id of the initiating event target
   * @description gathers Person objects whose elements are displayin in
      the DOM and handles interaction based on which action was selected
   */
  cycleModal(id) {
    const isShowing = (person) => person.element.classList.contains("show")
    const showing = this.people.filter(isShowing);
    const currentIndex = showing.indexOf(this.activeProfile);
    //removes the existing modal in all cases, meaning an implicit close action
    this.target.lastElementChild.remove();

    //checks the showing array for the correct Person index and prints that modal
    if (id === "modal-prev") {
      const prevIndex = currentIndex === 0 ? showing.length - 1 : currentIndex - 1
      this.printModal(showing[prevIndex]);
    }
    if (id === "modal-next") {
      const nextIndex = currentIndex === showing.length - 1 ? 0 : currentIndex + 1
      this.printModal(showing[nextIndex]);
    }
  }

  /**
   * @param {string} value user input search value
   * @description checks for name matches on each Person and calls that
    Person's showElement method
   */
  search(value) {
    this.people.forEach((person) => {
      const isMatch = person.fullName.toLowerCase().includes(value)
      person.showElement(isMatch);
    });
  }
}

const url = `https://randomuser.me/api/?nat=us&exc=nat,gender,id,registered,login&results=18&noinfo`;
const gallery = new Gallery(document.getElementById("gallery"));

/**
 * @param {string} url the API url to obtain data objects representing people
 * @description retrieves API data and calls on the gallery to print data to the DOM
 */
async function getUsers(url) {
  try {
    const res = await fetch(url);
    const { results } = await res.json();
    gallery.printUsers(results);
  } catch (err) {
    console.error("Error: " + err.message);
  }
}

////  EVENT LISTENERS  ////
gallery.target.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    gallery.cycleModal(e.target.id);
  } else if (e.target.id !== "gallery") {

    //composedPath gives an array containing the path of event bubbling
    const eventPath = e.composedPath();

    //selection is the immediate predecessor (and child) of gallery on the event path
    const selection = eventPath[eventPath.indexOf(gallery.target) - 1];
    const person = gallery.people.find((person) => person.element === selection);
    if (person) gallery.printModal(person);
  }
});

////  SET UP BEGINNING PAGE STATE  ////
document.querySelector(".search-container").insertAdjacentHTML(
  "beforeend",
  `<form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
  </form>`
);

const form = document.querySelector("form");
const searchBar = form.firstElementChild;
const searchPeople = () => gallery.search(searchBar.value.toLowerCase())

form.addEventListener("submit", searchPeople);
form.addEventListener("keyup", searchPeople);
searchBar.addEventListener("search", searchPeople)

getUsers(url);