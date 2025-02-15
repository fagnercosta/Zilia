"use client"; // Adicione esta linha no topo do arquivo para habilitar funcionalidades do cliente no Next.js

import InovaBottomImage from "@/components/InovaBottomImage";
import { SelectHistory } from "@/components/Select/SelectHistory";
import { SelectStencilItem } from "@/components/Select/SelectStencilItem";
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
    message: string;
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
    const [stencilSelected, setStencilSelected] = useState(0);
    const [resposta, setResposta] = useState<RequestRaspy>();
    const [stencils, setStencils] = useState<Stencil[]>([]);
    const [selectedStencil, setSelectedStencil] = useState<Stencil | null>(null);
    const [salvando, setSalvando] = useState(false);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [alert, setAlert] = useState<AlertColor>("success");
    const [message, setMessage] = useState('');
    const navigate = useRouter();
    const [disabledInput, setDisabledInput] = useState(false);
    const [loadingPhotos, setLoadingPhotos] = useState(false);
    const [loadingRobot, setLoadingRobot] = useState(false);

    const [menssagemRobo, setMenssagemRobo] = useState(null)

    const [inputValue, setInputValue] = useState<String>("0");

    function handleInputChange(text: String) {
        setInputValue(text);
        console.log("Input.." + text)
    }

    async function handlePosicionarRobo(){
        try {
            const responseRobo = await axios.get(`http://127.0.0.1:8000/api/position-point/`);
            console.log("Resposta Robo"+responseRobo.data.menssage)
            setMenssagemRobo(responseRobo.data.menssage)
            setMessage(menssagemRobo || "");
            setAlert("success");
            setOpenSnackBar(true);
        } catch (error) {
            
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
        stencil_id: selectedStencil ? selectedStencil.stencil_id : 0,
    });

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
                if (error.response.status === 404) {
                    setMessage('API não encontrada. Verifique o endereço.');
                } else if (error.response.status === 500) {
                    setMessage('Erro interno no servidor da API.');
                } else {
                    setMessage(`Erro da API: ${error.response.status}`);
                }
            } else if (error.request) {
                setMessage('Erro de conexão com a API. Verifique se ela está online.');
            } else {
                setMessage('Ocorreu um erro inesperado.');
            }
            setAlert("error");
            setOpenSnackBar(true);
        }
    };

    useEffect(() => {
        getStencils();
        resetForm();
    }, []);

    const resetForm = () => {
        setFormData(prev => ({
            ...prev,
            measurement_datetime: new Date(),
        }));
    };

    const handleFormStencilId = () => {
        setFormData(prev => ({
            ...prev,
            stencil_id: selectedStencil ? selectedStencil.stencil_id : 0,
        }));
    };

    const handleDisableInput = () => {
        if (formData.p1 !== null && formData.p2 !== null && formData.p3 !== null && formData.p4 !== null) {
            setDisabledInput(true);
        }
    };

    const takePhotoRaspRequest = async (stencilId: number) => {
        setResposta(undefined);
        setDisabledInput(false);

        if (selectedStencil?.stencil_id === 0 || selectedStencil === null) {
            setMessage("Selecione um stencil para realizar a medição.");
            setAlert("error");
            setOpenSnackBar(true);
        } else {
            setLoadingRobot(true);
            setMenssagemRobo(null)
            handleFormStencilId();
            try {
                const response = await axios.post(`http://127.0.0.1:8000/api/takephotraspy/${selectedStencil?.stencil_id}/`);
                if (response) {
                    setLoadingRobot(false);
                    setResposta(response.data);
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        p1: response.data.textoP1,
                        p2: response.data.textoP2,
                        p3: response.data.textoP3,
                        p4: response.data.textoP4,
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

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleChangeAutocomplete = (event: React.SyntheticEvent, value: Stencil | null) => {
        setSelectedStencil(value);
        if (value) {
            setStencilSelected(value.stencil_id);
            setFormData(prevData => ({
                ...prevData,
                stencil_id: value.stencil_id,
            }));
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (formData.cicles !== 0) {
            setSalvando(true);
            try {
                const response = await axios.post(`${BASE_URL}api/stencilTensionValues/`, formData);
                if (response) {
                    setTimeout(() => {
                        setSalvando(false);
                    }, 3000);
                    setMessage("Cadastro realizado com sucesso");
                    setAlert("success");
                    setOpenSnackBar(true);
                    navigate.push("/pages/list_stencil_medition");
                }
            } catch (error) {
                console.log(error);
                setMessage("Erro ao realizar a operação.");
                setAlert("error");
                setOpenSnackBar(true);
            }  
        }else{
            setMessage("O campo ciclos não pode estar ser igual a zero");
            setAlert("warning");
            setOpenSnackBar(true);
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
                            <Grid item xs={12} sm={12} md={12}>
                                <FormControl fullWidth>

                                    <SelectStencilItem
                                        stencils={stencils}
                                        selectedStencil={selectedStencil}
                                        setSelectedStencil={setSelectedStencil}
                                    />
                                    {/**<Autocomplete
                                            id="stencil-autocomplete"
                                            options={stencils}
                                            inputValue={String(inputValue)} // Controla o input manualmente
                                            onInputChange={(event, text) => handleInputChange(text) } // Atualiza o inputValue sempre que o usuário digitar
                                            
                                            getOptionLabel={(option) => String(option.stencil_part_nbr)}
                                            value={selectedStencil}
                                            onChange={handleChangeAutocomplete}
                                            
                                            filterOptions={(options, state) => {
                                                if (state.inputValue.length === 0){
                                                    console.log("AQUI 01");
                                                    return options;
                                                }else
                                                    console.log("AQUI 02");
                                                    //setStencils(options.filter((option) => String(option.stencil_part_nbr).toLowerCase().startsWith(state.inputValue.toLowerCase())));
                                                    return options.filter((option) => String(option.stencil_part_nbr).toLowerCase().startsWith(state.inputValue.toLowerCase()));
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Stencils"
                                                    size="small"
                                                    required
                                                />
                                            )}
                                        /> **/}

                                </FormControl>
                            </Grid>

                            <Grid container spacing={2}>
                                {/* Campos P1, P2, P3, P4 */}
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
                                        InputLabelProps={{ shrink: true }}
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
                                        InputLabelProps={{ shrink: true }}
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
                                        InputLabelProps={{ shrink: true }}
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
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12}>
                                    <Divider />
                                </Grid>

                                {/* Autocomplete para Stencils */}

                                {/* Outros campos do formulário */}
                                <Grid item xs={12} sm={12} md={6}>
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
                                <Grid item xs={12} sm={12} md={6}>
                                    <TextField
                                        fullWidth
                                        type="datetime-local"
                                        required={true}
                                        label="Data da medição"
                                        size="small"
                                        name="measurement_datetime"
                                        value={formData.measurement_datetime ? new Date(formData.measurement_datetime).toISOString().slice(0, 16) : ""}
                                        onChange={handleChange}
                                        InputLabelProps={{ shrink: true }}
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

                                {/* Botões de ação */}
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
                                        <div>
                                            <a style={{ cursor: 'pointer', padding: '10px', backgroundColor: 'rgb(100 100 250)', color: 'white', borderRadius: '5px', marginRight:'10px' }} onClick={() => handlePosicionarRobo()}> Posicionar Robô</a>
                                            <a style={{ cursor: 'pointer', padding: '10px', backgroundColor: 'rgb(96 165 250)', color: 'white', borderRadius: '5px' }} onClick={() => takePhotoRaspRequest(stencilSelected)}> Iniciar coleta de dados</a>
                                        </div>
                                    )}
                                    
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>

                {/* Exibição das imagens coletadas */}
                {resposta && (
                    <Card className="mt-4 p rounded-none w-[90%] bg-slate-50" style={{ minHeight: '400px' }}>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">Imagens coletadas</CardTitle>
                        </CardHeader>
                        <Grid container spacing={2} className="p-4" style={{ minHeight: '100%' }}>
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
                            <Grid item xs={12} sm={12} md={3}>
                                <Card className="rounded-none w-[90%] h-[100%] flex flex-col items-center justify-center">
                                    <CardHeader>
                                        <CardTitle>Ponto 4</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <img src={`http://localhost:8000/${resposta.p4}?timestamp=${new Date().getTime()}/`} width="100%" height="100%" />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Card>
                )}

                {
                    loadingRobot && (
                        <div className="mt-4 p rounded-none w-[90%]" style={{ minHeight: '400px' }}>

                            <Typography variant="h6" className="mb-4">Coletando dados...</Typography>
                            <LinearProgress color="success" style={{paddingTop: '5px', paddingBottom: '5px',     borderRadius: '5px' }}/>
                            
                        </div>
                    )
                }

                {
                    (menssagemRobo!=null && String(menssagemRobo)!="") &&(
                        <div className="mt-4 p rounded-none w-[90%]">
                                <Typography variant="h6" className="mb-4">Robo posicionado</Typography>
                        </div>
                        
                    )
                }

                {/* Snackbar para feedback */}
                <Snackbar
                    open={openSnackBar}
                    autoHideDuration={4000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert onClose={handleClose} severity={alert} sx={{ width: '100%' }}>
                        {message}
                    </Alert>
                </Snackbar>
            </div>
        </main>
    );
}