let todos = [
  { id: 1, title: "Task 1", completed: false, description: "Task 1 desc" },
  { id: 2, title: "Task 2", completed: true, description: "Task 2 desc" },
  { id: 3, title: "Task 3", completed: false, description: "Task 3 desc" },
  { id: 4, title: "Task 4", completed: true, description: "Task 4 desc" },
];

export default function WorkingWithArrays(app) {
  // ============================================
  // CALLBACK FUNCTIONS (grouped at the top)
  // ============================================

  // GET ALL TODOS (with optional completed filter)
  const getTodos = (req, res) => {
    const { completed } = req.query;

    if (completed !== undefined) {
      const isCompleted = completed === "true";
      return res.json(todos.filter(t => t.completed === isCompleted));
    }

    res.json(todos);
  };

  // GET TODO BY ID
  const getTodoById = (req, res) => {
    const { id } = req.params;
    const todo = todos.find(t => t.id === parseInt(id));
    res.json(todo);
  };

  // CREATE NEW TODO (GET VERSION - old way)
  const createNewTodo = (req, res) => {
    const newTodo = {
      id: new Date().getTime(),
      title: "New Task",
      completed: false,
      description: "New Description",
    };
    todos.push(newTodo);
    res.json(todos);
  };

  // CREATE NEW TODO (POST VERSION - new way with req.body)
  const postNewTodo = (req, res) => {
    const newTodo = { ...req.body, id: new Date().getTime() };
    todos.push(newTodo);
    res.json(newTodo);
  };

  // DELETE TODO (GET VERSION - old way)
  const removeTodo = (req, res) => {
    const { id } = req.params;
    todos = todos.filter(t => t.id !== parseInt(id));
    res.json(todos);
  };

  // ✨ DELETE TODO (HTTP DELETE - new way with error handling)
  const deleteTodo = (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex(t => t.id === parseInt(id));
    
    if (todoIndex === -1) {
      res.status(404).json({ message: `Unable to delete Todo with ID ${id}` });
      return;
    }
    
    todos.splice(todoIndex, 1);
    res.sendStatus(200);
  };

  // UPDATE TITLE (GET VERSION - old way)
  const updateTodoTitle = (req, res) => {
    const { id, title } = req.params;
    const todo = todos.find(t => t.id === parseInt(id));
    if (todo) todo.title = title;
    res.json(todos);
  };

  // UPDATE COMPLETED (GET VERSION - old way)
  const updateTodoCompleted = (req, res) => {
    const { id, completed } = req.params;
    const todo = todos.find(t => t.id === parseInt(id));
    if (todo) todo.completed = completed === "true";
    res.json(todos);
  };

  // UPDATE DESCRIPTION (GET VERSION - old way)
  const updateTodoDescription = (req, res) => {
    const { id, description } = req.params;
    const todo = todos.find(t => t.id === parseInt(id));
    if (todo) todo.description = description;
    res.json(todos);
  };

  // ✨ UPDATE TODO (HTTP PUT - new way with error handling)
  const updateTodo = (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex(t => t.id === parseInt(id));
    
    if (todoIndex === -1) {
      res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
      return;
    }
    
    todos = todos.map(t =>
      t.id === parseInt(id) ? { ...t, ...req.body } : t
    );
    
    res.sendStatus(200);
  };

  // ============================================
  // ROUTE DECLARATIONS (grouped at the bottom)
  // ORDER MATTERS!
  // ============================================

  app.get("/lab5/todos", getTodos);
  app.get("/lab5/todos/create", createNewTodo);
  app.post("/lab5/todos", postNewTodo);
  
  // ✨ NEW HTTP DELETE AND PUT ROUTES
  app.delete("/lab5/todos/:id", deleteTodo);
  app.put("/lab5/todos/:id", updateTodo);
  
  // OLD GET ROUTES (keep for earlier exercises)
  app.get("/lab5/todos/:id/delete", removeTodo);
  app.get("/lab5/todos/:id/title/:title", updateTodoTitle);
  app.get("/lab5/todos/:id/completed/:completed", updateTodoCompleted);
  app.get("/lab5/todos/:id/description/:description", updateTodoDescription);
  app.get("/lab5/todos/:id", getTodoById);
}