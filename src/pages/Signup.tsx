import React, { useState } from 'react'
import { useAuth } from '../auth/useAuth'

const Signup = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      await signup(name, email, password);
    } catch (error: string | unknown) {
      setError(error as string);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Create an account</h1>
        {error && <p>{error}</p>}
        <div>
        <label htmlFor="name">Name</label>
        <input 
        type="text"
        placeholder='Enter name' 
        value={name}
        onChange={(e)=>setName(e.target.value)}
        />
        </div>
        <div>
        <label htmlFor="email">Email</label>
        <input 
        type="email" 
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
        <button>Signup</button>
        <p>Already have an account ?<a href="/login">login</a> </p>
      </form>
    </div>
  )
}

export default Signup
