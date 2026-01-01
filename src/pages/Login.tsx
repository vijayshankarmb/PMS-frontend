import React, { useState } from 'react'
import { useAuth } from '../auth/useAuth'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {      
      e.preventDefault();
      await login(email, password);
    } catch (error: string | unknown) {
      setError(error as string);
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Login to ur account</h1>
        {error && <p>{error}</p>}
        <div>
          <label htmlFor="email">Email</label>
          <input type="email"
          placeholder='me@example.com'
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input 
          type="password"
          placeholder='Enter password' 
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          />
        </div>
        <button>Login</button>
        <p>Dont have account ?<a href="/signup">signup</a> </p>
      </form>
    </div>
  )
}

export default Login
