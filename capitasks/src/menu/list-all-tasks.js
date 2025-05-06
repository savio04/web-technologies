import chalk from "chalk"
import { listTasks } from "../database/task-repository.js"
import { formatDate } from "../utils/date.js"
import inquirer from "inquirer"

export async function listAllTasks() {
  let tasks = await listTasks()

  const { wantsToSearch } = await inquirer.prompt([
    {
      type: "confirm",
      name: "wantsToSearch",
      message: "Deseja buscar por palavra-chave?",
      default: false,
    },
  ])

  let filteredTasks = tasks

  if (wantsToSearch) {
    const { keyword } = await inquirer.prompt([
      {
        type: "input",
        name: "keyword",
        message: "Digite a palavra-chave:",
      },
    ])

    filteredTasks = filteredTasks.filter(task =>
      task.title.toLowerCase().includes(keyword.toLowerCase()) ||
      task.description?.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  if (filteredTasks.length === 0) {
    console.log(chalk.red("Nenhuma tarefa encontrada com esse filtro.\n"))
    return
  }

  console.log(
    chalk.cyan("----------------------------------------------------")
  )

  const newTasks = filteredTasks.map(item => ({
    "id": item.id,
    "Titulo": item.title,
    "Descrição": item.description,
    "Prioridade": item.priority,
    "Concluida": item.concluded ? "Sim" : "Não",
    "Data criação": formatDate(item.created_at),
    "Data da conclusão": formatDate(item.concluded_at)
  }))

  console.table(newTasks)

  console.log(
    chalk.cyan("----------------------------------------------------")
  )
}
