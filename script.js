

;(function(){

  const STORAGE_KEY = 'todo.tasks.v1';

  const form = document.getElementById('task-form');
  const input = document.getElementById('task-input');
  const list = document.getElementById('task-list');

  let tasks = loadTasks();

  function saveTasks(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function loadTasks(){
    try{
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }catch(e){
      return [];
    }
  }

  function render(){
    list.innerHTML = '';
    if(tasks.length === 0){
      const li = document.createElement('li');
      li.className = 'task-item';
      li.textContent = 'No tasks yet. Add one above.';
      list.appendChild(li);
      return;
    }

    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-item';
      li.dataset.id = task.id;

      const left = document.createElement('div');
      left.className = 'task-left';

        // small toggle indicator (optional)
        const toggle = document.createElement('button');
        toggle.className = 'btn toggle';
        toggle.setAttribute('aria-label', task.completed ? 'Mark as incomplete' : 'Mark as complete');
        toggle.innerHTML = task.completed ? '✓' : '○';
        toggle.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleComplete(task.id);
        });

        const span = document.createElement('span');
        span.className = 'task-text' + (task.completed ? ' completed' : '');
        span.textContent = task.text;
        span.addEventListener('click', () => toggleComplete(task.id));

        left.appendChild(toggle);
        left.appendChild(span);

      const btns = document.createElement('div');
      btns.className = 'btns';

      const del = document.createElement('button');
      del.className = 'btn delete';
      del.setAttribute('aria-label','Delete task');
      del.textContent = '❌';
      del.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(task.id);
      });

      btns.appendChild(del);

      li.appendChild(left);
      li.appendChild(btns);

      list.appendChild(li);
    });
  }

  function addTask(text){
    const trimmed = text.trim();
    if(!trimmed) return;
    const task = {id: Date.now().toString(), text: trimmed, completed: false};
    tasks.unshift(task);
    saveTasks();
    render();
  }

  function toggleComplete(id){
    tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
    saveTasks();
    render();
  }

  function deleteTask(id){
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    render();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(input.value);
    input.value = '';
    input.focus();
  });

  input.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' && !e.shiftKey){
      e.preventDefault();
      addTask(input.value);
      input.value = '';
    }
  });

  render();
})();