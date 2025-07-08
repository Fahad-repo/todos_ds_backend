const express = require('express');
const app = express();
app.use(express.json());


let todos = [
  { id: 1, message: 'Complete Assignment' },
  { id: 2, message: 'Make Projects' },
  { id: 3, message: 'Deploy Projects' }
];


const getNextId = () => (todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1);


app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});


app.post('/todos', (req, res) => {
  const { message } = req.body;
  if (!message){
    return res.status(400).json({ error: 'Message is required' });
  } 

  const newTodo = { id: getNextId(), message };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});


app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { message } = req.body;

  const index = todos.findIndex(todo => todo.id === id);
  if (index === -1){
    return res.status(404).json({ error: 'Todo not found' });
  } 

  todos[index] = { id, message };
  res.status(200).json(todos[index]);
});


app.patch('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { message } = req.body;

  const todo = todos.find(todo => todo.id === id);
  if (!todo){
    return res.status(404).json({ error: 'Todo not found' });
  } 

  if (message) todo.message = message;
  res.status(200).json(todo);
});


app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(todo => todo.id === id);
  if (index === -1){
    return res.status(404).json({ error: 'Todo not found' });
  } 

  const deleted = todos.splice(index, 1);
  res.json(deleted[0]);
});

//localhost:3000/todos/sortById?k=desc
app.get('/todos/sortById', (req, res) => {
  const k = req.query.k === 'desc' ? 'desc' : 'asc';
  const sorted = [...todos].sort((a, b) => (k === 'asc' ? a.id - b.id : b.id - a.id));
  res.json(sorted);
});

//localhost:3000/todos/sortByMessage?k=desc
app.get('/todos/sortByMessage', (req, res) => {
  const k = req.query.k === 'desc' ? 'desc' : 'asc';
  const sorted = [...todos].sort((a, b) =>
    k === 'asc'
      ? a.message.localeCompare(b.message)
      : b.message.localeCompare(a.message)
  );
  res.json(sorted);
});

//localhost:3000/todos/search?keyword=d
app.get('/todos/search', (req, res) => {
  const keyword = req.query.keyword?.toLowerCase();
  if (!keyword){
    return res.status(400).json({ error: 'Keyword is required' });
  } 

  const result = todos.filter(t => t.message.toLowerCase().includes(keyword));
  res.json(result);
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
