const form = document.querySelector('.form');
const input = document.querySelector('.task');
const taskTodoList = document.querySelector('.mask-list');
const taskListDone = document.querySelector('.complete-list');
const additionalInformationButton_1 = document.querySelector('#one');
const additionalInformationButton_2 = document.querySelector('#two');
const informationWrapper = document.querySelector('.information-wrapper')

const covidNewsUrl = 'https://newsapi.org/v2/everything?q=Covid&from=2021-05-08&sortBy=popularity&apiKey=f4494ea29c1947438f56dfb0bf11357b';
const weatherNewsUrl = 'https://api.openweathermap.org/data/2.5/weather?q=Kharkov&appid=991a635ee76f728662527e36fede40d0';
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
    localStorage.setItem('DOM', JSON.stringify(arr));
}

window.onload = () => {
    if (JSON.parse(localStorage.getItem('DOM'))) {
        todoList = JSON.parse(localStorage.getItem('DOM'));
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
const addStructure_COVID = () => {
    informationWrapper.innerHTML = '';
    informationWrapper.innerHTML = `
    <h3 class="information-title"></h3>
    <div class="information-img">
        <a class="link-to-source" target="_blank" href=""><img class="picture" src="" alt=""></a>
    </div>
    <p class="information-description"></p>
`
}
const addStructure_Weather = () => {
    informationWrapper.innerHTML = '';
    informationWrapper.innerHTML = `
    <div class="sup-wrapper">
        <div class="information-wrapper-cont">
             <h3 class="information-title title"></h3>
             <div class="picture-inner" ><img src="" alt="" class="picture"></div>
             <p class="information-description inf"></p>
         </div>
     </div>
    `
}
const fetchNewsCOVID = (url) => {
    fetch(url, {
        headers: {
            origin: 'http://localhost:63342',
             referer: 'http://localhost:63342/',
        },
        curl: ' https://newsapi.org/v2/everything',
        q: 'Covid',
        from: '2021-05-08',
        sortBy: 'popularity',
        apiKey: 'f4494ea29c1947438f56dfb0bf11357b',
    })
        .then(res => res.json())
        .then(data => {
            document.querySelector('.information-title').innerHTML = data.articles[0].title;
            document.querySelector('.information-description').innerHTML = data.articles[0].description
            document.querySelector('.picture').src = data.articles[0].urlToImage
            document.querySelector('.link-to-source').href = data.articles[0].url
        })
}
const fetchNewsWeather = (url) => {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            document.querySelector('.information-wrapper-cont').style.backgroundColor = '#e2dfdf';
            document.querySelector('.information-title').innerHTML = data.name;
            document.querySelector('.picture').src = `https://openweathermap.org/img/wn/${data?.weather[0]?.icon}@2x.png`
            document.querySelector('.information-description').innerHTML = Math.round(data.main.temp - 273) + '&deg;';
        })
}

additionalInformationButton_1.addEventListener('click', () => {
    try {
        addStructure_COVID()
        fetchNewsCOVID(covidNewsUrl)
    } catch (err) {
        console.log(err);
    }
})

additionalInformationButton_2.addEventListener('click', () => {
    try {
        addStructure_Weather();
        fetchNewsWeather(weatherNewsUrl);
    }catch (err) {
        console.log(err)
    }
})

