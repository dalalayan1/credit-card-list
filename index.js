'use strict';
(function () {
    var creditCardForm = document.getElementById('creditCardForm');
    var cardNumber = document.getElementById('cardNumber');
    var cardType = document.getElementById('cardType');
    var cvv = document.getElementById('cvv');
    var expiryDate = document.getElementById('expiryDate');
    var errorField = document.getElementById('errorField');
    var savedCards = document.getElementById('savedCards');
    var validationParams;
    var validated = false;
    var STORAGE_KEY = 'cards';
    var validationObj = {
        "VISA": {
            "cardPattern": "^4[0-9]{12}(?:[0-9]{3})?$",
            "cardNumberLength": 16,
            "cvv": "required",
            "cvvLength": 3,
            "displayText": "Visa"
        },
        "MASTERCARD": {
            "cardPattern": "^5[1-5][0-9]{14}$",
            "cardNumberLength": 16,
            "cvv": "required",
            "cvvLength": 3,
            "displayText": "Master"
        },
        "MAESTRO": {
            "cardPattern": "^(5018|5020|5038|6304|6759|6761|6763)[0-9]{8,15}$",
            "cardNumberLength": 19,
            "cvv": "optional",
            "cvvLength": 4,
            "displayText": "Maestro"
        }
    };

    window.addEventListener('DOMContentLoaded', displaySavedCards);
    creditCardForm.addEventListener('submit', saveCardDetails)
    cardNumber.addEventListener('keyup', validateCardNumber);

    function validateCardNumber(evt) {
        var inputStr = evt.target.value;
        var inputStrLength = inputStr.length;
        var inputStrWithoutSpace = inputStr.split(' ').join('');
        var inputStrWithoutSpaceLength = inputStrWithoutSpace.length;
        var inputVal = parseInt(inputStrWithoutSpace);
        for (var key in validationObj) {
            var regex = new RegExp(validationObj[key].cardPattern);
            if (regex.test(inputVal)) {
                validationParams = validationObj[key];
                break;
            }
        }

        if (validationParams && !validated) {
            validated = true;
            cardType.innerText = validationParams.displayText;
            var setMaxLength = validationParams.cardNumberLength + Math.ceil(validationParams.cardNumberLength/4) - 1;
            evt.target.setAttribute('maxLength', setMaxLength);
            validateCVV();
        }

        
        if (inputStrWithoutSpaceLength && inputStrWithoutSpaceLength % 4 === 0 && inputStr[inputStrLength - 1] !== ' ') {
            debugger
            if ( validationParams ) {
                evt.target.setAttribute('maxLength', evt.target.getAttribute('maxLength')+1);
            }
            evt.target.value = `${inputStr} `;
        }
    }

    function validateCVV() {
        cvv.setAttribute('maxLength', validationParams.cvvLength);
        cvv.setAttribute('required', validationParams.cvv === 'required' ? true : false);
    }

    function saveCardDetails(evt) {
        if (cardNumber.value && cvv.value && expiryDate.value) {
            var getCards = sessionStorage.getItem(STORAGE_KEY) ? JSON.parse(sessionStorage.getItem(STORAGE_KEY)) : {};
            var savedCardsArray = getCards.cards ? getCards.cards : [];
            savedCardsArray.push({
                cardType: cardType ? cardType.innerText : '',
                cardNumber: cardNumber.value,
                cvv: cvv.value,
                expiryDate: expiryDate.value
            });
            getCards['cards'] = savedCardsArray;
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(getCards));
        }
        else {
            evt.preventDefault();
            errorField.style.display = 'block';
        }
    }

    function displaySavedCards() {
        var getCards = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
        if (getCards && getCards.cards) {
            getCards.cards.forEach(function(eachCard) {
                var addCard = document.createElement('div');
                addCard.classList.add('card');
                addCard.innerHTML = `<div class="card-type">${eachCard.cardType}</div>
                                    <div class="card-number">${eachCard.cardNumber}</div>
                                    <div class="cvv">CVV : ${eachCard.cvv}</div>
                                    <div class="expiry">Valid upto : ${eachCard.expiryDate}</div>`;
                savedCards.appendChild(addCard);
            });
        }
    }
})();