// Add event listener to the "Add" button to create a new task
document.getElementById('add').addEventListener('click', function() {
    const taskInput = document.getElementById('task');
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        // Send a POST request to create a new task
        fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: taskText })
        })
        .then(response => response.json())
        .then(task => {
            // Add the new task to the list and clear the input field
            addTask(task);
            taskInput.value = '';
        });
    }
});

// Function to add a task to the list
function addTask(task) {
    const taskItem = document.createElement('li');
    taskItem.textContent = task.text;
    taskItem.dataset.id = task.id;

    // Create and add a "Delete" button to the task item
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
        // Send a DELETE request to remove the task
        fetch(`/tasks/${task.id}`, {
            method: 'DELETE'
        }).then(() => {
            taskItem.remove();
        });
    });

    // Create and add an "Edit" button to the task item
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function() {
        const newTaskText = prompt('Edit task:', task.text);
        if (newTaskText !== null && newTaskText.trim() !== '') {
            // Send a PUT request to update the task
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

    // Add event listener to toggle the "completed" state of the task
    taskItem.appendChild(editButton);
    taskItem.appendChild(deleteButton);
    taskItem.addEventListener('click', function() {
        taskItem.classList.toggle('completed');
        // Send a PUT request to update the task's completed state
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
            // Add each fetched task to the list
            tasks.forEach(task => addTask(task));
        });
};
