document.getElementById('add').addEventListener('click', function() {
    const taskInput = document.getElementById('task');
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: taskText })
        })
        .then(response => response.json())
        .then(task => {
            addTask(task);
            taskInput.value = '';
        });
    }
});

function addTask(task) {
    const taskItem = document.createElement('li');
    taskItem.textContent = task.text;
    taskItem.dataset.id = task.id;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
        fetch(`/tasks/${task.id}`, {
            method: 'DELETE'
        }).then(() => {
            taskItem.remove();
        });
    });

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function() {
        const newTaskText = prompt('Edit task:', task.text);
        if (newTaskText !== null && newTaskText.trim() !== '') {
            fetch(`/tasks/${task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: newTaskText.trim(), completed: taskItem.classList.contains('completed') ? 1 : 0 })
            }).then(() => {
                taskItem.firstChild.textContent = newTaskText.trim();
            });
        }
    });

    taskItem.appendChild(editButton);
    taskItem.appendChild(deleteButton);
    taskItem.addEventListener('click', function() {
        taskItem.classList.toggle('completed');
        fetch(`/tasks/${task.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: task.text, completed: taskItem.classList.contains('completed') ? 1 : 0 })
        });
    });

    document.getElementById('tasks').appendChild(taskItem);
}

// Fetch existing tasks on page load
window.onload = function() {
    fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
            tasks.forEach(task => addTask(task));
        });
};
