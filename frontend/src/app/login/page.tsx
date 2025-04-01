"use client";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Logo from "../../assets/logo.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import IconButton from '@mui/material/IconButton';
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/types/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ToastProvider } from "@radix-ui/react-toast";
import { Toast } from "@/components/ui/toast";
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import { Alert, AlertColor } from "@mui/material";
import { CircleX } from "lucide-react";

export default function Login() {
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [messageSnack, setMessageSnack] = useState("");
    const [alert, setAlert] = useState<AlertColor>("success");
    const router = useRouter();
    const { toast } = useToast();
    const { login } = useAuth();  // Corrigido: utilização do contexto de autenticação

    const formSchema = z.object({
        username: z.string().min(2, {
            message: "Nome de usuário deve conter ao menos 2 caracteres.",
        }),
        password: z.string().min(2, {
            message: "A senha deve conter ao menos 2 caracteres."
        }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const handleClick = () => {
        setOpenSnackBar(true);
    };

    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
    };

    const action = (
        <React.Fragment>
            <Button color="secondary" size="sm" onClick={handleClose}>
                UNDO
            </Button>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CircleX fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        const email = values.username;
        const password = values.password;

        try {
            const response = await fetch(`${BASE_URL}login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                if (typeof window !== 'undefined') {
                    login(data.token);  // Chamada correta do login
                }
            } else if (response.status === 401 || response.status === 400) {
                setMessageSnack("Usuário ou senha inválidos");
                setOpenSnackBar(true);
                setAlert("error");
            }
        } catch (error: any) {
            if (error.message.includes('Failed to fetch')) {
                setMessageSnack("Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente mais tarde.");
                setOpenSnackBar(true);
                setAlert("info");
            }
        }
    }

    return (
        <main className="w-full h-screen bg-blue-500 flex items-center justify-center px-5">
            <ToastProvider>
                <Card className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 backdrop-blur-[10px]">
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
                                                <Input placeholder="Digite sua senha" type="password" className="h-12 text-lg" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full bg-blue-500 text-sm p-5 font-bold">ENTRAR</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
                <Toast />
            </ToastProvider>

            <Snackbar
                open={openSnackBar}
                autoHideDuration={6000}
                onClose={handleClose}
                message={messageSnack}
                action={action}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleClose}
                    severity={alert}
                    variant="standard"
                    sx={{ width: '100%' }}
                >
                    {messageSnack}
                </Alert>
            </Snackbar>
        </main>
    );
}