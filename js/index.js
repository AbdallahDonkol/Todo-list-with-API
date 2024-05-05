const apiKey = '662e15ba902d75ddf860798d';
let loading = document.getElementById('loading');
let tasks = document.getElementById("tasks");

document.getElementById('btn').addEventListener('click',function(){
    enterTodo();
});

function enterTodo(){
    let title = document.getElementById('title').value;
    
    sendTodo(title).then(function(){
        getAllTodos()
    }).catch(function(err){
        console.log(err);
    });
    clearInput();
}

//^ function to send Todo data
async function sendTodo(title){
    let body={
        title,
        apiKey,
    }
    let data = await fetch("https://todos.routemisr.com/api/v1/todos",{
        method: 'POST',
        body: JSON.stringify(body),
        headers:{
            'content-type':'application/json'
        }
    });
    let result = await data.json()
    if(result.message != "success"){
        document.getElementById('errorMsg').classList.replace("d-none","d-block");
    }else{
        document.getElementById('errorMsg').classList.replace("d-block","d-none");
    }
}

//^ function to get Todos 
async function getAllTodos(){
    loading.style.display = "block";
    tasks.style.display = "none";
    let data = await fetch(`https://todos.routemisr.com/api/v1/todos/${apiKey}`); 
    let {todos} = await data.json();
    displayTodo(todos);
    loading.style.display = "none";
    tasks.style.display = "block";
    if(todos.length > 0){
        document.getElementById("allTasks").innerHTML = "All Tasks";
    }else{
        document.getElementById("allTasks").innerHTML = "No Tasks";
    }
}

getAllTodos();
//^ function to display Todos in the web page
function displayTodo(list){
    let cartona = "";
    for(let i=0;i<list.length;i++){
        cartona+=`<div
        class="task ${list[i].completed? 'completed-bg':''} d-flex align-items-center justify-content-between w-75 mx-auto mt-4 p-2 mb-3 rounded-4">
        <div class="task-text px-3 text-justify">
          <p class="mb-0 text-white fs-5 ${list[i].completed? 'text-decoration-line-through':'text-decoration-none'} ">${list[i].title}</p>
        </div>
        <div class="icons d-flex">
          <i class="fa-regular fa-circle-check me-4 ms-3 fs-5 ${list[i].completed? 'd-none':''} " onclick="markCompleted('${list[i]._id}')"></i>
          <i class="fa-solid fa-trash-can me-3 fs-5" onclick="deleteTodo('${list[i]._id}')"></i>
        </div>
      </div>`
    }
    tasks.innerHTML = cartona;
}
//^ function to delete single Todo
async function deleteTodo(id){
    let body={
        todoId:id
    }
    let data = await fetch("https://todos.routemisr.com/api/v1/todos",{
        method: 'delete',
        body: JSON.stringify(body),
        headers:{
            'content-type':'application/json'
        }
    });
    let result = await data.json()
    if(result.message == "success"){
        getAllTodos();
    }
    document.getElementById('errorMsg').classList.replace("d-block","d-none");
}
//^ function to update single Todo by mark it as completed
async function markCompleted(id){
    let body={
        todoId:id
    }
    let data = await fetch("https://todos.routemisr.com/api/v1/todos",{
        method: 'put',
        body: JSON.stringify(body),
        headers:{
            'content-type':'application/json'
        }
    });
    let result = await data.json()
    if(result.message == "success"){
        getAllTodos();
    }
    document.getElementById('errorMsg').classList.replace("d-block","d-none");
}
// ^ function to send data using Enter in keyboard
document.addEventListener("keyup", function(e){
    switch (e.code) {
        case "Enter":
            enterTodo();
            break;
        default:
            break;
    }
})
// ^ function to clear input field after sending data
function clearInput(){
    document.getElementById('title').value ='';
}