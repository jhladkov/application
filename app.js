// возвращает уникальный короткий ID в заданном числовом диапазоне
function getRandomID() {
    return Math.floor(Math.random() * (1679615 - 1 + 1)) + 1;
}

const form = document.querySelector('.form');
const addTask = document.querySelector('.task');
const listTaskToDo = document.querySelector('.mask-list');
const listTaskDone = document.querySelector('.complete-list');

let toDoArray = [];
let doneArray = [];

form.addEventListener('submit', (e) => {
    e.preventDefault()
    toDoArray.push({
        text: `
            <li class="mask-list-item">
              <div>
                <input class="compl" type="checkbox">
                <span>${addTask.value}</span>
              </div>
              <button class="btn-remove close">Remove</button>
            </li>        `,
        status: 'To Do',
        id: getRandomID(),
    })
    addTask.value = '';
    let textValue;

    const text = () => {
        toDoArray.forEach(item => {
            textValue = item.text;
        })
        return textValue;
    }

    listTaskToDo.innerHTML += text();

    let listTaskToDoItem = document.querySelectorAll('.mask-list-item'); // li
    let btnRemove = document.querySelectorAll('.close'); // btn-remove
    let checkBox = document.querySelectorAll('.compl');

    btnRemove.forEach((item, i) => {
        item.onclick = () => {
            toDoArray.splice(i, 1);
            listTaskToDoItem[i].remove();
            console.log(toDoArray);
        }
    });
    checkBox.forEach((item, i) => {
        item.onclick = () => {
            doneArray.push({
                text: toDoArray[i].text,
                status: 'Done',
                id: getRandomID(),
            })
            toDoArray.splice(i, 1);
            listTaskToDoItem[i].remove();
            console.log(doneArray)
            let textValueDone;

            const textDone = () => {
                doneArray.forEach(item => {
                    textValueDone = item.text;
                })
                return textValueDone;
            }

            listTaskDone.innerHTML += textDone();
        }
    })
})

