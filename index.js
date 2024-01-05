// FIREBASE SETUP
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, push, onValue, remove, runTransaction } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js'

const firebaseConfig = {
	databaseURL: "https://scrimba-champion-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
const endorsementsInDB = ref(database,"endorsements");

const endorsementInputEl = document.getElementById("endorsement-input");
const fromInputEl = document.getElementById("from-input");
const toInputEl = document.getElementById("to-input");
const publishBtnEl = document.getElementById("publish-btn");
const endorsementListEl = document.getElementById("endorsement-list");

const myLikes = JSON.parse(localStorage.getItem("likes")) || {};

publishBtnEl.addEventListener("click", () => {
	const endorsement = {};
	endorsement['message'] = _strip(endorsementInputEl.value);
	endorsement['from'] = _strip(fromInputEl.value);
	endorsement['to'] = _strip(toInputEl.value);
	endorsement['likes'] = 0;
	push(endorsementsInDB,endorsement);
	endorsementInputEl.value = '';
	fromInputEl.value = '';
	toInputEl.value = '';
});

onValue(endorsementsInDB,(snapshot) => {

	clearEndorsementList();
	if (snapshot.exists()) {
		const endorsements = Object.entries(snapshot.val());
		console.log(endorsements,"xxxx")
		endorsements.forEach((endorsement) => {
			renderEndorsement(...endorsement);
		});
	}
});

function clearEndorsementList() {
	endorsementListEl.innerHTML = '';
}

function renderEndorsement(endorsementID, endorsement) {
	const listItem = document.createElement('li');

	const itemTo = document.createElement('p');
	itemTo.textContent = `To ${endorsement['to']}`;
	itemTo.classList.add('endorsement-label');

	const itemMessage = document.createElement('p');
	itemMessage.textContent = endorsement['message'];
	itemMessage.classList.add('endorsement-message');

	const itemFrom = document.createElement('p');
	itemFrom.textContent = `From ${endorsement['from']}`;
	itemFrom.classList.add('endorsement-label');

	const itemLikes = document.createElement('p');
	if(myLikes[endorsementID]) {
		itemLikes.textContent = `❤️ ${endorsement['likes']}`;
	} else {
		itemLikes.textContent = `❤ ${endorsement['likes']}`;
	}
	itemLikes.classList.add('likes');
	itemLikes.addEventListener("click",() => {
		toggleLike(endorsementID);
	})

	const itemRow = document.createElement('div');
	itemRow.classList.add('flex-row');
	itemRow.appendChild(itemFrom);
	itemRow.appendChild(itemLikes);

	listItem.dataset.key = endorsementID;
	listItem.classList.add('endorsement');
	listItem.appendChild(itemTo);
	listItem.appendChild(itemMessage);
	listItem.appendChild(itemRow);

	endorsementListEl.appendChild(listItem);
}

function _strip(html){
	let doc = new DOMParser().parseFromString(html, 'text/html');
	return doc.body.textContent || '';
}

function toggleLike(endorsementID) {
	const endorsementRef = ref(database, `/endorsements/${endorsementID}`);
	if(myLikes[endorsementID]){
		//unliking
		delete myLikes[endorsementID];
		localStorage.setItem("likes",JSON.stringify(myLikes));
		runTransaction(endorsementRef, (endorsement) => {
			if (endorsement) {
				endorsement.likes--;
			}
			return endorsement;
		});
	} else {
		myLikes[endorsementID] = true;
		localStorage.setItem("likes",JSON.stringify(myLikes));
		runTransaction(endorsementRef, (endorsement) => {
			if (endorsement) {
				endorsement.likes++;
			}
			return endorsement;
		});
	}
}