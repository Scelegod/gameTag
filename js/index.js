"use strict"

let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
let page = document.querySelector('#page');
let all__buttons = document.querySelector('.all__buttons');

for(let elem of arr){
    let button = document.createElement('button');
    button.textContent = elem;
    button.setAttribute('class', 'item');
    all__buttons.appendChild(button);
    button.addEventListener('click', function(){
        console.log(button.textContent);

    });
}
all__buttons.lastElementChild.remove();

// let values = new Array(16).fill(0).map((item, index) => index + 1);
// for(let val in values){
//     let button = document.createElement('button');
//     button.textContent = val;
//     button.setAttribute('class', 'item');
//     all__buttons.appendChild(button);
// }