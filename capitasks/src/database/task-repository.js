import { randomUUID } from "node:crypto"
import { writeFile, readFile } from "node:fs/promises"

const databasePath = "src/database/database.json"

const tables = {
  TASKS: "tasks"
}

async function loadTable(table) {
  const database = await readFile(databasePath, "utf-8")

  let items = []

  if (database) {
    const jsonData = JSON.parse(database)

    items = jsonData[table] || []
  }

  return items
}

async function saveTable(table, items) {
  await writeFile(
    databasePath,
    JSON.stringify({
      [table]: items
    })
  )
}

export async function listTasks(params) {
  let allTasks = await loadTable(tables.TASKS)

  if (typeof params?.concluded !== "undefined") {
    allTasks = allTasks.filter((item) => item.concluded === params.concluded)
  }

  return allTasks
}

export async function createTask(newTask) {
  const currentTasks = await loadTable(tables.TASKS)

  currentTasks.push({
    id: randomUUID(),
    ...newTask
  })


  await saveTable(tables.TASKS, currentTasks)
}

export async function updateByIds(ids, params) {
  const currentTasks = await loadTable(tables.TASKS)

  for (const id of ids) {
    const index = currentTasks.findIndex(item => item.id === id)

    if (index >= 0) {
      if (typeof params.concluded !== "undefined") currentTasks[index].concluded = params.concluded
      if (typeof params.concluded_at !== "undefined") currentTasks[index].concluded_at = params.concluded_at
    }
  }

  await saveTable(tables.TASKS, currentTasks)
}

export async function deleteByIds(ids) {
  const currentTasks = await loadTable(tables.TASKS)

  const newTasks = currentTasks.filter(item => !ids.includes(item.id))

  await saveTable(tables.TASKS, newTasks)
}
