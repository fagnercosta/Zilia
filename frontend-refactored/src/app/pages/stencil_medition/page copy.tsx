"use client"
import InovaBottomImage from "@/components/InovaBottomImage";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { BASE_URL } from "@/types/api";
import { Stencil } from "@/types/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertColor, Button, Checkbox, Divider, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar, TextField } from "@mui/material";
import axios from "axios";
import { CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface FormData {
    p1: null;
    p2: null;
    p3: null;
    p4: null;
    measurement_datetime: null;
    is_registration_measurement: boolean;
    is_approved_status: boolean;
    cicles: number;
    stencil_id: number;

}

export default function StencilMedition() {

    const [stencilList, setStencilList] = useState<Stencil[] | undefined>([]);
    const [stencilSelected, setStencilSelected] = useState(0)
    
    const [openSnackBar, setOpenSnackBar] = useState(false)
    const [alert, setAlert] = useState<AlertColor>("success")
    const [message, setMessage] = useState('')
    const navigate = useRouter()

    const getStencils = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/stencil/`);
            
            if (response && response.data.results.length > 0) {
                setStencilList(response.data.results);
            } else if (!response || response.data.results.length === 0) {
                setMessage('Não há stencils cadastrados.');
                setAlert("warning");
                setOpenSnackBar(true);
            }
        } catch (error: any) {
            if (error.response) {
                // A API respondeu com um status de erro (como 404, 500, etc.)
                if (error.response.status === 404) {
                    setMessage('API não encontrada. Verifique o endereço.');
                } else if (error.response.status === 500) {
                    setMessage('Erro interno no servidor da API.');
                } else {
                    setMessage(`Erro da API: ${error.response.status}`);
                }
            } else if (error.request) {
                // A solicitação foi feita, mas nenhuma resposta foi recebida (API offline, por exemplo)
                setMessage('Erro de conexão com a API. Verifique se ela está online.');
            } else {
                // Algum outro erro ocorreu durante a configuração da solicitação
                setMessage('Ocorreu um erro inesperado.');
            }
        
            setAlert("error");
            setOpenSnackBar(true);
        }
        
    }

    useEffect(() => {
        getStencils()
    }, [])

    const [formData, setFormData] = useState<FormData>({
        p1: null,
        p2: null,
        p3: null,
        p4: null,
        measurement_datetime: null,
        is_registration_measurement: false,
        is_approved_status: false,
        cicles: 0,
        stencil_id: stencilSelected

    });

    ;


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
            const response = await axios.post(`${BASE_URL}api/stencilTensionValues/`, formData);
            if (response) {
                setMessage("Cadastro realizado com sucesso")
                setAlert("success")
                setOpenSnackBar(true)
                navigate.push("/pages/list_stencil_medition")
            }

        } catch (error) {
            console.log(error)
            setMessage("Erro ao realizar a operação.")
            setAlert("error")
            setOpenSnackBar(true)
        }
    };

    return (
        <main className="lg:ml-[23rem] p-4">
            <Sidebar />
            <div className="w-full min-h-screen mt-10 flex flex-col items-start justify-start relative">
               
                
                <Card className="w-[90%] bg-slate-50">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Medição manual dos valores de tensão</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={3}>
                                    <TextField
                                        fullWidth
                                        label="P1"
                                        name="p1"
                                        type="number"
                                        size="small"
                                        required={true}
                                        value={formData.p1}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        required={true}
                                        label="P2"
                                        name="p2"
                                        size="small"
                                        value={formData.p2}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="P3"
                                        required={true}
                                        name="p3"
                                        size="small"
                                        value={formData.p3}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        required={true}
                                        label="P4"
                                        name="p4"
                                        size="small"
                                        value={formData.p4}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12}>
                                    <Divider></Divider>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Stencils</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            name="stencil_id"
                                            label="Tipo de stencil"
                                            size="small"
                                            value={formData.stencil_id}
                                            onChange={handleChangeSelect}
                                        >
                                            {
                                                stencilList?.map((stencil, index) => {
                                                    return (
                                                        <MenuItem key={index} value={stencil.stencil_id}>
                                                            {stencil.stencil_id}
                                                        </MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>

                               

                                <Grid item xs={12} sm={12} md={6} flexShrink={'initial'}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        required={true}
                                        label="Ciclos"
                                        size="small"
                                        name="cicles"
                                        value={formData.cicles}
                                        onChange={handleChange}

                                    />
                                </Grid>

                                <Grid item xs={12} sm={12} md={6} flexShrink={'initial'}>
                                    <TextField
                                        fullWidth
                                        type="datetime-local"
                                        required={true}
                                        label="Data da medição"
                                        size="small"

                                        name="measurement_datetime"
                                        value={formData.measurement_datetime}
                                        onChange={handleChange}
                                        InputLabelProps={
                                            {
                                                shrink: true,
                                            }
                                        }

                                    />
                                </Grid>

                                
                                <Grid item xs={12} sm={12} md={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="is_approved_status"
                                                checked={formData.is_approved_status}
                                                onChange={handleChange}
                                            />
                                        }
                                        label="A medição está aprovada?"
                                    />
                                </Grid>

                                <Grid item xs={12} style={{marginTop:'20px'}}>
                                    <Button type="submit" disabled ={stencilList?.length === 0}variant="contained" color="primary">Cadastrar</Button>
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