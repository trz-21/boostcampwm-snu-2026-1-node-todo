const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'todos.json');

function loadTodos() {
  if (!fs.existsSync(FILE_PATH)) {
    return [];
  }
  const data = fs.readFileSync(FILE_PATH, 'utf-8');
  return JSON.parse(data);
}

function saveTodos(todos) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(todos, null, 2), 'utf-8');
}

function addTodo(content) {
  if (!content || content.trim() === '') {
    console.log('할 일 내용을 입력해 주세요.');
    return;
  }
  const todos = loadTodos();
  const id = todos.length > 0 ? todos[todos.length - 1].id + 1 : 1;
  todos.push({ id, content: content.trim(), done: false });
  saveTodos(todos);
  console.log(`Todo가 추가되었습니다: ${content}`);
}

function listTodos() {
  const todos = loadTodos();
  if (todos.length === 0) {
    console.log('Todo가 없습니다.');
    return;
  }
  todos.forEach((todo) => {
    const mark = todo.done ? '[x]' : '[ ]';
    console.log(`${mark} ${todo.id}. ${todo.content}`);
  });
}

function doneTodo(id) {
  const todos = loadTodos();
  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    console.log('해당 ID를 찾을 수 없습니다.');
    return;
  }
  todo.done = true;
  saveTodos(todos);
  console.log(`ID ${id}번 항목이 완료되었습니다.`);
}

function deleteTodo(id) {
  const todos = loadTodos();
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) {
    console.log('해당 ID를 찾을 수 없습니다.');
    return;
  }
  const removed = todos.splice(index, 1)[0];
  saveTodos(todos);
  console.log(`ID ${id}번 항목이 삭제되었습니다: ${removed.content}`);
}

function updateTodo(id, newContent) {
  const todos = loadTodos();
  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    console.log('해당 ID를 찾을 수 없습니다.');
    return;
  }
  todo.content = newContent;
  saveTodos(todos);
  console.log(`ID ${id}번 항목이 수정되었습니다: ${newContent}`);
}

const [, , command, ...args] = process.argv;

switch (command) {
  case 'add':
    addTodo(args[0]);
    break;
  case 'list':
    listTodos();
    break;
  case 'done':
    doneTodo(Number(args[0]));
    break;
  case 'delete':
    deleteTodo(Number(args[0]));
    break;
  case 'update':
    updateTodo(Number(args[0]), args[1]);
    break;
  default:
    console.log('사용법: node todo.js [add|list|done|delete|update] [인자]');
}
