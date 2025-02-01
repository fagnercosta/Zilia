"use client"
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { BASE_URL } from "@/types/api";
import { Stencil, UsersTipe } from "@/types/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertColor, Button, Checkbox, Divider, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar, TextField } from "@mui/material";
import axios from "axios";
import { CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface FormData {
     email:string;
     first_name: string;
     last_name: string;
     password: string;
     is_active: boolean;
    
     super_user: boolean;
     
}

 

export default function CadastroUser(user:UsersTipe) {
    

    
    const [openSnackBar, setOpenSnackBar] = useState(false)
    const [alert, setAlert] = useState<AlertColor>("success")
    const [message, setMessage] = useState('')
    const navigate = useRouter()

    

    const [formData, setFormData] = useState<FormData>({
        email:"",
        first_name:"",
        last_name:"",
        password:"",
        is_active:true,
        super_user:false
        
    });


    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
    };

    const action = (
        <React.Fragment>

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

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;
    
        if (type === 'checkbox') {
            setFormData(prevData => ({
                ...prevData,
                [name]: checked
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: type === 'number' ? Number(value) : value
            }));
        }
    };

    const handleChangeSelect = (event: SelectChangeEvent<unknown>) => {
        event.preventDefault();
        const { name, value } = event.target;
        console.log(value)
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }))
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        console.log(formData)

        event.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}create-user/`, formData);

            console.log(formData)
            if (response) {
                setMessage("Cadastro realizado com sucesso")
                setAlert("success")
                setOpenSnackBar(true)
                navigate.push("/pages/users")
            }

        } catch (error) {
            console.log(error)
            setMessage("Erro ao realizar a operação.")
            setAlert("error")
            setOpenSnackBar(true)
        }
    };

    return (
        <main className="lg:ml-72 p-4">
            <Sidebar />
            <div className="w-full h-[80vh] flex flex-col items-center justify-center">
                <Card className="w-[90%] bg-slate-50">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Cadastro de Usuários</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Primeiro Nome"
                                        name="first_name"
                                        type="text"
                                        required={true}
                                        value={formData.first_name}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4}>
                                    <TextField
                                        fullWidth
                                        type="text"
                                        required={true}
                                        label="Ultimo Nome"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                
                                <Grid item xs={12} sm={12} md={4}>
                                    <TextField
                                        fullWidth
                                        type="text"
                                        required={true}
                                        label="E-mail"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </Grid>

                                

                                <Grid item xs={12} sm={12} md={4}>
                                    <TextField
                                        fullWidth
                                        type="text"
                                        required={true}
                                        label="Senha"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </Grid>

                                <Grid item xs={3} sm={12} md={3}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="is_active"
                                                checked={formData.is_active}
                                                onChange={handleChange}
                                            />
                                        }
                                        label="Usuário Ativo"
                                    />
                                </Grid>

                                <Grid item xs={3} sm={12} md={3}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="super_user"
                                                checked={formData.super_user}
                                                onChange={handleChange}
                                            />
                                        }
                                        label="Administrador"
                                    />
                                </Grid>
                                
                                

                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained" color="primary">Cadastrar</Button>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </div>
            <Snackbar
                open={openSnackBar}
                autoHideDuration={4000}
                action={action}
                onClose={handleClose}
                message={message}
            >
                <Alert
                    onClose={handleClose}
                    severity={alert}
                    variant="standard"
                    sx={{ width: '100%' }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </main>
    )
}