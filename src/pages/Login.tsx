import React, { useState } from 'react'
import { useAuth } from '../auth/useAuth'
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-4xl font-bold
          '>
            Login
          </CardTitle>
          <CardDescription className='font-semibold'>
            Enter your email and password to login
          </CardDescription>
          {error && <p className='text-red-500'>{error}</p>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='grid gap-6'>
            <div className='grid gap-2'>
              <Label htmlFor="email" className='space-y-1'>Email</Label>
              <Input type="email"
                placeholder='me@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div  className='grid gap-2'>
              <Label htmlFor="password" className='space-y-1'>Password</Label>
              <Input
                type="password"
                placeholder='Enter password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button>Login</Button>
          </form>
        </CardContent>
        <CardFooter className='flex justify-center items-center'>
          <p>Dont have account ? <a href="/signup" className='underline text-blue-500'> Signup </a> </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login
