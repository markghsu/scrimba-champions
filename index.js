// FIREBASE SETUP
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, push, onValue, remove } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js'

const firebaseConfig = {
	databaseURL: "https://scrimba-champion-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
const endorsementsInDB = ref(database,"endorsements");

const endorsementInputEl = document.getElementById("endorsement-input");
const publishBtnEl = document.getElementById("publish-btn");
const endorsementListEl = document.getElementById("endorsement-list");

publishBtnEl.addEventListener("click", () => {
	push(endorsementsInDB,endorsementInputEl.value);
	endorsementInputEl.value = '';
});

onValue(endorsementsInDB,(snapshot) => {

	clearEndorsementList();
	if (snapshot.exists()) {
		const endorsements = Object.entries(snapshot.val());
		console.log(endorsements,"xxxx")
		endorsements.forEach((endorsement) => {
			console.log(endorsement);
			renderEndorsement(...endorsement);
		});
	}
});

function clearEndorsementList() {
	endorsementListEl.innerHTML = '';
}

function renderEndorsement(endorsementID, endorsementValue) {
	const listItem = document.createElement('li');
	listItem.textContent = endorsementValue;
	listItem.dataset.key = endorsementID;
	endorsementListEl.appendChild(listItem);
}