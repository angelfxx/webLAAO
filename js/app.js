const input = document.querySelector("input")
const button = document.querySelector("button")
const tasks = document.querySelector("#tasks")

button.addEventListener("click", () => {
    const task = input.value;
    const li = document.createElement("li");
    li.textContent = task;
    tasks.appendChild(li);
    input.value = "";
});


function addTask() {

    const text = input.value

    if (text === "") return

    const li = document.createElement("li")

    li.textContent = text

    list.appendChild(li)

    input.value = ""

}
