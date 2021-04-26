const form = document.querySelector('.form');
const input = document.querySelector('.task');
const taskTodoList = document.querySelector('.mask-list');
const taskListDone = document.querySelector('.complete-list');

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
    return  `<li class="mask-list-item">
              <div>
                <input ${checkState} onclick="changeTaskStatus(${id})" class="compl" type="checkbox">
                <span>${value}</span>
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
})

