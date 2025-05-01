import inquirer from "inquirer"
import { listAllTasks } from "./list-all-tasks.js"
import { createNewTask } from "./create-new-task.js"
import { deleteTasks } from "./delete-task.js"
import { completeTasks } from "./complete-task.js"

const execChoices = {
  "1- Cadastrar nova tarefa": createNewTask,
  "2- Listar tarefas": listAllTasks,
  "3- Marcar tarefa como concluída": completeTasks,
  "4- Deletar tarefa": deleteTasks
}

const choices = [
  '1- Cadastrar nova tarefa',
  '2- Listar tarefas',
  '3- Marcar tarefa como concluída',
  '4- Deletar tarefa',
  '5- Sair',
]

export async function showMenu() {
  try {
    const { option } = await inquirer.prompt([
      {
        type: 'list',
        name: 'option',
        message: 'O que você deseja fazer?',
        pageSize: 10,
        choices
      },
    ])

    const exec = execChoices[option]

    if (exec) {
      await exec()

      showMenu()
    }
  } catch (error) { }
} 
