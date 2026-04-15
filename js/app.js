// ==========================================
// 1. CONFIGURATION & STATE
// ==========================================
const supabaseUrl = "https://uwxqjsggzobhziiepmli.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3eHFqc2dnem9iaHppaWVwbWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwODM5MjcsImV4cCI6MjA5MDY1OTkyN30.R9G6oQQ_wIdznRaWF5ogv9L6gWUQMMfkh6sBvD_nJE0";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// DOM Elements: Authentication
const loginScreen = document.getElementById("login-screen");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const logoutBtn = document.getElementById("logout-btn");

// DOM Elements: Tasks
const tasksScreen = document.getElementById("tasks-screen");
const newTaskInput = document.getElementById("new-task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const tasksList = document.getElementById("tasks");

// App State
let tasks = [];

// ==========================================
// 2. UI MANAGERS
// ==========================================

/**
 * EN: Toggles the view to show the Tasks screen and hide the Login screen.
 * ES: Alterna la vista para mostrar la pantalla de Tareas y ocultar la del Login.
 * @returns {void}
 */
function showTasksScreen() {
    loginScreen.style.display = "none";
    tasksScreen.style.display = "block";
    logoutBtn.style.display = "block";
}

/**
 * EN: Toggles the view to show the Login screen and hide the Tasks screen. Also clears inputs.
 * ES: Alterna la vista para mostrar la pantalla de Login y ocultar la de Tareas. Limpia los campos.
 * @returns {void}
 */
function showLoginScreen() {
    loginScreen.style.display = "block";
    tasksScreen.style.display = "none";
    logoutBtn.style.display = "none";
    emailInput.value = "";
    passwordInput.value = "";
}

/**
 * EN: Renders the fetched tasks into the DOM list.
 * ES: Renderiza las tareas obtenidas en la lista del DOM.
 * @returns {void}
 */
function renderTasks() {
    tasksList.innerHTML = "";

    tasks.forEach(task => {
        const listItem = document.createElement("li");
        listItem.textContent = task.tasks;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "✕";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", () => removeTask(task.id));

        listItem.appendChild(deleteBtn);
        tasksList.appendChild(listItem);
    });
}

// ==========================================
// 3. AUTHENTICATION SERVICES
// ==========================================

/**
 * EN: Validates and retrieves the email and password inputs.
 * ES: Valida y obtiene las entradas de correo y contraseña.
 * @returns {Object|null} 
 */
function getAuthCredentials() {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (!email || !password) {
        alert("Por favor, ingresa correo y contraseña.");
        return null;
    }
    return { email, password };
}

/**
 * EN: Retrieves the current authenticated user from Supabase.
 * ES: Obtiene el usuario autenticado actual de Supabase.
 * @returns {Promise<Object|null>}
 */
async function getCurrentUser() {
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    if (error && error.name !== 'AuthSessionMissingError') {
        console.error("Error al obtener el usuario:", error);
    }
    return user || null;
}

/**
 * EN: Handles the login process with Supabase.
 * ES: Maneja el proceso de inicio de sesión con Supabase.
 * @returns {Promise<void>}
 */
async function handleLogin() {
    const credentials = getAuthCredentials();
    if (!credentials) return;

    const { error } = await supabaseClient.auth.signInWithPassword(credentials);
    if (error) {
        alert("Error al iniciar sesión: " + error.message);
        return;
    }

    initApp();
}

/**
 * EN: Handles the user registration process with Supabase.
 * ES: Maneja el proceso de registro de usuario con Supabase.
 * @returns {Promise<void>}
 */
async function handleRegister() {
    const credentials = getAuthCredentials();
    if (!credentials) return;

    const { error } = await supabaseClient.auth.signUp(credentials);
    if (error) {
        alert("Error al registrarse: " + error.message);
        return;
    }

    alert("Registro exitoso. Iniciando sesión...");
    initApp();
}

/**
 * EN: Handles the logout process and redirects to login UI.
 * ES: Maneja el proceso de cerrar sesión y redirige a la interfaz de login.
 * @returns {Promise<void>}
 */
async function handleLogout() {
    await supabaseClient.auth.signOut();
    showLoginScreen();
}

// ==========================================
// 4. TASK SERVICES
// ==========================================

/**
 * EN: Fetches the task list for the current user from the database.
 * ES: Obtiene la lista de tareas del usuario actual desde la base de datos.
 * @returns {Promise<void>}
 */
async function fetchTasks() {
    const user = await getCurrentUser();
    if (!user) return;

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

/**
 * EN: Creates a new task and inserts it into the database.
 * ES: Crea una nueva tarea y la inserta en la base de datos.
 * @returns {Promise<void>}
 */
async function createNewTask() {
    const user = await getCurrentUser();
    if (!user) {
        alert("Debes iniciar sesión para agregar tareas");
        showLoginScreen();
        return;
    }

    const text = newTaskInput.value.trim();
    if (!text) return;

    const { error } = await supabaseClient
        .from("tasks")
        .insert({ tasks: text, user_id: user.id });

    if (error) {
        console.error("Error al guardar la tarea:", error);
        return;
    }

    newTaskInput.value = "";
    fetchTasks();
}

/**
 * EN: Deletes a task by its ID from the database.
 * ES: Elimina una tarea por su ID desde la base de datos.
 * @param {string|number} id - Task ID / ID de la tarea
 * @returns {Promise<void>}
 */
async function removeTask(id) {
    if (!confirm("¿Eliminar tarea?")) return;

    const { error } = await supabaseClient
        .from("tasks")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error al eliminar la tarea:", error);
        return;
    }

    fetchTasks();
}

// ==========================================
// 5. EVENT LISTENERS & INITIALIZATION
// ==========================================

/**
 * EN: Attaches all required static DOM event listeners.
 * ES: Vincula todos los escuchadores de eventos estáticos del DOM.
 * @returns {void}
 */
function attachEventListeners() {
    loginBtn.addEventListener("click", handleLogin);
    registerBtn.addEventListener("click", handleRegister);
    logoutBtn.addEventListener("click", handleLogout);

    // Allows 'Enter' key to trigger adding task / Permite la tecla 'Enter' para agregar tarea
    addTaskBtn.addEventListener("click", createNewTask);
    newTaskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") createNewTask();
    });
}

/**
 * EN: Main initialization point of the application. Verifies authentication and displays matching UI.
 * ES: Punto principal de inicio de la app. Verifica la autenticación y muestra la UI correspondiente.
 * @returns {Promise<void>}
 */
async function initApp() {
    const user = await getCurrentUser();
    if (user) {
        showTasksScreen();
        fetchTasks();
    } else {
        showLoginScreen();
    }
}

// Bootstrap application
attachEventListeners();
initApp();