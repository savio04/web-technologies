import inquirer from "inquirer";
import { listTasks, updateByIds } from "../database/task-repository.js"
import chalk from "chalk";

export async function completeTasks() {
  const tasks = await listTasks({ concluded: false })

  const choices = tasks.map((t, i) => ({
    name: `${i + 1}. ${t.title} (${t.priority})`,
    value: t.id,
  }));

  if (choices.length === 0) {
    console.log(chalk.yellow("Nenhuma tarefa não concluida\n"))
    return
  }

  const { ids } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "ids",
      message: "Selecione as tarefas que deseja marcar como concluídas:",
      choices,
    },
  ])

  try {
    await updateByIds(ids, { concluded: true, concluded_at: new Date() })

    console.log(chalk.green(`Número de tarefas concluidas: ${ids?.length}\n`))
  } catch (error) {
    console.log(chalk.red("Erro ao atualizar tarefas"), error)
  }
}
