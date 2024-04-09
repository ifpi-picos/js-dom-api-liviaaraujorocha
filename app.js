
function initGoogleCalendarAPI() {
    gapi.client.init({
        apiKey: 'AIzaSyB_n-sDpPawfYM-MhttExTtJvtW2NHgFOw',
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        clientId: null,
        scope: 'https://www.googleapis.com/auth/calendar.events'
    }).then(function () {
        console.log('API do Calendário do Google inicializada com sucesso!');
    }, function(error) {
        console.error('Erro ao inicializar a API do Calendário do Google:', error);
    });
}
function createGoogleCalendarEvent(task) {
    gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': {
            'summary': task.nome,
            'start': {
                'date': task.data 
            },
            'end': {
                'date': task.data 
            }
        }
    }).then(function(response) {
        console.log('Evento criado com sucesso:', response);
    }, function(error) {
        console.error('Erro ao criar o evento:', error);
    });
}

function loadGoogleCalendarAPI() {
    gapi.load('client', initGoogleCalendarAPI);
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("task_form").addEventListener("submit", function(event) {
        event.preventDefault(); 
        
        var nome_task = document.getElementById("task_name").value;
        var status_task = document.getElementById("task_status").value;
        var data_task = document.getElementById("task_date").value;
        var id_task = document.getElementById("task_id").value;
        
        if (nome_task.trim() !== "") {
            var task = {
                nome: nome_task,
                status: status_task,
                data: data_task
            };
            
            if(id_task.trim() !== "") {
                task.id_task = parseInt(id_task); 
                editar_task(task);
            } else {
                salvar_task(task);
            }
            loadTasks();
            
            document.getElementById("task_name").value = "";
            document.getElementById("task_status").value = "fazer";
            document.getElementById("task_date").value = "";
            document.getElementById("task_id").value = ""; 
        }
    });

    document.getElementById("clear_button").addEventListener("click", function() {
        clearTasks();
    });

    function addTaskToHTML(task) {
        var newItem = document.createElement("li");
        var editar_link = document.createElement("a");
        editar_link.textContent = "Editar"
        editar_link.onclick = function(event){
            document.getElementById("task_name").value = task.nome;
            document.getElementById("task_status").value = task.status;
            document.getElementById("task_date").value = task.data;
            document.getElementById("task_id").value = task.id_task;
        }
        newItem.textContent = `${task.nome} - Status: ${task.status} - Data: ${task.data}`;
        newItem.appendChild(editar_link);
        document.getElementById(task.status).appendChild(newItem);
    }

    function salvar_task(task) {
        var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push(task);
        createGoogleCalendarEvent(task)
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function editar_task(task) {
        var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks[task.id_task] = task;
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        clearHTMLTask();
        var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(addTaskToHTML);
    }

    function clearTasks() {
        localStorage.removeItem("tasks");
        clearHTMLTask();
    }

    function clearHTMLTask(){
        document.getElementById("fazer").innerHTML = "";
        document.getElementById("fazendo").innerHTML = "";
        document.getElementById("feito").innerHTML = "";
    }

    
    loadTasks();
});
