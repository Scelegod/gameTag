"use strict"

let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
let page = document.querySelector('#page');
let all__buttons = document.querySelector('.all__buttons');
//Размер ячейки
let btnDimensions = 100;

for(let elem of arr){
    let button = document.createElement('button');
    button.textContent = elem;
    button.className = 'button';
    all__buttons.append(button);

    //Распложение ячеек 4 на 4
    let left = elem % 4;
    let top = (elem - left) / 4;
    
    //Показ ячеек 
    button.style.left = `${left * btnDimensions}px`;
    button.style.top = `${top * btnDimensions}px`;


    button.addEventListener('click', function(){
        console.log(button.textContent);
        
    }); 


}

function movingBtn(){

}