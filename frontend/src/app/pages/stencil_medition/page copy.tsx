"use client"; // Para habilitar funcionalidades do cliente no Next.js

import InovaBottomImage from "@/components/InovaBottomImage";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BASE_URL } from "@/types/api";
import { Stencil } from "@/types/models";
import { 
    Alert, 
    AlertColor, 
    Button, 
    Divider, 
    Grid, 
    Snackbar, 
    TextField, 
    Autocomplete 
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth/AuthContext"; // Importando o contexto de autenticação

interface FormData {
    p1: number | null;
    p2: number | null;
    p3: number | null;
    p4: number | null;
    measurement_datetime: string | null;
    is_registration_measurement: boolean;
    is_approved_status: boolean;
    cicles: number;
    stencil_id: number;
}

export default function StencilMedition() {
    const [stencilList, setStencilList] = useState<Stencil[]>([]);
    const [stencilSelected, setStencilSelected] = useState<Stencil | null>(null);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [alert, setAlert] = useState<AlertColor>("success");
    const [message, setMessage] = useState('');
    const navigate = useRouter();
    const { logout } = useAuth(); // Utilizando o contexto de autenticação

    useEffect(() => {
        const getStencils = async () => {
            try {
                const response = await axios.get(`${BASE_URL}api/stencil/`);
                if (response?.data?.results?.length > 0) {
                    setStencilList(response.data.results);
                } else {
                    setMessage('Não há stencils cadastrados.');
                    setAlert("warning");
                    setOpenSnackBar(true);
                }
            } catch (error: any) {
                setMessage('Erro ao buscar os stencils.');
                setAlert("error");
                setOpenSnackBar(true);
            }
        };
        getStencils();
    }, []);

    const [formData, setFormData] = useState<FormData>({
        p1: null,
        p2: null,
        p3: null,
        p4: null,
        measurement_datetime: null,
        is_registration_measurement: false,
        is_approved_status: false,
        cicles: 0,
        stencil_id: 0,
    });

    const handleClose = () => setOpenSnackBar(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleChangeAutocomplete = (event: React.SyntheticEvent, value: Stencil | null) => {
        setStencilSelected(value);
        setFormData(prevData => ({
            ...prevData,
            stencil_id: value ? value.stencil_id : 0,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await axios.post(`${BASE_URL}api/stencilTensionValues/`, formData);
            setMessage("Cadastro realizado com sucesso");
            setAlert("success");
            setOpenSnackBar(true);
            navigate.push("/list_stencil_medition"); // Corrigido
        } catch (error) {
            setMessage("Erro ao realizar a operação.");
            setAlert("error");
            setOpenSnackBar(true);
        }
    };

    const handleLogout = () => {
        logout(); // Usando a função do contexto para garantir a remoção do token
        navigate.push("/login"); // Redirecionando corretamente
    };

    return (
        <main className="lg:ml-[23rem] p-4">
            <Sidebar logouFunction={handleLogout} />
            <div className="w-full min-h-screen mt-10 flex flex-col items-start justify-start relative">
                <Card className="w-[90%] bg-slate-50">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Medição manual dos valores de tensão</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                {["p1", "p2", "p3", "p4"].map((field) => (
                                    <Grid item xs={12} sm={6} md={3} key={field}>
                                        <TextField
                                            fullWidth
                                            label={field.toUpperCase()}
                                            name={field}
                                            type="number"
                                            size="small"
                                            required
                                            value={formData[field as keyof FormData] || ''}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                ))}
                                <Grid item xs={12}><Divider /></Grid>
                                <Grid item xs={12} md={6}>
                                    <Autocomplete
                                        id="stencil-autocomplete"
                                        options={stencilList || []}
                                        getOptionLabel={(option) => option.stencil_part_nbr}
                                        value={stencilSelected}
                                        onChange={handleChangeAutocomplete}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Stencils" size="small" required />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Ciclos"
                                        name="cicles"
                                        size="small"
                                        required
                                        value={formData.cicles}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        type="datetime-local"
                                        label="Data da medição"
                                        name="measurement_datetime"
                                        size="small"
                                        required
                                        value={formData.measurement_datetime || ''}
                                        onChange={handleChange}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained" color="primary">
                                        Cadastrar
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </div>
            <Snackbar open={openSnackBar} autoHideDuration={4000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={alert} sx={{ width: '100%' }}>{message}</Alert>
            </Snackbar>
        </main>
    );
}