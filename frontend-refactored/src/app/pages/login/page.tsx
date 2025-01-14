"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Logo from "../../../assets/logo.png"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import cookie from 'cookie';
import { sign } from 'jsonwebtoken';
import { NextResponse } from "next/server"
import { BASE_URL } from "@/types/api"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ToastProvider } from "@radix-ui/react-toast"
import { Toast } from "@/components/ui/toast"

export default function Login() {

    const router = useRouter()
    const { toast } = useToast()
    const formSchema = z.object({
        username: z.string().min(2, {
            message: "Nome de usuário deve conter ao menos 2 caracteres.",
        }),
        password: z.string().min(2, {
            message: "A senha deve conter ao menos 2 caracteres."
        })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })



    async function onSubmit(values: z.infer<typeof formSchema>) {

        console.log(values)
        const email = values.username
        const password = values.password

        try {

            const response = await fetch(`${BASE_URL}login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })
            console.log(response)

            if (response.ok) {
                const data = await response.json()
                if (typeof window !== 'undefined') {
                    const now = new Date().getTime();
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('tokenTimestamp', now.toString());
                    router.push("/")
                }
            } else if (response.status === 404) {
                const error = await response.json()
                toast({
                    title: error,
                    variant: "destructive"
                })
            }
        } catch (error: any) {
            console.log(error)
        }

    }

    return (
        <main className="w-full h-screen bg-blue-500 flex items-center justify-center">
            <ToastProvider>

                <Card className="w-2/6 backgroun to-transparent backdrop-blur-[10px]">
                    <CardHeader>
                        <div className="flex flex-col items-center justify-center gap-7">
                            <Image
                                src={Logo}
                                alt="Logo"
                                className="object-contain"
                            />
                            <CardTitle className="text-4xl font-bold">Stencil Vision</CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="h-12 text-lg">Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Digite seu email" className="h-12 text-lg" {...field} />
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
                                            <FormLabel className="h-12 text-lg">Senha</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Digite sua senha" type="password" className="h-12 text-lg"{...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full bg-blue-500 text-xl p-5 font-bold">ENTRAR</Button>
                            </form>
                        </Form>
                    </CardContent>

                </Card>
                <Toast />
            </ToastProvider>

        </main>
    )
}