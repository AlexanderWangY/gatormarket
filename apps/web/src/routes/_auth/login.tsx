import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import LucideLoaderCircle from '~icons/lucide/loader-circle'


export const Route = createFileRoute('/_auth/login')({
  component: RouteComponent,
})

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginInput = z.infer<typeof loginSchema>

function RouteComponent() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  })

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onError: (error) => {
          toast.error(error.error.message || 'Something went wrong', { closeButton: true })
        },
        onSuccess: () => {
          toast.success('Successfully logged in', { closeButton: true })
          router.navigate({ to: '/account' })
        },
        onRequest: () => {
          setLoading(true)
        },
      },
    )

    setLoading(false)
  }

  return (
    <div className="flex flex-col max-w-xs mx-auto h-screen items-center justify-center gap-4 relative">
      <div className="w-full">
        <h1 className="text-lg">Welcome Back</h1>
        <p className="text-neutral-500">Login to your account</p>
      </div>

      <form
        className="flex flex-col gap-4 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
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

        <Button
          disabled={loading}
          className="w-full hover:cursor-pointer"
          type="submit"
        >
          {loading ? (
            <>
              <LucideLoaderCircle className="animate-spin" /> Logging in...
            </>
          ) : (
            'Log in'
          )}
        </Button>
      </form>

      <p className="text-neutral-500 text-xs">
        By logging in, you agree to abide by our Terms of Service and Privacy
        Policy.
      </p>

      <p className="text-neutral-500 text-xs absolute bottom-8">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="text-blue-500 underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
