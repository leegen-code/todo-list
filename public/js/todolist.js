document.getElementById('add').addEventListener('click', function() {
    const taskInput = document.getElementById('task');
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        addTask(taskText);
        taskInput.value = '';
    }
});

function addTask(taskText) {
    const taskItem = document.createElement('li');
    taskItem.textContent = taskText;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
        taskItem.remove();
    });

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function() {
        const newTaskText = prompt('Edit task:', taskText);
        if (newTaskText !== null && newTaskText.trim() !== '') {
            taskItem.firstChild.textContent = newTaskText.trim();
        }
    });

    taskItem.appendChild(editButton);
    taskItem.appendChild(deleteButton);
    taskItem.addEventListener('click', function() {
        taskItem.classList.toggle('completed');
    });

    document.getElementById('tasks').appendChild(taskItem);
}
