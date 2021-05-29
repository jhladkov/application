const form = document.querySelector('.form');
const input = document.querySelector('.task');
const taskTodoList = document.querySelector('.mask-list');
const taskListDone = document.querySelector('.complete-list');
const selectTime = document.querySelector('.select')
const buttonSaveTime = document.querySelector('.save-time');

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

buttonSaveTime.addEventListener('click', () => {
    if (selectTime.value === 'disable') return;
    // notifySet(parseInt(((selectTime.value * 60) * 60) * 1000));
})

// const notifyMe = () => {
//     let notification = new Notification('To-Do List', {
//         tag: 'ache-mail',
//         body: 'Пора выполнить задачи'
//     })
// }
//
// const notifySet = () => {
//     if (!('Notification' in window)) alert('Ваш браузер не поддерживает уведомления');
//     Notification.requestPermission(function (permission) {
//         if (permission === 'granted') {
//             setInterval(notifyMe, 60000)
//         }
//     })
//      if (Notification.permission === 'granted') {
//         setInterval(notifyMe, 60000);
//     }
// }

const showNotification = () => {
    // create a new notification
    const notification = new Notification('JavaScript Notification API', {
        body: 'This is a JavaScript Notification API demo',
        // icon: './img/js.png'
    });
    // navigate to a URL when clicked
    notification.addEventListener('click', () => {
        window.open('https://www.javascripttutorial.net/web-apis/javascript-notification/', '_blank');
    });
}

window.onload = () => {
    if (JSON.parse(localStorage.getItem('task'))) {
        todoList = JSON.parse(localStorage.getItem('task'));
        addListToHtml(taskTodoList, enums.taskStatuses.TODO);
        changeTaskStatus();
    }
    // notifySet()
    showNotification()
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