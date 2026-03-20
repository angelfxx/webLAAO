const input = document.querySelector("input")

const button = document.querySelector("button")

// Referencia al contenedor <ul> en el HTML
const list = document.querySelector("#tasks")

// Arreglo para guardar las tareas
let tasks = [];

const saveTasks = localStorage.getItem("tasks")

if (saveTasks) {
    tasks = JSON.parse(saveTasks)
    renderTasks()
}
/**
 * Event listener for the button click.
 * Reads the task from the input, creates a new list item,
 * appends it to the tasks container, and clears the input field.
 */
button.addEventListener("click", () => {
    addTask(); // Reutilizamos la función addTask en lugar de repetir código
});

/**
 * Creates and adds a new task to the list.
 * Reads the text from the input, and if it's not empty,
 * adds it to the array, renders it, and resets the input value.
 */
function addTask() {
    const text = input.value

    if (text === "") return

    tasks.push(text)

    localStorage.setItem("tasks", JSON.stringify(tasks))

    renderTasks()

    input.value = ""
}


function renderTasks() {
    list.innerHTML = "" // Limpiamos la lista antes de volver a pintarla
    tasks.forEach(task => {
        const listitem = document.createElement("li")
        listitem.textContent = task
        list.appendChild(listitem)
    })
}


function deleteTask() {
    tasks.pop() // Elimina el último elemento del arreglo
    renderTasks() // Volvemos a renderizar la lista
}
