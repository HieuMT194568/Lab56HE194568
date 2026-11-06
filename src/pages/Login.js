import React, { useEffect, useState } from 'react'
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await axios.get("http://localhost:9000/accounts");

    const user = res.data.find(
      (a) => a.email === email && a.password === password
    );

    if (!user) return;

    if (user.status === "Inactive") {
      setErrorMsg("Tài khoản đã bị khóa");
      return;
    }
  if (user.role === "student" || user.role === "lecturer") {
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/subjects");
    }
  };
  return (
    
     <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-4">
          <div className="card p-4">
            <h3 className="text-center">Sign in</h3>

            <div className="mb-3">
              <label>Email</label>
              <input
                type="text"
                className="form-control"
                placeholder="email of student or lecture"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {errorMsg && <div className="text-danger mb-3">{errorMsg}</div>}

            <button className="btn btn-primary" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login