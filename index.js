const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
let numberOfRequests = 0;

//Middleware que verifica se o projeto existe com base no id enviado pela URL
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.id == id);

  if (projectIndex === -1) {
    return res.status(404).json({ error: "Project not found" });
  }

  return next();
}

//Middleware que verifica se o projeto existe com base no id enviado pelo Body
function checkProjectExistsBody(req, res, next) {
  const { id } = req.body;
  const projectIndex = projects.findIndex(p => p.id == id);

  if (projectIndex !== -1) {
    return res.status(400).json({ error: "Project already exists" });
  }

  return next();
}

//Middleware que conta as requisições
function countRequests(req, res, next) {
  numberOfRequests++;

  console.log(`Number of requests: ${numberOfRequests}`);

  return next();
}

server.use(countRequests);

//Cria um projeto com id e título
server.post("/projects", checkProjectExistsBody, (req, res) => {
  const { id, title } = req.body;

  const project = { id, title, tasks: [] };

  projects.push(project);

  return res.json(project);
});

//Lista todos os projetos
server.get("/projects", (req, res) => {
  return res.json(projects);
});

//Altera o título de um projeto
server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

//Deleta um projeto
server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

//Cadastra nova tarefa em um projeto
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);
  return res.json(project);
});

server.listen(3000);
