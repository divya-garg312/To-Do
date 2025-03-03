import { projectModule } from "./index.js";
export const newTasks = (() => {
    let taskContainer = document.getElementById('taskContainer');
    let tasks = [];
    let projectList = [];
    let currentProject;
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    const loadTasks = () => {
        let data = localStorage.getItem('tasks');
        if (data) {
            tasks = JSON.parse(data);
            currentProject = 'home';
            renderProject(tasks);
         }
    };

    const homeTask = () =>{
        localStorage.setItem('currentProject','home');
        currentProject = 'home';
        renderProject(tasks);
    }

    const createTask = () => {
        let data = localStorage.getItem('projects');
        if (data) {
            projectList = JSON.parse(data);
        }

        document.querySelector('#container').classList.add('blurred');
        let taskBox = document.createElement('div');
        let form = document.createElement('form');
        let title = document.createElement('input');
        let description = document.createElement('textarea');
        let date = document.createElement('input');
        let priority = document.createElement('select');
        let option1 = document.createElement('option');
        let option2 = document.createElement('option');
        let option3 = document.createElement('option');
        let addTask = document.createElement('button');
        let closeTask = document.createElement('button');
        let buttonContainer = document.createElement('div');
        let projects = document.createElement('select');
        let proj1 = document.createElement('option');

        proj1.value = 'home';
        proj1.textContent = 'Home';
        projects.append(proj1);
        title.required=true;
        date.required=true;
        addTask.type= 'submit';

        projectList.forEach(proj => {
            let projMore = document.createElement('option');
            projMore.value = proj;
            projMore.textContent = proj;
            projects.append(projMore);
        })

        option1.value = 'high';
        option1.textContent = 'High';
        option2.value = 'medium';
        option2.textContent = 'Medium';
        option3.value = 'low';
        option3.textContent = 'Low';
        title.type = 'text';
        date.type = 'date';
        addTask.textContent = 'Add';
        closeTask.textContent = 'Close';
        buttonContainer.classList.add('button-container')

        title.placeholder = 'title';
        title.setAttribute("required","true");
        date.setAttribute("required","true");
        description.placeholder = 'description';
        taskBox.setAttribute('id', 'taskBox');
        form.setAttribute('id','taskForm');

        buttonContainer.append(addTask, closeTask)
        priority.append(option1, option2, option3);
        form.append(title, description, date, projects, priority, buttonContainer);
        taskBox.append(form);
        document.body.append(taskBox);

        closeTask.onclick = () => {
            document.querySelector('#container').classList.remove('blurred');
            taskBox.remove();
        }
        form.onsubmit = (e) => {
            e.preventDefault();
            document.querySelector('#container').classList.remove('blurred');
           addNewTask(title.value, description.value, date.value, priority.value, projects.value);
            taskBox.remove();
        }
    }

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const renderProject = (tasks) => {
        taskContainer.innerHTML = '';
        currentProject = localStorage.getItem('currentProject') || 'home';
        let  filteredTask = tasks.filter(task => task.projects === currentProject);    
        filteredTask.forEach(({title,description,date,priority,projects})=>{
            addNewTask(title, description, date, priority, projects);
        })
    }

    const addNewTask = (title, description, date, priority, projects) => {
        let newTask = { title, date, description, priority, projects };
        if (!tasks.some(task =>
            task.title === title &&
            task.date === date &&
            task.projects === projects)) {
            tasks.push(newTask);
            saveTasks();
        }

        let list = document.createElement('div');
        let left = document.createElement('div');
        let right = document.createElement('div');
        let checkbox = document.createElement('input');
        let titleTask = document.createElement('p');
        let detailsTask = document.createElement('button');
        let cross = document.createElement('button');

        checkbox.type = 'checkbox';
        titleTask.textContent = title;
        detailsTask.textContent = 'Details';
        list.setAttribute('id', 'list');
        left.setAttribute('id', 'leftTask');
        right.setAttribute('id', 'rightTask');
        cross.setAttribute('id','cancel');
        cross.textContent = 'X';

        checkbox.onclick = () => {
            if(titleTask.style.textDecoration == "line-through"){
                titleTask.style.textDecoration = "none";  
            }
            else{
                titleTask.style.textDecoration = "line-through";
            }
        } 
        
        cross.onclick = () => removeTasks(list,newTask);
        detailsTask.onclick = () => detailTask(newTask);

        left.append(checkbox, titleTask);
        right.append(detailsTask, cross);
        list.append(left, right);
        taskContainer.append(list);
    }

    const removeTasks = (list,newTask) =>{
        tasks = tasks.filter(task => 
            task.title !== newTask.title ||
            task.projects !== newTask.projects);
        saveTasks();
        list.remove();
    }

    const detailTask = ({title, description, date, priority, projects}) => {
        document.querySelector('#container').classList.add('blurred');
        let detailsBox= document.createElement('div');
        let titleTask = document.createElement('p');
        let descriptionTask = document.createElement('p');
        let dateTask = document.createElement('p');
        let priorityTask = document.createElement('p');
        let projectTask =document.createElement('p');
        let close = document.createElement('button');

        titleTask.textContent = `Title : ${title}`;
        descriptionTask.textContent = `Description : ${description}`;
        dateTask.textContent = `Due Date : ${date}`;
        priorityTask.textContent = `Priority : ${priority}`;
        projectTask.textContent = `Project : ${projects}`;
        close.textContent='Close';
        detailsBox.append(titleTask,descriptionTask,dateTask,priorityTask,projectTask,close);
        detailsBox.setAttribute('id','details')
        document.body.append(detailsBox);

        close.onclick = () =>{
            document.querySelector('#container').classList.remove('blurred');
            detailsBox.remove();
        } 
    }

    const todayToDo = () => {
        taskContainer.innerHTML='';
            let todayTasks =tasks.filter(task =>  {
                let dueDate=new Date(task.date);
                dueDate.setHours(0, 0, 0, 0);
                return dueDate.getTime() == today.getTime();
                });
            todayTasks.forEach(task => addNewTask(task.title, task.description, task.date, task.priority, task.projects));
    }

    const upcoming = () =>{
        taskContainer.innerHTML='';
        let upcomingTasks = tasks.filter(task => {
            let dueDate=new Date(task.date);
                dueDate.setHours(0, 0, 0, 0);
                return dueDate.getTime() > today.getTime();
            });
        upcomingTasks.forEach(task => addNewTask(task.title, task.description, task.date, task.priority, task.projects));
    }

    const overdue = () =>{
        taskContainer.innerHTML='';
        let overdueTasks = tasks.filter(task => {
            let dueDate=new Date(task.date);
                dueDate.setHours(0, 0, 0, 0);
                return dueDate.getTime() < today.getTime();
            });
        overdueTasks.forEach(task => addNewTask(task.title, task.description, task.date, task.priority, task.projects));
    }
    return { createTask, loadTasks, renderProject, homeTask, todayToDo, upcoming, overdue };
})();

document.getElementById('addTask').onclick = newTasks.createTask;
document.getElementById('home').onclick = newTasks.homeTask;
document.getElementById('today').onclick = newTasks.todayToDo;
document.getElementById('upcoming').onclick = newTasks.upcoming;
document.getElementById('overdue').onclick = newTasks.overdue;

window.onload = () => {
    projectModule.loadProjects();
    newTasks.loadTasks();  
}


