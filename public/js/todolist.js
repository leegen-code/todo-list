document.getElementById('add').addEventListener('click', function() {
    const taskInput = document.getElementById('task');
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const taskItem = document.createElement('li');
        taskItem.textContent = taskText;
        taskItem.addEventListener('click', function() {
            taskItem.classList.toggle('completed');
        });
        document.getElementById('tasks').appendChild(taskItem);
        taskInput.value = '';
    }
});
