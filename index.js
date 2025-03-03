import  {newTasks} from "./tasks.js"
export const projectModule = (() => {
    let list = [];
    let tasks = [];
    let currentProject = 'home' ;

    const loadProjects = () => {
        let data = localStorage.getItem('projects');
        if (data) {
            list = JSON.parse(data);
            list.forEach(element => addBox(element));
        }
    };

    const saveProjects = () => {
        localStorage.setItem('projects', JSON.stringify(list));
    };

    const createProjectUI = (projName) => {
        let projectDiv = document.createElement('div');
        let span = document.createElement('span');
        let cross = document.createElement('button');
        span.onclick = () =>{
            currentProject = projName;
            localStorage.setItem('currentProject',currentProject);
            newTasks.loadTasks();
        }
        projectDiv.setAttribute('id', 'projectDiv');
        span.textContent = projName;
        cross.textContent = 'X';
        cross.onclick = () => removeProjects(projectDiv, projName);

        projectDiv.append(span, cross);
        return projectDiv;
    };

    const addBox = (projName) => {
        if (!projName) {
            alert('Fill the required field');
            return;
        }
        if (!list.some(proj=> proj === projName)) {
            list.push(projName);
            saveProjects();
        }
        let projectDiv = createProjectUI(projName);
        document.getElementById('projectContainer').append(projectDiv);
    };

    const removeProjects = (projectDiv, value) => {
        list = list.filter(proj => proj !== value);
        let data = localStorage.getItem('tasks');
        tasks = JSON.parse(data);
        tasks=tasks.filter(task =>
            task.projects != value
        )
        localStorage.setItem('tasks', JSON.stringify(tasks));
        saveProjects();
        projectDiv.remove();
    };

    const inputUI = () => { 

        let project = document.createElement('div');
        let inputProject = document.createElement('input');
        let add = document.createElement('button');
        let close = document.createElement('button');
        let buttonContainer = document.createElement('div');
        document.querySelector('#container').classList.add('blurred');

        project.setAttribute('id', 'newProject');
        inputProject.type = 'text';
        inputProject.style.display = 'block';
        inputProject.placeholder = 'Project Name';
        add.textContent = 'Add';
        close.textContent = 'Close';
        buttonContainer.classList.add('button-container');

        buttonContainer.append(add, close);
        project.append(inputProject, buttonContainer);
        document.body.append(project);

        close.onclick = () => {
            document.querySelector('#container').classList.remove('blurred');
            project.remove()
        };
        add.onclick = () => {
            document.querySelector('#container').classList.remove('blurred');
            addBox(inputProject.value);
            project.remove();
        };
    }
    return { loadProjects, inputUI,list,currentProject }
})();

document.getElementById('addProjects').onclick = projectModule.inputUI;


