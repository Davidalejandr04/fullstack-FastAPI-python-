import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { getTasks,createTask,deleteTask,toggleTask } from "../services/api";

function Dashboard(){
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    //verificar si existe token

    useEffect(()=>{
        const token = localStorage.getItem("token");

        if (!token){
            navigate("/");
            return;
        }

        fetchTasks();

    },[navigate]);

    //obtener tareas

    const fetchTasks = async() => {
            try{
                const data = await getTasks();
                setTasks(data);
            } catch (error){
                setError("Error to load tasks");
            }
    };

    //crear nueva tarea

    const handleCreateTask = async () => {
        if (!newTask.trim()) return;
        try {
            const task = await createTask(newTask);
            setTasks([...tasks, task]);
            setNewTask("");
        } catch (err){
            setError("Failed to create task");
        }
    };

    const handleDeleteTask = async(taskId) => {
        try{
            await deleteTask(taskId);
            setTasks(tasks.filter((task) => task.id !== taskId));
        } catch (err){
            setError("Failed to delete task");
        }
    };

    const handleToggleTask = async (taskId) => {
        try {
            const updateTask = await toggleTask(taskId);

            setTasks(
                tasks.map((task) => 
                task.id === taskId ? updateTask: task
            )
            );
        } catch (err) {
            setError("Failed to update task");
        }
    };

    // logout

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div style={{padding: "40px"}}>
            <h2>Dashboard</h2>
            <button onClick={handleLogout}>Logout</button>
            <hr />
            {/*Crear tarea*/}
            <div>
                <input 
                    type="text"
                    placeholder="New task"
                    value={newTask}
                    onChange={(e)=>setNewTask(e.target.value)}
                />
                <button onClick={handleCreateTask}>Add</button>
            </div>

            <hr />

            {/*Mostrar errores */}
            {error && <p style={{color:"red"}}>{error}</p>}

            {/*Lista de tareas */}

            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <span 
                            onClick={() => handleToggleTask(task.id)}
                            style={{
                                cursor: "pointer",
                                textDecoration: task.completed ? "line-through" : "none",
                                marginRight: "10px",
                            }}>
                            {task.title}
                        </span>
                        <button onClick={() => handleDeleteTask(task.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;