const url = `https://randomuser.me/api/?nat=us&exc=nat,gender,id,registered,login&results=12&noinfo`;

class Person {
  constructor(obj, i) {
    const { street, city, state, postcode } = obj.location;
    this.id = i;
    this.name = `${obj.name.first} ${obj.name.last}`;
    this.image = obj.picture.medium;
    this.email = obj.email;
    this.city = `${city}, ${state}`;
    this.location = `${street.number} ${street.name}<br>${city}, ${state} ${postcode}`;
    this.dob = obj.dob.date.replace(/^(\d{4})-(\d{2})-(\d{2}).+$/, "$2/$3/$1");
    this.phone = obj.phone.replace(/^(\d{3})-(\d{3}-\d{4})$/, "($1) $2");
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
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
          <img class="modal-img" src="${this.image}" alt="profile picture">
          <h3 class="modal-name cap">${this.name}</h3>
          <p class="modal-text">${this.city}</p>
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
  usersArray = await results.map((user, i) => new Person(user, i));
  return usersArray.forEach((user) => {
    document
      .getElementById("gallery")
      .insertAdjacentHTML("beforeend", user.makeCard());
  });

  // .catch((err) => console.log("Error: " + err.message));
}
getUsers(url);
