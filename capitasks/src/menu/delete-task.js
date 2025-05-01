import inquirer from "inquirer"
import { deleteByIds, listTasks } from "../database/task-repository.js"
import chalk from "chalk"

export async function deleteTasks() {
  const tasks = await listTasks()

  const choices = tasks.map((t, i) => ({
    name: `${i + 1}. ${t.title} (${t.priority})`,
    value: t.id,
  }));

  if (choices.length === 0) {
    console.log(chalk.yellow("Nenhuma tarefa cadastrada\n"))
    return
  }

  const { ids } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "ids",
      message: "Selecione as tarefas que deseja deletar:",
      choices,
    },
  ])

  try {
    await deleteByIds(ids)

    console.log(chalk.green(`Número de tarefas deletas: ${ids?.length}\n`))
  } catch (error) {
    console.log(chalk.red("Erro ao deleter tarefas"), error)
  }
}
