const form = document.querySelector('.form');
const input = document.querySelector('.task');
const taskTodoList = document.querySelector('.mask-list');
const taskListDone = document.querySelector('.complete-list');
// const selectTime = document.querySelector('.select')
// const buttonSaveTime = document.querySelector('.save-time');

let todoList = [];

const enums = {
    taskStatuses: {
        TODO: 'todo',
        DONE: 'done',
    },
}

const getRandomID = () => {
    return Math.floor(Math.random() * (1679615 - 1 + 1)) + 1;
}

const getTemplate = (value, id, status) => {
    const checkState = status === enums.taskStatuses.TODO ? '' : 'checked';
    return `<li class="mask-list-item">
              <div class="inner">
                <input ${checkState} onclick="changeTaskStatus(${id})" class="compl" type="checkbox">
                <span></span>
                <p class="text">${value}</p>
              </div>
              <button onclick="removeTask(${id})" class="btn-remove close">Remove</button>
            </li>`;
}

const resetInputValue = () => {
    input.value = '';
}

const updateDOM = () => {
    addListToHtml(taskTodoList, enums.taskStatuses.TODO);
    addListToHtml(taskListDone, enums.taskStatuses.DONE);
}

const addListToHtml = (nodeList, status) => {
    nodeList.innerHTML = todoList.filter((item) => item.status === status).map((item) => item.text).join('');
}

const removeTask = (id) => {
    todoList = todoList.filter((item) => item.id !== id); // отфильтруй массив что бы у его елементов не совпадал id с аргументом id
    updateDOM();
    setItemInLocalStorage(todoList);
}

const reverseStatus = (item) => {
    return item.status === enums.taskStatuses.TODO
        ? enums.taskStatuses.DONE
        : enums.taskStatuses.TODO
}

const changeTaskStatus = (id) => {
    todoList = todoList.map((item) => {
        if (item.id === id) {
            return {
                ...item,
                text: getTemplate(item.value, item.id, reverseStatus(item)),
                status: reverseStatus(item),
            }
        }
        return item;
    })
    updateDOM();
    setItemInLocalStorage(todoList)
}

const setItemInLocalStorage = (arr) => {
    localStorage.setItem('task', JSON.stringify(arr));
}

// buttonSaveTime.addEventListener('click', () => {
//     if (selectTime.value === 'disable') return;
//     notifyMe(parseInt(((selectTime.value * 60) * 60) * 1000));
// })

// const showNotification = () => {
//     const notification = new Notification('To-Do List', {
//         body: 'Пора выполнять задачи',
//         icon: 'https://www.javascripttutorial.net/wp-content/uploads/2020/09/js.png'
//     });
//     notification.addEventListener('click', () => {
//         window.open('https://jhladkov.github.io/application/', '_blank');
//     });
// }
//test
// const test = () => {
//     let data = new Date();
//     if (data.getMinutes() === 40) {
//         clearInterval(intervalNotification)
//         return showNotification()
//     }
// }
//
// const notifyMe = async () => {
//     let granted = false;
//
//     if (Notification.permission === 'granted') {
//         granted = true;
//     } else if (Notification.permission !== 'denied') {
//         let permission =  await Notification.requestPermission();
//         granted = permission === 'granted' ? true : false;
//     }
//
//     granted ? intervalNotification : console.log('Вы отменили сообщения');
// }
// let intervalNotification = setInterval(test, 1000)
//

window.onload = async () => {
    if (JSON.parse(localStorage.getItem('task'))) {
        todoList = JSON.parse(localStorage.getItem('task'));
        addListToHtml(taskTodoList, enums.taskStatuses.TODO);
        changeTaskStatus();
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const generateId = getRandomID();
    todoList.push({
        text: getTemplate(input.value, generateId, enums.taskStatuses.TODO),
        value: input.value,
        status: enums.taskStatuses.TODO,
        id: generateId,
    })
    resetInputValue();
    addListToHtml(taskTodoList, enums.taskStatuses.TODO);
    setItemInLocalStorage(todoList);
})