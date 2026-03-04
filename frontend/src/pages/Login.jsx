import { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    
    const handleLogin = async (e) =>{
        e.preventDefault();

        try {
            const data = await loginUser(username,password);

            // guardar token
            localStorage.setItem("token", data.access_token);

            // redirigir a dashboard
            navigate("/dashboard");

        } catch (err){
            setError("Invalid username or password");

        }
    };

    return(
        <div style={{padding: "40px"}}>
            <h2>Login</h2>

            <form onSubmit={handleLogin}>
                <div>
                    <input 
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                    autoComplete="username"
                    />
                </div>

                <div>
                    <input 
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    autoComplete="current-password"
                    />
                </div>

                <button type="submit">Login</button>

                <button type="button" onClick={() => navigate("/register")}>
                    Register
                </button>

            </form>

            {error && <p style={{color: "red"}}>{error}</p>}

        </div>
    );
}

export default Login;