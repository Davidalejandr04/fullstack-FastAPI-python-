import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

function Register(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState ("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await registerUser(username,password);
            navigate("/"); //volver al login
        } catch (err) {
            setError("Registration failed");            
        }
    };
    return(
        <div style={{padding: "40px"}}>
            <h2>Register</h2>

            <form onSubmit={handleRegister}>
                <div>
                    <input 
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} 
                    />
                </div>

                <div>
                    <input 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>

                <button type="submit">Register</button>
            </form>
            <button onClick={()=>navigate("/")}>
                Back to login
            </button>

            {error && <p style={{color:"red"}}>{error}</p>}
        </div>
    );
}

export default Register