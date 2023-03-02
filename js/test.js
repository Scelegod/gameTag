
let all__buttons = document.querySelector('.all__buttons');
let buttonSize = 100;

let emptyBtn = {
    top: 0,
    left: 0
};

let buttons = [];
buttons.push(emptyBtn);

let numbers = [...Array(15).keys()].sort(() => Math.random() - 0.5);

for(let i = 1; i <= 15; i++){
    let button = document.createElement('div');
    button.className = 'item';
    button.innerHTML = numbers[i - 1] + 1;
    
    let left = i % 4;
    let top = (i - left) / 4;

    buttons.push({
        left: left,
        top: top,
        buttonEl: button
    });

    
    button.style.left = `${left * buttonSize}px`;
    button.style.top = `${top * buttonSize}px`;

    all__buttons.append(button);

    button.addEventListener('click', function(){
        move(i);
    });
}

function move(index){
    let button = buttons[index];
    let leftDiv = Math.abs(emptyBtn.left - button.left);
    let topDiv = Math.abs(emptyBtn.top - button.top);
    

    if(leftDiv + topDiv > 1){
        return;
    }
    
    button.buttonEl.style.left = `${emptyBtn.left * buttonSize}px`;
    button.buttonEl.style.top = `${emptyBtn.top * buttonSize}px`;

    let emptyBtnLeft = emptyBtn.left;
    let emptyBtnTop = emptyBtn.top;
    emptyBtn.left = button.left;
    emptyBtn.top = button.top;
    button.left = emptyBtnLeft;
    button.top = emptyBtnTop;


}

//Рандомайзей