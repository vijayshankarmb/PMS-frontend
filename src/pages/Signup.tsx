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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-4xl font-bold'>
            Create an account
          </CardTitle>
          <CardDescription className='font-semibold'>
            Enter your details to create an account
          </CardDescription>
          {error && <p className='text-red-500'>{error}</p>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='grid gap-6'>
            <div className='grid gap-2'>
              <Label htmlFor="name" className='space-y-1'>Name</Label>
              <Input
                id="name"
                type="text"
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor="email" className='space-y-1'>Email</Label>
              <Input
                id="email"
                type="email"
                placeholder='me@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor="password" className='space-y-1'>Password</Label>
              <Input
                id="password"
                type="password"
                placeholder='Enter password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button>Signup</Button>
          </form>
        </CardContent>
        <CardFooter className='flex justify-center items-center'>
          <p>Already have an account ? <a href="/login" className='underline text-blue-500'> Login </a> </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Signup
