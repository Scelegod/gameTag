let values = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
let containerNode = document.querySelector('.fifteen');
let gameNode = document.querySelector('.game');

for(let val in values){
    let button = document.createElement('button');
    button.className = 'item';
    button.setAttribute('data-matrix-id', ++val);

    let span = document.createElement('span');
    span.className = 'itemVal';
    span.innerHTML = val;

    button.append(span);
    containerNode.append(button);
}

let itemNodes = Array.from(containerNode.querySelectorAll('.item')); 
let countItems = 16;
//Ошибочка есть эллементов не 16
if(itemNodes.length !== 16){
    throw new Error(`Должно быть ровно ${countItems} items in HTML`);
}

// 1. Позиционирование 4х4
itemNodes[countItems - 1].style.display = 'none';                         // Скрытие последнего элемента
let matrix = getMatrix(itemNodes.map((item) => +item.dataset.matrixId));  //Получение массива из чисел dataset
setPositionItems(matrix);

// 2. Кнопка перемешивания Shuffle
let maxShuffleCount = 100;
let timer;
let shuffled = false;
let shuffledClassName = 'gameShuffle'; //Класс блокировки взаимодйствия с игрой при перемешке
document.querySelector('#shuffle').addEventListener('click', function(){
    if(shuffled){               //Прекращает взаимодйствие с кнопками при перемешивании
        return;
    }
    
    shuffled = true;
    let shuffleCount = 0;
    clearInterval(timer);
    gameNode.classList.add(shuffledClassName);

    if(shuffleCount === 0){
        timer = setInterval(function(){
            randomSwap(matrix);
            setPositionItems(matrix);


            shuffleCount += 1;

            if(shuffleCount >= maxShuffleCount){
                gameNode.classList.remove(shuffledClassName);
                clearInterval(timer);
                shuffled = false;
            }
        }, 70);
    }
}); 

// 3. Изменение позиции кнопок Change
let blankNumber = 16;               //16 Кнопка
containerNode.addEventListener('click', function(event){
    if(shuffled){               //Прекращает взаимодйствие с кнопками при перемешивании
        return;
    }

    let buttonNode = event.target.closest('button');
    if(!buttonNode){
        return;
    }
    let buttonNumber = +buttonNode.dataset.matrixId;
    let buttonCoords = findCoordinatesByNumber(buttonNumber, matrix);   //Получение координат кнопки
    let blankCoords = findCoordinatesByNumber(blankNumber, matrix);     //Получение координат пустой кнопки
    let isValid = isValidForSwap(blankCoords, buttonCoords);

    if(isValid){
        swap(blankCoords, buttonCoords, matrix);
        setPositionItems(matrix);
    }
});

// 4. Изменение позиции кнопок по стрелочкам Change
window.addEventListener('keydown', function(event){
    if(shuffled){               //Прекращает взаимодйствие с кнопками при перемешивании
        return;
    }

    if(!event.key.includes('Arrow')){
        return; 
    }

    let blankCoords = findCoordinatesByNumber(blankNumber, matrix);     //Получение координат пустой кнопки
    let buttonCoords = {
        x: blankCoords.x,
        y: blankCoords.y
    }
    let direction = event.key.split('Arrow')[1].toLowerCase();          // Убираем приставку Arrow
    let maxIndexMatrix = matrix.length;

    switch (direction){
        case 'up':
            buttonCoords.y += 1;
            break;
        case 'down':
            buttonCoords.y -= 1;
            break;
        case 'left':
            buttonCoords.x += 1;
            break;
        case 'right':
            buttonCoords.x -= 1;
            break;
    }
    if(buttonCoords.y >= maxIndexMatrix || buttonCoords.y < 0 ||    //Валидность координат
       buttonCoords.x >= maxIndexMatrix || buttonCoords.x < 0){
        return;
    }
    swap(blankCoords, buttonCoords, matrix);
    setPositionItems(matrix);
});


//Функция расфасовки массива
function getMatrix(arr){
    let matrix = [[], [], [], []];
    let y = 0;
    let x = 0;

    for(let i = 0; i < arr.length; i++){
        if(x >= 4){
            y++;
            x = 0;
        }

        matrix[y][x] = arr[i];
        x++;
    }
    return matrix; //[[1,2,3,4], [5,6,7,8], [9,10,11,12], [13,14,15,16]]
}

//Функция получение элементов из подмассивов массива и их позиционировае
function setPositionItems(matrix){
    for(let y = 0; y < matrix.length; y++){             // y - Ряды
        for(let x = 0; x < matrix[y].length; x++){      // x - Колонки
            let value = matrix[y][x];                   //Значение кнопок
            let node = itemNodes[value - 1];            //Элемент
            setNodeStyles(node, x, y); 
        }
    }
}

//Функция позиционирование кнопок
function setNodeStyles(node, x, y){
    let shiftPs = 100;                                                                 // размер кнопки
    node.style.transform = `translate3D(${x * shiftPs}%, ${y * shiftPs}%, 0)`;         //Изменение позиции
}


//Функция получения координат кнопки
function findCoordinatesByNumber(number, matrix){
    for(let y = 0; y < matrix.length; y++){ // y - Ряды
        for(let x = 0; x < matrix[y].length; x++){
            if(matrix[y][x] === number){
                return {x, y};
            }
        }
    }
    return null;
}

//Функция "Можно ли переместить кнопку"
function isValidForSwap(coords1, coords2){
    let diffX = Math.abs(coords1.x - coords2.x);
    let diffY = Math.abs(coords1.y - coords2.y);

    return (diffX === 1 || diffY === 1) && (coords1.x === coords2.x || coords1.y === coords2.y);
}

//Функция перемещения кнопки
function swap(coords1, coords2, matrix){
    let coords1Number = matrix[coords1.y][coords1.x];
    matrix[coords1.y][coords1.x] = matrix[coords2.y][coords2.x];
    matrix[coords2.y][coords2.x] = coords1Number; 
    
    if(isWon(matrix)){
        console.log(true);
        addWonClass();
    }
}

let winFlatArr = new Array(16).fill(0).map((_item, i) => i + 1);        //Выигрышный массив
//Функция сверки массива и матрицы
function isWon(matrix){
    let flatMatrix = matrix.flat();
    for(let i = 0; i < winFlatArr.length; i++){
        if(flatMatrix[i] !== winFlatArr[i]){
            return false;
        }
    }
    return true;
}

let wonClass = 'fifteenWon';                                            //Класс с победой
//Функция добавления класса
function addWonClass(){
    setTimeout(() => {
        containerNode.classList.add(wonClass);

        setTimeout(() => {
            containerNode.classList.remove(wonClass);
        }, 5000);
    }, 200);
}

let blockedCoords = null;                                               //переменная которая не дает перемещаться одну и туже кнопку - блокиратор
//Функция перемешивания
function randomSwap(matrix){
    let blankCoords = findCoordinatesByNumber(blankNumber, matrix);     //Получение координат пустой кнопки
    let validCoords = findValidCoords({blankCoords,matrix, blockedCoords});
    
    let swapCoords = validCoords[
        Math.floor(Math.random() * validCoords.length)
    ];
    swap(blankCoords, swapCoords, matrix);
    blockedCoords = blankCoords;
}

function findValidCoords({blankCoords, matrix, blockedCoords}){
    let validCoords = [];
    for(let y = 0; y < matrix.length; y++){ // y - Ряды
        for(let x = 0; x < matrix[y].length; x++){
            if(isValidForSwap({x, y}, blankCoords)){
                if(!blockedCoords || !(blockedCoords.x === x && blockedCoords.y === y)){ // Координаты, которые нельзя двигать
                        validCoords.push({x, y}); 
                }
            }
        }
    }
    return validCoords;
}

// Смена цвет фона
let body = document.querySelector('body');
let inputColor = document.querySelector('.inputColor');

inputColor.addEventListener('keypress', function(e){
    if(e.key == 'Enter'){
        if(inputColor.value.length == 6){
            body.style.backgroundColor = "#" + inputColor.value;
            inputColor.value = '';
        }
    }
});

//Смена цвет клеток
let inputItemColor = document.querySelector('.inputItemColor');
let items = document.querySelectorAll('.item');

inputItemColor.addEventListener('keypress', function(e){
    if(e.key == 'Enter'){
        if(inputItemColor.value.length == 6){

            for(let elem of items){
                elem.style.background = "#" + inputItemColor.value;
            }
            inputItemColor.value = '';
        }
    }
});
