const input = document.querySelector("input");
const button = document.querySelector("button");
const list = document.querySelector("#tasks");

// Arreglo para guardar las tareas
let tasks = [];

const savedTasks = localStorage.getItem("tasks");

if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    renderTasks();
}

button.addEventListener("click", () => {
    addTask(); // Reutilizamos la función addTask en lugar de repetir código
});

/**
 * Creates and adds a new task to the list.
 * Reads the text from the input, and if it's not empty,
 * adds it to the array, renders it, and resets the input value.
 * Español: Crea y agrega una nueva tarea a la lista.
 * Lee el texto de la entrada y, si no está vacío,
 * lo agrega al arreglo, lo renderiza y restablece el valor de la entrada.
 * @returns {void}
 */
async function addTask() {

    const user = await getUser();

    if (!user) {
        alert("Debes iniciar sesión para agregar tareas");
        return;
    }

    const text = input.value;

    if (text.trim() === "") return;

    await supabaseClient
        .from("tasks")
        .insert({ tasks: text, user_id: user.id });

    getTasks();
    input.value = ""
}

/**
 * Gets all tasks from the database.
 * ESPAÑOL: Obtiene todas las tareas de la base de datos
 * @returns {void}
 */
async function getTasks() {

    const user = await getUser();

    if (!user) {
        alert("Debes iniciar sesión para obtener las tareas");
        return;
    }

    const { data, error } = await supabaseClient
        .from("tasks")
        .select("*")
        .eq("user_id", user.id);

    if (error) {
        console.error("Error al obtener las tareas:", error);
        return;
    }

    tasks = data;

    renderTasks();
}

function renderTasks() {
    list.innerHTML = "";

    tasks.forEach(tasks => {
        const listItem = document.createElement("li");
        listItem.textContent = tasks.tasks;
        list.appendChild(listItem);



        const deleteBtn = document.createElement("delete-button");
        deleteBtn.textContent = "x";
        deleteBtn.addEventListener("click", () => {
            deleteTask(tasks.id);
        });

        listItem.appendChild(deleteBtn); //Append the delete button to the list item
        //Español: Agrega el botón de eliminar al elemento de la lista

    });
}


async function deleteTask(id) {
    if (!confirm("¿Eliminar tarea?")) return

    await supabaseClient
        .from("tasks")
        .delete()
        .eq("id", id);

    getTasks();

}


const registerBtn = document.getElementById("register-btn");
const loginBtn = document.getElementById("login-btn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

registerBtn.addEventListener("click", () => {
    register();
});

loginBtn.addEventListener("click", () => {
    login();
});

/**
 * Registers a new user.
 * Español: Registra un nuevo usuario
 * @returns {void}
 */
async function register() {
    const email = emailInput.value;
    const password = passwordInput.value;

    const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
    });

    if (error) {
        console.error("Error al registrarse:", error);
        return;
    }

    console.log("Usuario registrado:", data);
}

/**
 * Logs in a user.
 * Español: Inicia sesión en la cuenta de un usuario
 * @returns {void}
 */
async function login() {
    const email = emailInput.value;
    const password = passwordInput.value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error("Error al iniciar sesión:", error);
        return;
    }

    console.log("Usuario logueado:", data);
}

/**
 * Gets current user
 * Español: Obtiene el usuario actual
 * @returns {void}
 */
async function getUser() {
    const { data: { user }, error } = await supabaseClient.auth.getUser();

    if (error) {
        if (error.name !== 'AuthSessionMissingError') {
            console.error("Error al obtener el usuario:", error);
        }
        return null;
    }

    return user;
}

const supabaseUrl = "https://uwxqjsggzobhziiepmli.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3eHFqc2dnem9iaHppaWVwbWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwODM5MjcsImV4cCI6MjA5MDY1OTkyN30.R9G6oQQ_wIdznRaWF5ogv9L6gWUQMMfkh6sBvD_nJE0"
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

getTasks();