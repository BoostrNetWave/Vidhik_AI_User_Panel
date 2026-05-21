import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { authService } from "@/services/authService"
import { Eye, EyeOff, User, Mail, Lock, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Logo } from "@/components/brand/Logo";

const signUpSchema = z.object({
    fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    terms: z.boolean().refine((val) => val === true, {
        message: "You must agree to the terms and conditions",
    }),
})

export default function SignUp() {
    // ... rest of the component
    const [showPassword, setShowPassword] = useState(false)

    // Password strength calculation (simple version)
    const calculateStrength = (password: string) => {
        if (!password) return 0
        let score = 0
        if (password.length >= 8) score += 25
        if (/[A-Z]/.test(password)) score += 25
        if (/[0-9]/.test(password)) score += 25
        if (/[^A-Za-z0-9]/.test(password)) score += 25
        return score
    }

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            terms: false,
        },
    })

    const [isLoading, setIsLoading] = useState(false)
    const passwordValue = form.watch("password")
    const passwordStrength = calculateStrength(passwordValue)
    const navigate = useNavigate()

    async function onSubmit(values: z.infer<typeof signUpSchema>) {
        setIsLoading(true)
        try {
            const data = await authService.register({
                fullName: values.fullName,
                email: values.email,
                password: values.password
            })

            // Store token and user data
            localStorage.setItem('user_token', data.token)
            localStorage.setItem('user_data', JSON.stringify(data))

            // Role-based redirection
            if (data.role === 'admin') {
                toast.success("Account created! Logging in as Super Admin...")
                navigate('/admin')
            } else {
                toast.success("Account created! Logging in as User...")
                navigate('/dashboard')
            }
        } catch (error: any) {
            console.error(error)
            const message = error.response?.data?.message || "Something went wrong. Please try again."
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 font-sans p-4">
            <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-lg rounded-lg">
                <div className="text-center">
                    <div className="flex justify-center mb-8">
                        <Logo className="h-16" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Create an account</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Start your 14-day free trial. No credit card required.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input placeholder="John Doe" className="pl-10 h-11 bg-gray-50 border-gray-200" autoComplete="off" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Work Email</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input placeholder="name@company.com" className="pl-10 h-11 bg-gray-50 border-gray-200" autoComplete="off" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <FormControl>
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="pl-10 pr-10 h-11 bg-gray-50 border-gray-200"
                                                autoComplete="off"
                                                {...field}
                                            />
                                        </FormControl>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-400" />
                                            )}
                                        </Button>
                                    </div>

                                    {/* Password Strength Indicator */}
                                    <div className="mt-3 space-y-2">
                                        <div className="flex gap-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
                                            <div className={`h-full w-1/4 ${passwordStrength > 0 ? 'bg-destructive/60' : 'bg-muted'}`} />
                                            <div className={`h-full w-1/4 ${passwordStrength > 25 ? 'bg-orange-400/60' : 'bg-muted'}`} />
                                            <div className={`h-full w-1/4 ${passwordStrength > 50 ? 'bg-primary/60' : 'bg-muted'}`} />
                                            <div className={`h-full w-1/4 ${passwordStrength > 75 ? 'bg-green-500/60' : 'bg-muted'}`} />
                                        </div>
                                        <p className="text-xs font-semibold text-green-500 uppercase">
                                            {passwordStrength > 75 ? "Strong Password" : passwordStrength > 50 ? "Medium Password" : "Weak Password"}
                                        </p>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="terms"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 text-left">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel className="font-normal text-gray-500">
                                            I agree to the <Link to="/terms" className="text-primary font-semibold hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary font-semibold hover:underline">Privacy Policy</Link>.
                                        </FormLabel>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isLoading} className="w-full h-12 text-lg bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center justify-center gap-2">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </Button>
                    </form>
                </Form>

                <div className="text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold text-primary hover:text-primary/80">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    )
}
