
const API_URL = "http://localhost:8000"

export async function loginUser(username,password) {
    const formData = new URLSearchParams();
    formData.append("username",username);
    formData.append("password",password);
    
    const response = await fetch(`${API_URL}/login`,{
        method: "POST",
        headers: {
            "Content-Type":"application/x-www-form-urlencoded",
        },
        body: formData,
    });

    if(!response.ok){
        throw new Error("Invalid credentials");
    }
    return response.json();
}

export async function getTasks() {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:8000/tasks", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok){
        throw new Error("Failed to fetch tasks");
    }

    return response.json();
    
}

export async function createTask(title) {

    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:8000/tasks",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({title}),
    });

    if (!response.ok) {
        throw new Error("Failed to create task");
    }

    return response.json();
    
}

export async function deleteTask(taskId) {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:8000/tasks/${taskId}`,{
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok){
        throw new Error("Failed to delete task");
    }
}

export async function toggleTask(taskId) {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:8000/tasks/${taskId}`,{
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok){
        throw new Error("Failed to update task");
    }
    return response.json();
}

export async function registerUser(username, password) {
    

    const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
        }),
    });

    if (!response.ok){
        const data = await response.json();
        throw new Error(data.detail || "Failed to register");
    }
    
    return response.json();
}

