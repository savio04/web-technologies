import inquirer from "inquirer";
import { createTask } from "../database/task-repository.js"
import chalk from "chalk";

export async function createNewTask() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Digite o título da tarefa:",
      validate: (input) => {
        if (input.trim() === "") {
          return "O título é obrigatório."
        }
        return true;
      }
    },
    {
      type: "input",
      name: "description",
      message: "Digite uma descrição (opcional):",
    },
    {
      type: "list",
      name: "priority",
      message: "Qual a prioridade?",
      choices: ["Baixa", "Média", "Alta"],
    },
  ])

  const newTask = {
    title: answers.title,
    description: answers.description === '' ? null : answers.description,
    priority: answers.priority,
    concluded: false,
    created_at: new Date()
  };

  try {
    await createTask(newTask)

    console.log(chalk.green(`Nova tarefa registrada com sucesso!\n`))
  } catch (error) {
    console.log(chalk.red("Erro ao registrar tarefa"), error)
  }
} 
