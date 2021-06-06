const form = document.querySelector('.form');
const input = document.querySelector('.task');
const taskTodoList = document.querySelector('.mask-list');
const taskListDone = document.querySelector('.complete-list');


// logic colors
const header = document.querySelector('.header')
const callColorChart = document.querySelector('.call-color-chart')
const backgroundShadow = document.querySelector('.shadow')
const colorChart = document.querySelector('.color-chart')
const colorChartItemHeader = document.querySelectorAll('.color-chart-item-header')
const colorChartItemButtons = document.querySelectorAll('.color-chart-item-button')
let buttons = document.querySelectorAll('.our')

const addColorManagement = () => {
    backgroundShadow.classList.add('active');
    colorChart.classList.add('active')
}

const removeColorManagement = () => {
    backgroundShadow.classList.remove('active')
    colorChart.classList.remove('active')
}

const buttonsAndHeaderStyle = (buttons, header) => {
    if (buttons) {
        buttons.forEach(item => {
            item.style.backgroundColor = localStorage.getItem('colorStyleButtons')
        })
    }
    if (header) {
        header.style.backgroundColor = localStorage.getItem('colorStyleHeader')
    }
}
colorChartItemHeader.forEach(item => {
    item.onclick = async () => {
        await localStorage.setItem('colorStyleHeader',item.id)
        removeColorManagement()
        buttonsAndHeaderStyle(null,header)
    }
})
colorChartItemButtons.forEach(item => {
    item.onclick = async () => {
        await localStorage.setItem('colorStyleButtons',item.id)
        removeColorManagement()
        buttonsAndHeaderStyle(buttons)
    }
})

callColorChart.onclick = () => addColorManagement()

backgroundShadow.onclick = () => removeColorManagement()
//

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
              <button onclick="removeTask(${id})" class="btn-remove close our">Remove</button>
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
    buttons = document.querySelectorAll('.our')
    buttonsAndHeaderStyle(buttons,header)
}

const removeTask = (id) => {
    todoList = todoList.filter((item) => item.id !== id); // отфильтруй массив что бы у его елементов не совпадал id с аргументом id
    updateDOM();
    setItemInLocalStorage(todoList);
    buttonsAndHeaderStyle(buttons,header)
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
    buttonsAndHeaderStyle(buttons,header)
}

const setItemInLocalStorage = (arr) => {
    localStorage.setItem('task', JSON.stringify(arr));
}
window.onload = () => {
    if (JSON.parse(localStorage.getItem('task'))) {
        todoList = JSON.parse(localStorage.getItem('task'));
        addListToHtml(taskTodoList, enums.taskStatuses.TODO);
        changeTaskStatus();
    }
    if (localStorage.getItem('colorStyleHeader')) {
        buttonsAndHeaderStyle(null,header)
    }
    if (localStorage.getItem('colorStyleButtons')) {
        buttonsAndHeaderStyle(buttons)
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