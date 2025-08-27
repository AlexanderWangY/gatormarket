import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useForm, type SubmitHandler } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authClient } from '@/lib/auth-client'
import LucideLoaderCircle from '~icons/lucide/loader-circle'
import { toast } from 'sonner'
import { useState } from 'react'

export const Route = createFileRoute('/_auth/signup')({
  component: RouteComponent,
})

const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(36, 'Name must be 36 characters or less'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type SignupInput = z.infer<typeof signupSchema>

function RouteComponent() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(signupSchema),
  })

  const onSubmit: SubmitHandler<SignupInput> = async (data) => {
    await authClient.signUp.email(
      {
        email: data.email,
        password: data.password,
        name: data.name,
      },
      {
        onError: (error) => {
          toast.error(
            error.error.message || 'Failed to sign up. Please try again.',
            { closeButton: true },
          )
        },
        onSuccess: () => {
          toast.success('Account created successfully! Please log in.', {
            closeButton: true,
          })
          router.navigate({ to: '/login' })
        },
        onRequest: () => {
          setLoading(true)
        },
      },
    )

    setLoading(false)
  }

  return (
    <div className="flex flex-col max-w-xs mx-auto min-h-screen overflow-visible items-center justify-center gap-4 relative">
      <div className="w-full">
        <h1 className="text-lg">Start Predicting</h1>
        <p className="text-neutral-500">Create a free account to begin.</p>
      </div>

      <form
        className="flex flex-col gap-4 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-2">
          <Label className="font-normal" htmlFor="name">
            Display Name
          </Label>
          <Input
            disabled={loading}
            {...register('name')}
            placeholder="Awesome Gator 352"
            className="w-full"
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="font-normal" htmlFor="email">
            Email
          </Label>
          <Input
            disabled={loading}
            {...register('email')}
            placeholder="albertgator@ufl.edu"
            className="w-full"
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="font-normal text-neutral-800" htmlFor="password">
            Password
          </Label>
          <Input
            disabled={loading}
            {...register('password')}
            placeholder="Password"
            type="password"
            className="w-full"
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            className="font-normal text-neutral-800"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </Label>
          <Input
            disabled={loading}
            {...register('confirmPassword')}
            placeholder="Re-enter password"
            type="password"
            className="w-full"
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          disabled={loading}
          className="w-full hover:cursor-pointer"
          type="submit"
        >
          {loading ? (
            <>
              <LucideLoaderCircle className="animate-spin" /> Working...
            </>
          ) : (
            'Sign Up'
          )}
        </Button>
      </form>

      <p className="text-neutral-500 text-xs">
        By signing up, you agree to abide by our Terms of Service and Privacy
        Policy.
      </p>

      <p className="text-neutral-500 text-xs absolute bottom-8">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-500 underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
