"use client"
import InovaBottomImage from "@/components/InovaBottomImage";
import { SelectHistory } from "@/components/Select/SelectHistory";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { BASE_URL } from "@/types/api";
import { Stencil } from "@/types/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertColor, Button, Autocomplete, Checkbox, Divider, LinearProgress, CircularProgress, Typography, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar, TextField } from "@mui/material";
import axios from "axios";
import { CircleX, Link } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface FormData {
    p1: null;
    p2: null;
    p3: null;
    p4: null;
    measurement_datetime: Date | null;

    is_registration_measurement: boolean;
    is_approved_status: boolean;
    cicles: number;
    stencil_id: number;

}

interface RequestRaspy {

    message: string
    p1: string;
    p2: string;
    p3: string;
    p4: string;
    textoP1: string;
    textoP2: string;
    textoP3: string;
    textoP4: string;


}

export default function StencilAutomaticMedition() {

    const [stencilList, setStencilList] = useState<Stencil[] | undefined>([]);
    const [stencilSelected, setStencilSelected] = useState(0)
    const [resposta, setResposta] = useState<RequestRaspy>()

    const [stencils, setStencils] = useState<Stencil[]>([]);
    const [selectedStencil, setSelectedStencil] = useState<Stencil | null>(null);
    const [salvando, setSalvando] = useState(false)
    const [openSnackBar, setOpenSnackBar] = useState(false)
    const [alert, setAlert] = useState<AlertColor>("success")
    const [message, setMessage] = useState('')
    const navigate = useRouter()

    const [disabledInput, setDisabledInput] = useState(false)

    const [loadingPhotos, setLoadingPhotos] = useState(false)

    const [loadingRobot, setLoadingRobot] = useState(false)

    const getStencils = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/stencil/`);

            if (response && response.data.results.length > 0) {
                setStencilList(response.data.results);
                setStencils(response.data.results);
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
        resetForm()
    }, [])

    const resetForm = () => {
        setFormData(prev => ({
            ...prev,
            measurement_datetime: new Date() // Atualiza apenas a data
        }));
    };

    const handleDisableInput = () => {
        if (formData.p1 !== null && formData.p2 !== null && formData.p3 !== null && formData.p4 !== null) {
            setDisabledInput(true)
        }
    }

    const [formData, setFormData] = useState<FormData>({
        p1: null,
        p2: null,
        p3: null,
        p4: null,
        measurement_datetime: new Date(),

        is_registration_measurement: false,
        is_approved_status: false,
        cicles: 0,
        stencil_id: stencilSelected

    });

    const takePhotoRaspRequest = async (stencilId: number) => {
        setResposta(undefined);
        setDisabledInput(false)

        console.log("Stencil selecionado:", stencilSelected);

        if (stencilSelected === 0) {
            setMessage("Selecione um stencil para realizar a medição.");
            setAlert("error");
            setOpenSnackBar(true);

        } else {
            setLoadingRobot(true);
            try {
                const response = await axios.post(`http://127.0.0.1:8000/api/takephotraspy/${stencilSelected}/`);
                if (response) {
                    setLoadingRobot(false);
                    console.log(response.data);
                    setResposta(response.data);
                    console.log("Resposta:", resposta);

                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        p1: response.data.textoP1,
                        p2: response.data.textoP2,
                        p3: response.data.textoP3,
                        p4: response.data.textoP4 // Assume que a resposta tem um campo `p1`
                    }));


                }

                handleDisableInput();
            } catch (error) {
                console.error(error);
            }
        }


    };



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
        setStencilSelected(value as number)
        console.log("Selecinou Stencil's: " + value)
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }))
    };

    

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        console.log(formData)

        setSalvando(true)


        event.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}api/stencilTensionValues/`, formData);
            if (response) {
                setTimeout(() => {
                    setSalvando(false)
                }, 3000)


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
                        <CardTitle className="text-2xl font-bold">Medição Automática dos valores de tensão</CardTitle>
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
                                        disabled={disabledInput}
                                        required={true}
                                        value={formData.p1}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true, // Faz com que o label sempre fique em cima, mesmo quando o campo estiver vazio
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        required={true}
                                        label="P2"
                                        name="p2"
                                        disabled={disabledInput}
                                        size="small"
                                        value={formData.p2}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true, // Faz com que o label sempre fique em cima, mesmo quando o campo estiver vazio
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="P3"
                                        required={true}
                                        disabled={disabledInput}
                                        name="p3"
                                        size="small"
                                        value={formData.p3}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true, // Faz com que o label sempre fique em cima, mesmo quando o campo estiver vazio
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        required={true}
                                        label="P4"
                                        name="p4"
                                        disabled={disabledInput}
                                        size="small"
                                        value={formData.p4}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true, // Faz com que o label sempre fique em cima, mesmo quando o campo estiver vazio
                                        }}
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
                                        value={formData.measurement_datetime ? new Date(formData.measurement_datetime).toISOString().slice(0, 16) : ""}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
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

                                <Grid item xs={12} sm={12} md={12} style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between', marginTop: '20px' }}>
                                    {!salvando && (
                                        <Button type="submit" disabled={stencilList?.length === 0 || !resposta} variant="contained" color="primary">Cadastrar</Button>
                                    )}

                                    {salvando && (
                                        <div>
                                            <CircularProgress color="primary" style={{ width: '4%', paddingRight: '2px' }} />
                                            <Typography variant="h6" marginBottom='10px' color="textSecondary" align="center" gutterBottom>
                                                Salvando dados....
                                            </Typography>
                                        </div>
                                    )}
                                    {!loadingRobot && (
                                        <a style={{ cursor: 'pointer', padding: '10px', backgroundColor: 'rgb(96 165 250)', color: 'white', borderRadius: '5px' }} onClick={() => takePhotoRaspRequest(stencilSelected)}> Iniciar coleta de dados</a>
                                    )}

                                    {loadingRobot && (
                                        <Typography variant="body2" style={{ color: '#FFF', marginRight: '20px', fontSize: '16px', backgroundColor: 'rgb(196, 125, 67)', padding: '10px', paddingRight: '20px', borderRadius: '5px' }} fontWeight={700} align="center" gutterBottom>Aguarde o processamento...</Typography>
                                    )}

                                </Grid>

                            </Grid>
                        </form>
                    </CardContent>
                </Card>

                {loadingRobot && (

                    <Card className="mt-4 p p-6  w-[90%] bg-slate-50 rounded">
                        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

                            <CircularProgress color="primary" style={{ width: '4%', paddingRight: '2px' }} />
                            <Typography variant="h6" marginBottom='10px' color="textSecondary" align="center" gutterBottom>
                                Coletando dados...
                            </Typography>

                        </div>
                    </Card>



                )
                }

                {
                    resposta && (
                        <Card className="mt-4 p rounded-none w-[90%]  bg-slate-50" style={{ minHeight: '400px' }}>
                            <CardHeader className="">
                                <CardTitle className="text-2xl font-bold align-baseline">Imagens coletadas</CardTitle>
                            </CardHeader>
                            <Grid container spacing={2} className="p-4 " style={{ minHeight: '100%' }}>
                                <Grid item xs={12} sm={12} md={3}>
                                    <Card className="p rounded-none w-[90%] bg-slate-50">
                                        <CardHeader>
                                            <CardTitle>Ponto 1</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <img src={`http://localhost:8000/${resposta.p1}?timestamp=${new Date().getTime()}`} width="100%" height="100%" />
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={12} md={3}>
                                    <Card className="p rounded-none w-[90%] bg-slate-50">
                                        <CardHeader>
                                            <CardTitle>Ponto 2</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <img src={`http://localhost:8000/${resposta.p2}?timestamp=${new Date().getTime()}/`} width="100%" height="100%" />
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} sm={12} md={3}>
                                    <Card className="p rounded-none w-[90%] bg-slate-50">
                                        <CardHeader>
                                            <CardTitle>Ponto 3</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <img src={`http://localhost:8000/${resposta.p3}?timestamp=${new Date().getTime()}/`} width="100%" height="100%" />
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} sm={12} md={3} >
                                    <Card className=" rounded-none w-[90%] h-[100%] flex flex-col items-center justify-center">
                                        <CardHeader className="">
                                            <CardTitle className="">Ponto 4</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <img src={`http://localhost:8000/${resposta.p4}?timestamp=${new Date().getTime()}/`} width="100%" height="100%" />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Card>
                    )
                }
            </div>
            <Snackbar
                open={openSnackBar}
                autoHideDuration={4000}
                action={action}
                onClose={handleClose}
                message={message}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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