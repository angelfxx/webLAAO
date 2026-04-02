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
async function addTask() {
    const text = input.value

    if (text === "") return

    await supabase
        .from("tasks")
        .insert({ text });

    getTasks();
    input.value = ""
}

async function getTasks() {
    const { data, error } = await supabase
        .from("tasks")
        .select("*");//select * es para seleccionar todas las columnas de la tabla tasks

    if (error) {
        console.error("Error al obtener las tareas:", error);
        return;
    }

    tasks = data;
    renderTasks();
}

function renderTasks() {
    list.innerHTML = "" // Limpiamos la lista antes de volver a pintarla

    tasks.forEach(task => {
        const listitem = document.createElement("li");
        listItem.textContent = task.text;
        list.appendChild(listItem);
    })
}


function deleteTask() {
    tasks.pop() // Elimina el último elemento del arreglo
    renderTasks() // Volvemos a renderizar la lista
}

getTasks();

const supabaseUrl = "https://uwxqjsggzobhziiepmli.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3eHFqc2dnem9iaHppaWVwbWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwODM5MjcsImV4cCI6MjA5MDY1OTkyN30.R9G6oQQ_wIdznRaWF5ogv9L6gWUQMMfkh6sBvD_nJE0"
const supabase = supabase.createClient(supabaseUrl, supabaseKey)
