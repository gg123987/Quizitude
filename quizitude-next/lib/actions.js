'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const inputData = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  console.log('Form data:', inputData)

  const { data, error } = await supabase.auth.signInWithPassword(inputData)
  console.log(data)
  console.log(error)

  if (error) {
    redirect("/auth/login?message=Could not authenticate user");
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const inputData = {
    email: formData.get('email'),
    password: formData.get('password'),
    options: {
        data: { full_name: formData.get('name'), },
        emailRedirectTo: `${origin}/auth/callback`,
      },
  }

  const { data, error } = await supabase.auth.signUp(inputData)
  console.log(data)

  if (error) {
    redirect("/auth/register?message=Could not authenticate user");
  }

  revalidatePath('/', 'layout')
  redirect('/')
}