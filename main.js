const presidensFetch = fetch('https://api.sampleapis.com/presidents/presidents');


let allPresidents = [];
let vicePresidents = [];
let checkedPresidents = [];

let minYear;

let mainBlock = document.querySelector('.main-block');
let presidentBlock = document.querySelector('.president-block');
presidensFetch.then(response => {
    return response.json(); 
  })
  .then(presidents => {
    allPresidents = presidents.map(el => {
        let years = el.yearsInOffice.split('-');
        let yearTo = years[1] || years[0];
        el.yearsInOffice = {
            from: years[0],
            to: yearTo === 'present' ? new Date().getFullYear() : yearTo
        };
        return el
    }).sort((a, b) => b.yearsInOffice.to - a.yearsInOffice.to)
    minYear = Math.min(...allPresidents.map(president => president.yearsInOffice.from));
    vicePresidents = getPresidents(presidents)
    renderPresidents(vicePresidents)
    renderPresidentCards(allPresidents)
    getInput()
})

// Функция перебора подмасива vicePresidents и добавление в новый масив
const getPresidents = (presidents) => {
    let newPresidents = [];
    presidents.forEach(el => {
        el.vicePresidents.forEach(president => {
            if (!newPresidents.includes(president)) {
                newPresidents.push(president);
            }
        })
    });
    return newPresidents;
}

// Функция для создания чекбокса
const getCheckbox = (name) => {
    let checkboxWrap = document.createElement('div')
    checkboxWrap.classList.add('checkbox-wrapper')
    let checkbox = document.createElement('input');
    checkbox.classList.add('custom-checkbox')
    let label = document.createElement('label');

    checkbox.type = "checkbox";
    checkbox.id = name
    checkbox.value = name;
    label.innerHTML = name;
    label.setAttribute('for', name)
    checkbox.onchange = onCheckedPresidents;
    checkboxWrap.append(checkbox, label);

    return checkboxWrap;
}

// Вывод имен на страницу в чекбоксы
const renderPresidents = (presidents) => {
    presidents.forEach(el => {
        mainBlock.append(getCheckbox(el))
    })
};

const getInput = () => {
    let presidentInput = document.querySelector('.input-president');
    
    presidentInput.oninput = (e) => {
        console.log(e)
        renderPresidentCards(getFilteredPresidents(allPresidents, vicePresidents, presidentInput.value));
    };
    
    return presidentInput;
}
// Чек по таргету
const onCheckedPresidents = (event) => {
    const target = event.target;
    const value = target.value;
    const checked = target.checked;
    if (checked) {
        if (!checkedPresidents.includes(value)) {
            checkedPresidents.push(value)
        }
    }  else {
        const index = checkedPresidents.findIndex(el => el === value);
        checkedPresidents.splice(index, 1)
    }
    
    renderPresidentCards(getFilteredPresidents(allPresidents, checkedPresidents))
  
}
// Фильтр вице президентов к президентам
const getFilteredPresidents = (presidents, vicePresidents, inputValue) => {
    console.log(typeof inputValue)
    const isEmpty = inputValue === undefined || inputValue.trim() === '';
    const isInputValueValid = isEmpty || inputValue >= minYear;

    const filteredPresidents = [];
    if (vicePresidents.length === 0 || !isInputValueValid){
        return presidents
    }

    vicePresidents.forEach( president => {
        presidents.forEach(presidentEl => {
            if(presidentEl.vicePresidents.includes(president) && !filteredPresidents.some(el => el.id === presidentEl.id)) {
                filteredPresidents.push(presidentEl)
            }
        })
    })

    const filteredPresidents1 = filteredPresidents.filter(president => {
        return inputValue <= president.yearsInOffice.from;
    })
    return isEmpty ? filteredPresidents : filteredPresidents1  
}

// Функция для создания Карточки
const getCardPresident = (name) => {
    let presidentCard = document.createElement('div');
    let cardImageWrap = document.createElement('div');
    let cardImage = document.createElement('img');
    let cardTitle = document.createElement('h1');
    let vicePresidentsSubtitle = document.createElement('p');
    let yearsInOfficeSubtitle = document.createElement('p');

    cardImage.src = name.photo;
    cardTitle.innerHTML = name.name;
    vicePresidentsSubtitle.innerHTML = `VicePresidents: ${name.vicePresidents.join(', ')}`;
    yearsInOfficeSubtitle.innerHTML = `Years In Office: ${name.yearsInOffice.from}-${name.yearsInOffice.to}`;
    
    presidentCard.classList.add('president-card');
    cardImageWrap.classList.add('president-image');
    
    presidentCard.append(cardImageWrap, cardTitle, vicePresidentsSubtitle, yearsInOfficeSubtitle);
    cardImageWrap.append(cardImage);
    
    
    cardImage.onerror = function() {
        cardImage.src = 'image-not-found.png'
    }

    return presidentCard;
}

const renderPresidentCards = (cards) => {
    presidentBlock.innerHTML = ''
    cards.forEach(el => {
        presidentBlock.append(getCardPresident(el))
    })
}