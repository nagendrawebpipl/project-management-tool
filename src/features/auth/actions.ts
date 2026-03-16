"use server"

import { createClient } from "@/lib/supabase/server"
import { loginSchema, signupSchema, updateProfileSchema, type LoginValues, type SignupValues, type UpdateProfileValues } from "./schemas"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function signUpAction(values: SignupValues) {
  const validatedFields = signupSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields" }
  }

  const { email, password, fullName } = validatedFields.data
  const supabase = (await createClient()) as any

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  return { success: "Account created! Check your email to confirm." }
}

export async function signInAction(values: LoginValues) {
  const validatedFields = loginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields" }
  }

  const { email, password } = validatedFields.data
  const supabase = (await createClient()) as any

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signOutAction() {
  const supabase = (await createClient()) as any
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}

export async function updateProfileAction(values: UpdateProfileValues) {
  const validatedFields = updateProfileSchema.safeParse(values)
  if (!validatedFields.success) return { error: "Invalid fields" }

  const supabase = (await createClient()) as any
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { error: "Not authenticated" }

  const { fullName, avatarUrl } = validatedFields.data

  // Update auth metadata
  const { error: updateError } = await supabase.auth.updateUser({
    data: { full_name: fullName, avatar_url: avatarUrl }
  })
  
  if (updateError) return { error: updateError.message }

  // Update profiles table
  const { error: profileError } = await (supabase
    .from("profiles")
    .update({ full_name: fullName, avatar_url: avatarUrl } as any)
    .eq("id", user.id) as any)

  if (profileError) return { error: profileError.message }

  revalidatePath("/settings")
  revalidatePath("/", "layout")
  return { success: true }
}
