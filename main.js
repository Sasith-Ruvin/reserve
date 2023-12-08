// constants for the code
const singleRoomPrice = 25000;
const doubleRoomPrice = 35000;
const tripleRoomPrice = 40000;
const bedCost = 8000;
const kidMeals = 5000;
const localAdultCharge = 5000;
const localKidCharge = 1000;
const foreignAdultCharge = 10000;
const foreignKidCharge = 2000;
const adultGuideCost = 1000;
const kidsGuideCost = 500;
const loyaltyPointsKey = "loyaltyPoints";

// variables available to all code
let roomCost;
let advCost;
let totalCost;
let guideCost = 0;
let adultCost = 0;
let childrenCost = 0;
let duration = 0;
let loyaltyPoints =0;



// get references to interactive elements

const thePersonalForm = document.getElementById("personal-details-form");
const personalInput = document.querySelectorAll("#personal-details-form input");
const userDetailsSection = document.getElementById("user-details-section");

// room booking form
const txtFirstName = document.getElementById("firstname");
const txtLastName = document.getElementById("lastname");
const contactInput = document.getElementById('contact');
const emailInput = document.getElementById("email");
const numOfAdults = document.getElementById("adults");
const kidsabovefive = document.getElementById("kids");
const checkInDate = document.getElementById("checkin");
const checkOutDate = document.getElementById("checkout");
const singleRooms = document.getElementById("single");
const doubleRooms = document.getElementById("double");
const tripleRooms = document.getElementById("triple");
const numBeds = document.getElementById("beds");
const extraRequests = document.getElementsByName("extra");
const txtPromoCode = document.getElementById("promocode");
const txtPersonalDetails = document.getElementById("current-personal-details");
const txtCurrentRoomBooking = document.getElementById("current");
const theBookRoomForm = document.getElementById("room-bookingform");
const roomInput = document.querySelectorAll("#room-bookingform input");
const errorMessageDiv = document.getElementById("errorMessage");




// buttons in the page
const btnFavourite = document.getElementById("favourite");
const btnLoyalty = document.getElementById("loyalty");
const btnLoadFav = document.getElementById("showFav");
const btnAdvFavourite = document.getElementById('advfavourite');
const btnLoadAdvFav = document.getElementById('advshowFav');
const btnbookRooms = document.getElementById("bookrooms");
const btnbookAdventure = document.getElementById("bookadventure");


// adventure booking form
const Local = document.getElementById("localadults");
const foreignAdults = document.getElementById("foreignadults");
const localKids = document.getElementById("localkids");
const foreignKids = document.getElementById("foreignkids");
const hours = document.getElementById("duration");
const guideRequirement = document.getElementsByName("guide");
const adventures = document.getElementsByName("adventures");
const txtcurrentAdventureBooking = document.getElementById("adv-bookingdetail");
const theAdvenForm = document.getElementById("adventure-form");
const adventureInput = document.querySelectorAll("#adventure-form input");
const adultGuide = document.getElementById("Adult Guide");
const kidsGuide = document.getElementById("Kid's Guide");


txtTotal = document.getElementById("totalbookingcost")





// two overall booking tables
const overallSection = document.getElementById("overallbooking");
const txtOverallRoomBookingTable = document.getElementById("overallRoomBooking");
const tableBody = document.getElementById("overallRoomBooking").getElementsByTagName('tbody')[0];

overallSection.style.display='none';



// adding "-" automatically between numbers when user entering a contact number.
contactInput.addEventListener('input', function () {

    let cleanedInput = this.value.replace(/-/g, '');


    if (cleanedInput.length > 3) {
        cleanedInput = cleanedInput.slice(0, 3) + '-' + cleanedInput.slice(3);
    }
    if (cleanedInput.length > 7) {
        cleanedInput = cleanedInput.slice(0, 7) + '-' + cleanedInput.slice(7);
    }

    
    this.value = cleanedInput;
});



// Set the minimum date for check-in to the current date
const currentDate = new Date().toISOString().split("T")[0];
checkInDate.setAttribute("min", currentDate);


checkInDate.addEventListener("input", function () {
    checkOutDate.setAttribute("min", this.value);// Set the minimum date for check-out to the selected check-in date

    // If check-out date is before check-in date, reset it to check-in date
    if (checkOutDate.value < this.value) {
        checkOutDate.value = this.value;
    }
});

// Add event listener to check-out date for changes
checkOutDate.addEventListener("input", function () {
    // If check-out date is before check-in date, reset it to check-in date
    if (this.value < checkInDate.value) {
        this.value = checkInDate.value;
    }
});

checkOutDate.addEventListener("focus", function () {
    const minDate = checkInDate.value || currentDate;
    checkOutDate.setAttribute("min", minDate);
});



// calculating total room booking cost

function calculateRoomCost(){
    let numSingleRooms = parseInt(singleRooms.value);
    let numDoubleRooms = parseInt(doubleRooms.value);
    let numTripleRooms = parseInt(tripleRooms.value);
    let totalBedCost = bedCost * parseInt(numBeds.value);
    let totalkidMealCost = kidMeals * parseInt(kidsabovefive.value);
    days = Math.max(1,Math.round(Math.abs((new Date(checkOutDate.value) - new Date(checkInDate.value)) /(24 * 60 * 60 * 1000))));

    roomCost = (((numSingleRooms * singleRoomPrice) + (numDoubleRooms * doubleRoomPrice) + (numTripleRooms * tripleRoomPrice)) * days) + totalBedCost + totalkidMealCost;

    if(isNaN(roomCost)){
        roomCost = 0;
    }
}

// function to calculate loyalty points
function calculateLoyaltyPoints() {
    const totalRoomsBooked = parseInt(singleRooms.value) + parseInt(doubleRooms.value) + parseInt(tripleRooms.value);
    if (totalRoomsBooked > 3) {
        loyaltyPoints += 20 * totalRoomsBooked;
    }
}

// adding event handler to loyalty button
btnLoyalty.addEventListener("click", function () {

    const storedLoyaltyPoints = localStorage.getItem(loyaltyPointsKey);


    if (storedLoyaltyPoints === null || storedLoyaltyPoints == 0) {
       
        alert("You do not have loyalty points");
    } else {
    
        alert(`Your Loyalty Points: ${storedLoyaltyPoints}`);
    }

    
});







// adding an event handler to each checkbox in extra requirements
extraRequests.forEach(checkbox => checkbox.addEventListener('change', updateCurrentBooking));

// adding an event handler to each input field in booking form
roomInput.forEach(input => input.addEventListener('input', updateCurrentBooking ));
personalInput.forEach(input => input.addEventListener('input', updateCurrentBooking));


// getting selected extra requirements to a list
function getSelectedExtraRequirements(){
    const selectedExtras=[];
    extraRequests.forEach(checkbox => {if(checkbox.checked){
        selectedExtras.push(checkbox.id);
    }})
    return selectedExtras.join(', ');
}

// function to update current booking details with user inputs dynamically
function updateCurrentBooking(){
    calculateRoomCost();
    
    if(txtPromoCode.value === "promo123"){
        const discountAmount = roomCost * 0.05;
        roomCost = roomCost - discountAmount;
    }
    txtCurrentRoomBooking.innerHTML = `
    <h1>Current Booking</h1>
    <div class="booking-details">
        <p><strong>Name:</strong></p>
        <p>${txtFirstName.value} ${txtLastName.value}</p>
    </div>
    <div class="booking-details">
        <p><strong>Adults:</strong></p>
        <p>${numOfAdults.value}</p>
    </div>
    <div class="booking-details">
        <p><strong>Kids above 5 years:</strong></p>
        <p>${kidsabovefive.value}</p>
    </div>
    <div class="booking-details">
        <p><strong>Check-in date:</strong></p>
        <p>${checkInDate.value}</p>
    </div>
    <div class="booking-details">
        <p><strong>Check-out date:</strong></p>
        <p>${checkOutDate.value}</p>
    </div>
    <div class="booking-details">
        <p><strong>Single Rooms:</strong></p>
        <p>${singleRooms.value}</p>
    </div>
    <div class="booking-details">
        <p><strong>Double Rooms:</strong></p>
        <p>${doubleRooms.value}</p>
    </div>
    <div class="booking-details">
        <p><strong>Triple Rooms:</strong></p>
        <p>${tripleRooms.value}</p>
    </div>
    <div class="booking-details">
        <p><strong>Extra Beds:</strong></p>
        <p>${numBeds.value}</p>
    </div>
    <div class="booking-details">
        <p><strong>Extra Requirements:</strong></p>
        <p>${getSelectedExtraRequirements()}</p>
    </div>
    <div class="booking-details">
        <p><strong>Cost:</strong></p>
        <p>${roomCost.toLocaleString()}LKR</p>
    </div>
`;
}


function resetCurrentRoomBookings() {
    txtFirstName.value = "";
    txtLastName.value = "";
    contactInput.value = "";
    emailInput.value = "";
    numOfAdults.value = "0";
    kidsabovefive.value = "0";
    checkInDate.value = "";
    checkOutDate.value = "";
    singleRooms.value = "0";
    doubleRooms.value = "0";
    tripleRooms.value = "0";
    numBeds.value = "0";
    txtPromoCode.value = "";
    extraRequests.forEach(checkbox => (checkbox.checked = false));
    updateCurrentBooking(); 
}



// Check if personal details are filled
function checkPersonalDetails() {
    let isFilled = true;

    personalInput.forEach(input => {
        if (input.value.trim() === "") {
            isFilled = false;
            return;
        }
    });

    return isFilled;
}
// Adding Functionality to Book Now Button
btnbookRooms.addEventListener("click", updateOverallRoomBooking);


function updateOverallRoomBooking(event) {
    if (theBookRoomForm.checkValidity()) {
        event.preventDefault();
        // Validate contact number
        const contactPattern = /^\d{3}-\d{3}-\d{4}$/;
        const contactEntered = contactInput.value;

        if (!contactPattern.test(contactEntered)) {
            alert("Enter a valid Contact Number");
            thePersonalForm.scrollIntoView({ behavior: "smooth" });
            return;
        }

     
        if (!checkPersonalDetails()) {
            alert("Please fill in your personal details before booking rooms.");
            thePersonalForm.scrollIntoView({ behavior: "smooth" });
            return;
        }


        if (
            parseInt(singleRooms.value) === 0 &&
            parseInt(doubleRooms.value) === 0 &&
            parseInt(tripleRooms.value) === 0
        ) {
            alert("Please select at least one room before booking.");
            return;
        }

        if (
            parseInt(numOfAdults.value) === 0
        ) {
            alert("You need at least one Adult to Book Rooms");
            return;
        }
        calculateLoyaltyPoints();
        updateRoomBookingTable();
        localStorage.setItem(loyaltyPointsKey, loyaltyPoints);

        theBookRoomForm.reset();
        resetCurrentRoomBookings();
        overallSection.style.display = 'block';
        txtOverallRoomBookingTable.scrollIntoView({ behavior: "smooth" });
    }
}





personalInput.forEach(input => input.addEventListener('input', updateOverallRoomBooking));

// function to update Overall Room Booking Table
function updateRoomBookingTable(){
    const newRow = tableBody.insertRow();
    const cells = Array.from({ length: 9 }, () => newRow.insertCell());
    cells[0].textContent = txtFirstName.value + " " + txtLastName.value;
    cells[1].textContent = singleRooms.value;
    cells[2].textContent = doubleRooms.value;
    cells[3].textContent = tripleRooms.value;
    cells[4].textContent = checkInDate.value;
    cells[5].textContent = checkOutDate.value;
    cells[6].textContent = kidsabovefive.value;
    cells[7].textContent = numBeds.value;
    cells[8].textContent = roomCost.toLocaleString() + " LKR";;
}








// adding the event listener to the favourite button
btnFavourite.addEventListener("click", saveToFavorites);

// saves the current room booking details to local storage
function saveToFavorites(event){
    event.preventDefault();
   
    localStorage.removeItem("savedOrder");

    // object to store current booking setails
    const savedOrder ={
        firstname:txtFirstName.value,
        lastname:txtLastName.value,
        contact:contactInput.value,
        email:emailInput.value,
        numOfAdults:numOfAdults.value,
        kidsAboveFive:kidsabovefive.value,
        checkInDate:checkInDate.value,
        checkOutDate:checkOutDate.value,
        singleRooms:singleRooms.value,
        doubleRooms:doubleRooms.value,
        tripleRooms:tripleRooms.value,
        numBeds:numBeds.value,
        extraRequests:getSelectedExtraRequirements(),
        promoCode:txtPromoCode.value,
        roomCost:roomCost.toLocaleString(),

    };

    // converts the object to JSON string and saving it in local storage
    const savedOrderJSON = JSON.stringify(savedOrder);
    localStorage.setItem("savedOrder", savedOrderJSON);


    alert("Current Booking has been saved to Favourites!");
}



btnLoadFav.addEventListener("click", loadSavedOrder);

function loadSavedOrder(event){
    event.preventDefault();

    const savedOrderJSON = localStorage.getItem("savedOrder");

    if(savedOrderJSON){
        const savedOrder = JSON.parse(savedOrderJSON);

        txtFirstName.value = savedOrder.firstname;
        txtLastName.value = savedOrder.lastname;
        contactInput.value = savedOrder.contact;
        emailInput.value = savedOrder.email;
        numOfAdults.value = savedOrder.numOfAdults;
        kidsabovefive.value = savedOrder.kidsAboveFive;
        checkInDate.value = savedOrder.checkInDate;
        checkOutDate.value = savedOrder.checkOutDate;
        singleRooms.value = savedOrder.singleRooms;
        doubleRooms.value = savedOrder.doubleRooms;
        tripleRooms.value = savedOrder.tripleRooms;
        numBeds.value = savedOrder.numBeds;
        txtPromoCode.value = savedOrder.promoCode;

        updateCurrentBooking();

    }else{
        alert("No saved Favorite Order Found");
    }
}



// function to calculate adventure cost
function calculateAdventureCost(){
    numOfLocals = parseInt(Local.value);
    numOfForeigners = parseInt(foreignAdults.value);
    numOfLocalKids = parseInt(localKids.value);
    numOfForeignKids = parseInt(foreignKids.value);

    adultCost = (numOfLocals * localAdultCharge) + (numOfForeigners * foreignAdultCharge);

    childrenCost = (numOfLocalKids * localKidCharge) + (numOfForeignKids * foreignKidCharge);

    duration = parseInt(hours.value);

    advCost = ((adultCost + childrenCost)* duration)+ guideCost;

    if(isNaN(advCost)){
        advCost = 0;
    }
}


// adding event handlers to guide requirements checkboxes
adultGuide.addEventListener('change', function () {
    if(parseInt(Local.value)===0 && parseInt(foreignAdults.value)===0){
        alert("You need at least one adult in your booking to select this option");
        this.checked = false;
    }else{
        guideCheck(this);
    }
    
});

kidsGuide.addEventListener('change', function () {
    if(parseInt(localKids.value) ===0 && parseInt(foreignKids.value) ===0){
        alert("You need at least one kid in your booking to select this option");
        this.checked=false;
    }else{
        guideCheck(this);
    }
    
});


// function to calculate guide costs and add it to adventure cost
function guideCheck(checkbox) {
    if (checkbox.id === "Adult Guide") {
        if (checkbox.checked) {
            guideCost = guideCost + adultGuideCost;
        } else {
            guideCost = guideCost - adultGuideCost;
        }
    } else if (checkbox.id === "Kid's Guide") {
        if (checkbox.checked) {
            guideCost = guideCost + kidsGuideCost;
        } else {
            guideCost = guideCost - kidsGuideCost;
        }
    }

    advCost = ((adultCost + childrenCost) * duration) + guideCost;
    updateCurrentAdventureBooking();
}



// adding event handler for each input field in adventure form
adventureInput.forEach(input=>input.addEventListener('input', updateCurrentAdventureBooking));


// adding event handler for adventures checkboxes
adventures.forEach(adventure=> adventure.addEventListener('change', updateCurrentAdventureBooking));

// storing the adventure checkbox details in an array 
function getSelectedAdventures(){
    const selectedAdventures = [];
    adventures.forEach(adventure=> {if(adventure.checked){
        selectedAdventures.push(` ${adventure.id}`);
    }})
    return selectedAdventures.join(',');
}

// function to update current adventure booking dynamically with user inputs
function updateCurrentAdventureBooking(){
    calculateAdventureCost();
    

    txtcurrentAdventureBooking.innerHTML = `
        <h1>Current Booking</h1>
        <div class="booking-details">
            <p><strong>Adventures:</strong></p>
            <p>${getSelectedAdventures()}</p>
        </div>
        <div class="booking-details">
            <p><strong>Local Adults:</strong></p>
            <p>${Local.value}</p>
        </div>
        <div class="booking-details">
            <p><strong>Foreign Adults:</strong></p>
            <p>${foreignAdults.value}</p>
        </div>
        <div class="booking-details">
            <p><strong>Local Kids:</strong></p>
            <p>${localKids.value}</p>
        </div>
        <div class="booking-details">
            <p><strong>Foreign Kids:</strong></p>
            <p>${foreignKids.value}</p>
        </div>
        <div class="booking-details">
            <p><strong>Duration:</strong></p>
            <p>${hours.value}</p>
        </div>
        <div class="booking-details">
            <p><strong>Adult Guide:</strong></p>
            <p>${adultGuide.checked ? "Yes":"No"}</p>
        </div>
        <div class="booking-details">
            <p><strong>Adult Guide:</strong></p>
            <p>${kidsGuide.checked ? "Yes":"No"}</p>
        </div>
        <div class="booking-details">
            <p><strong>Cost:</strong></p>
            <p>${advCost.toLocaleString()}LKR</p>
        </div>
        
    `;
}


btnAdvFavourite.addEventListener('click', saveAdventureFavourites);

function saveAdventureFavourites(event){
    event.preventDefault();
    localStorage.removeItem("adventureFavourite");

    const adventureFavourite = {
        adventures:getSelectedAdventures(),
        LocalAdults:Local.value,
        Foreigners:foreignAdults.value,
        localChildren:localKids.value,
        foreignChildren:foreignKids.value,
        duration:hours.value,
        adultguide:adultGuide.checked,
        kidguide:kidsGuide.checked
    };

    const adventureFavouriteJSON = JSON.stringify(adventureFavourite);
    localStorage.setItem("adventureFavourite",adventureFavouriteJSON);

    alert("Current Adventure Booking Saved to Favourite Adventures!");
}

btnLoadAdvFav.addEventListener("click",function(event){
    event.preventDefault();
    const adventureFavouriteJSON = localStorage.getItem("adventureFavourite");

    if(adventureFavouriteJSON){
        const adventureFavourite = JSON.parse(adventureFavouriteJSON);

        adventures.forEach(adventure => {
            adventure.checked = adventureFavourite.adventures.includes(adventure.id);
        });
        Local.value = adventureFavourite.LocalAdults;
        foreignAdults.value = adventureFavourite.Foreigners;
        localKids.value = adventureFavourite.localChildren;
        foreignKids.value = adventureFavourite.foreignChildren;
        hours.value = adventureFavourite.duration;
        adultGuide.checked = adventureFavourite.adultguide;
        kidsGuide.checked = adventureFavourite.kidguide;

        updateCurrentAdventureBooking();
    }else{
        alert("No saved favourite adventure booking was found")
    }
});



// updates overall adventure booking table
function updateOverallAdventureBooking(){

    const newRow = txtOverallAdventureTable.insertRow();
    const cells = Array.from({length:8}, () => newRow.insertCell());

    cells[0].textContent = Local.value;
    cells[1].textContent = localKids.value;
    cells[2].textContent = foreignAdults.value;
    cells[3].textContent = foreignKids.value;
    cells[4].textContent = hours.value;
    cells[5].textContent = adultGuide.checked ? "Yes":"No";
    cells[6].textContent = kidsGuide.checked ? "Yes":"No";
    cells[7].textContent = advCost.toLocaleString() +"LKR";
}



function validateAdventure(){
    if(parseInt(hours.value)==0){
        alert("You need to book at least for 1 hour");
        return false;
    }
    return true;
}

// adding event handler to book adventure button
btnbookAdventure.addEventListener("click", updateAdventures);


function clearOverallRoomBookingTable() {
    const rows = tableBody.getElementsByTagName('tr');
    while (rows.length > 0) {
        tableBody.deleteRow(0);
    }
}

// displaying popup messeage with adventure details and reset the current bookings
function updateAdventures(event){
    if(theAdvenForm.checkValidity()){
    event.preventDefault();
    if (!checkPersonalDetails()) {
        alert("Please fill in your personal details before booking adventures.");
        thePersonalForm.scrollIntoView({ behavior: "smooth" });
        return;
    }

    const selectedAdventures = getSelectedAdventures();
    if (selectedAdventures.length === 0) {
        alert("Please select at least one adventure type.");
        return false;
    }
   

    if (!validateAdventure()) {
        return;
    }


    const AdventureDetails = `
    Adventure Details:
    Local Adults: ${Local.value}
    Local Kids: ${localKids.value}
    Foreign Adults: ${foreignAdults.value}
    Foreign Kids: ${foreignKids.value}
    Duration: ${hours.value}Hours
    Adult Guide: ${adultGuide.checked ? "Yes":"No"}
    Kid's Guide: ${kidsGuide.checked ? "Yes":"No"}
    Adventures: ${getSelectedAdventures()}
    Cost: ${advCost.toLocaleString()}LKR
    `;

    alert(`Thank You For your Adventure Booking!\n${AdventureDetails}`);
    
    thePersonalForm.reset();
    theAdvenForm.reset();
    clearOverallRoomBookingTable();
    txtcurrentAdventureBooking.innerHTML=" ";

    }
    
}






















