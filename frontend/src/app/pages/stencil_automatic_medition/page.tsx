"use client";

import AlertItem from "@/components/AlertItem";
import InovaBottomImage from "@/components/InovaBottomImage";
import ProgressoTension from "@/components/ProgressoTension";
import { SelectHistory } from "@/components/Select/SelectHistory";
import { SelectStencilItem } from "@/components/Select/SelectStencilItem";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { BASE_URL } from "@/types/api";
import { Stencil } from "@/types/models";
import { ConfigurationsModel } from "@/types/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertColor, Button, Autocomplete, Checkbox, Divider, LinearProgress, CircularProgress, Typography, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar, TextField, AlertProps } from "@mui/material";
import axios from "axios";
import { set } from "date-fns";
import { CircleX, Link } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface FormData {
    p1: number | string | null;
    p2: number | string | null;
    p3: number | string | null;
    p4: number | string | null;
    measurement_datetime: Date | null;
    is_registration_measurement: boolean;
    is_pending_measurement: boolean;
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
    const [title, setTitle] = useState<string>("Success");
    const [message, setMessage] = useState('');
    const navigate = useRouter();
    const [disabledInput, setDisabledInput] = useState(false);
    const [loadingPhotos, setLoadingPhotos] = useState(false);
    const [loadingRobot, setLoadingRobot] = useState(false);
    const [menssagemRobo, setMenssagemRobo] = useState("");
    const [positionRobo, setPositionRobo] = useState(false);
    const [inputValue, setInputValue] = useState<String>("0");
    const [viewAltert, setViewAltert] = useState(false);
    const [lendo, setLendo] = useState(false);
    const [carregadoCiclos, setCarregadoCiclos] = useState(false);

    const [active_status, setActiceStatus] = useState(true);
    const [active_pending, setActivePending] = useState(true);

    const [limits, setLimits] = useState({
            minLimitTension: 0,
            maxLimitTension: 0,
            scratchesValue: 0
        })

    const checkApprovalStatus = (p1: number | string | null, p2: number | string | null, p3: number | string | null, p4: number | string | null) => {
        const p1Num = p1 !== null ? Number(p1) : null;
        const p2Num = p2 !== null ? Number(p2) : null;
        const p3Num = p3 !== null ? Number(p3) : null;
        const p4Num = p4 !== null ? Number(p4) : null;

        console.log("LIMITES:", limits)
        
        let retorno= true;
        if (p1Num !== null && p1Num < limits.minLimitTension){
            retorno = false;
        }

        if (p2Num !== null && p2Num < limits.minLimitTension){
            retorno = false;
        }

        if (p3Num !== null && p3Num < limits.minLimitTension){
            retorno = false;
        }

        if (p4Num !== null && p4Num < limits.minLimitTension){
            retorno = false;
        }

        if(retorno){
            setActiceStatus(false);
        }
        return retorno;
            
    };

    const checkApprovalStatusAll = (p1: number | string | null, p2: number | string | null, p3: number | string | null, p4: number | string | null) => {
        const p1Num = p1 !== null ? Number(p1) : null;
        const p2Num = p2 !== null ? Number(p2) : null;
        const p3Num = p3 !== null ? Number(p3) : null;
        const p4Num = p4 !== null ? Number(p4) : null;
        
        let retorno= false;
        if (p1Num !== null && p1Num < limits.minLimitTension){
            retorno = true;
        }

        if (p2Num !== null && p2Num < limits.minLimitTension){
            retorno = true;
        }

        if (p3Num !== null && p3Num < limits.minLimitTension){
            retorno = true;
        }

        if (p4Num !== null && p4Num < limits.minLimitTension){
            retorno = true;
        }

        if(retorno){
            setActivePending(false)
        }

        return retorno;
            
    };

    function handleInputChange(text: String) {
        setInputValue(text);
        console.log("Input.." + text);
    }

    async function handlePosicionarRobo() {
        setLendo(false);
        setResposta(undefined);
        setLoadingRobot(false);
        
        setTimeout(() => {
            setPositionRobo(true);
            setViewAltert(false);
        }, 10);
        
        try {
            let responseRobo = await axios.get(`http://127.0.0.1:8000/api/position-point/`);
            responseRobo = await axios.get(`http://127.0.0.1:8000/api/position-point/`);
            console.log("Resposta Robo"+responseRobo.data.menssage);
            setMenssagemRobo(responseRobo.data.menssage);
            let messagemText = `${menssagemRobo}. Agora coloque o CLP no modo manual, abra a porta, ligue o tensiometro, feche a porta e coloque o o CPL no automaático e inicie a medição `;
            
            if (menssagemRobo.length < 5) {
                setMenssagemRobo("Robo posicionado");
            }

            messagemText = `Robo posicionado. Agora coloque o CLP no modo manual, abra a porta, ligue o tensiometro, feche a porta e coloque o o CPL no automaático e inicie a medição `;

            setMessage(messagemText || "");
            setAlert("success");
            setViewAltert(true);
            setPositionRobo(false);
        } catch (error: any) {
            if (error.response) {
                if (error.response.status === 500) {
                    setMessage("Problema na comunicação com o robo. Sugestão: resetar o CLP.");
                    setAlert("error");
                    setTitle("Error");
                } else {
                    setMessage(`Erro ${error.response.status}: ${error.response.data?.message || "Erro desconhecido"}`);
                }
            } else if (error.request) {
                setMessage("Erro na comunicação com o servidor");
            } else {
                setMessage("Erro inesperado ao buscar os dados");
            }
            
            setAlert("error");
            setViewAltert(true);
            setPositionRobo(false);
        }
    }

    const [formData, setFormData] = useState<FormData>({
        p1: null,
        p2: null,
        p3: null,
        p4: null,
        measurement_datetime: new Date(new Date().getTime() - 4 * 60 * 60 * 1000),
        is_registration_measurement: false,
        is_pending_measurement: false,
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
            setViewAltert(true);
        }
    };

    const getParams = async () => {
        const response = await axios.get(`${BASE_URL}api/parameters-tension/`)
        if (response.data.results.length > 0) {
            const firstResult = response.data.results[0];

            const dados = {
                    minLimitTension: firstResult.min_value,
                    maxLimitTension: firstResult.max_value,
                    scratchesValue: firstResult.scratch_value,
            };
            console.log("DADOS:>",dados)
            setLimits(dados);
        }
                
    }

    const resetFormExceptDate = () => {
        setFormData(prev => ({
          p1: "",
          p2: "",
          p3: "",
          p4: "",
          measurement_datetime: new Date(new Date().getTime() - 4 * 60 * 60 * 1000), // Mantém a data atual
          is_registration_measurement: false,
          is_pending_measurement: false,
          is_approved_status: false,
          cicles: 0,
          stencil_id: selectedStencil ? selectedStencil.stencil_id : 0,
        }));
        
        setResposta(undefined);
        setDisabledInput(false);
        setActiceStatus(true);
        setActivePending(true);
      };

    useEffect(() => {
        getStencils();
        getParams()
        resetForm();
    }, []);

    const resetForm = () => {
        setFormData(prev => ({
            ...prev,
            measurement_datetime: new Date(new Date().getTime() - 4 * 60 * 60 * 1000),
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
        resetFormExceptDate();
        setResposta(undefined);
        setDisabledInput(false);
        setViewAltert(false);
        setLendo(false);
        setLoadingRobot(false);

        if (selectedStencil?.stencil_id === 0 || selectedStencil?.stencil_id === undefined) {
            setMessage("Selecione um stencil para realizar a medição.");
            setAlert("warning");
            setViewAltert(true);
        } else {
            setTimeout(() => {
                setLendo(true);
                setLoadingRobot(true);
            }, 100);
            setMenssagemRobo("");
            handleFormStencilId();
            
            try {
                const response = await axios.post(`http://127.0.0.1:8000/api/takephotraspy/${selectedStencil?.stencil_id}/`);
                if (response) {
                    setLoadingRobot(false);
                    setResposta(response.data);
                    fetchLatestMeasurement(selectedStencil?.stencil_id);
                    
                    setFormData((prevFormData) => {
                        const newFormData = {
                            ...prevFormData,
                            p1: response.data.textoP1,
                            p2: response.data.textoP2,
                            p3: response.data.textoP3,
                            p4: response.data.textoP4,
                        };
                        
                        const shouldApprove = checkApprovalStatus(
                            newFormData.p1,
                            newFormData.p2,
                            newFormData.p3,
                            newFormData.p4
                        );

                        const shouldApproveAll = checkApprovalStatusAll(
                            newFormData.p1,
                            newFormData.p2,
                            newFormData.p3,
                            newFormData.p4
                        )
                        
                        return {
                            ...newFormData,
                            is_approved_status: shouldApprove,
                            is_pending_measurement: shouldApproveAll
                        };
                    });
                }
                handleDisableInput();
            } catch (error) {
                setMessage("Erro ao realizar a operação. Não foi possível se conectar com o robo. Tente Novamente");
                setLendo(false);
                setLoadingRobot(false);
                setAlert("error");
                setViewAltert(true);
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
        
        const newFormData = {
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        };
        
        // Verifica se algum ponto é menor que 30 e atualiza o is_approved_status
        const shouldApprove = checkApprovalStatus(
            newFormData.p1,
            newFormData.p2,
            newFormData.p3,
            newFormData.p4
        );
        
        setFormData({
            ...newFormData,
            is_approved_status: shouldApprove || newFormData.is_approved_status
        });
    };

    const fetchLatestMeasurement = async (stencilId: number) => {
        console.log(`Buscando ciclos para stencil ${stencilId}`);
        setCarregadoCiclos(true)
        
        try {
            const url = `${BASE_URL}/stencil-tension/latest/${stencilId}/`;
            console.log(`URL da requisição: ${url}`);
            
            const response = await axios.get(url);
            console.log("Resposta da API:", response.data);
            
            const lastCicles = response.data?.cicles || 0;
            console.log(`Últimos ciclos: ${lastCicles}, Novo valor: ${lastCicles + 1}`);
            
            setFormData(prev => ({
                ...prev,
                cicles: lastCicles + 1
            
            }));
        } catch (error) {
           
            console.error("Erro detalhado:", error);
            setFormData(prev => ({
                ...prev,
                cicles: 1,
               
            }));
        } finally {

            setTimeout(() => {
                setCarregadoCiclos(false);
            },2000)
            //setCarregadoCiclos(false); //
        }
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
                    setMessage("Medição de tensão cadastrada com sucesso!");
                    setAlert("success");
                    setOpenSnackBar(true);
                    resetFormExceptDate();
                    
                    //navigate.push("/pages/stencil_automatic_medition");
                }
            } catch (error) {
                console.log(error);
                setMessage("Erro ao realizar a operação.");
                setAlert("error");
                setOpenSnackBar(true);
            }  
        } else {
            setMessage("O campo ciclos não pode estar ser igual a zero");
            setAlert("warning");
            setOpenSnackBar(true);
        }
    };

    return (
        <main className="lg:ml-[23rem] p-4">
            <Sidebar />
            
            <div className="w-full min-h-screen mt-10 flex flex-col items-start justify-start relative">
                
                {viewAltert && (             
                    <div className="w-[90%] mb-4 ">
                        <AlertItem severity={alert} message={message} title={title} />
                    </div>
                )}
                
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
                                </FormControl>
                            </Grid>

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
                                        disabled={true}
                                        
                                    />
                                    {carregadoCiclos &&(
                                        <div> 
                                            <Typography variant="h6">Carregando ciclos...</Typography>
                                            <LinearProgress color="info" />
                                        </div>
                                    )}
                                    
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
                                                disabled={active_status}
                                            />
                                        }
                                        label="A medição Aprovada"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={12} md={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="is_approved_status"
                                                checked={formData.is_pending_measurement}
                                                onChange={handleChange}
                                                disabled={active_pending}
                                            />
                                        }
                                        label="Pendente"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={12} md={12} style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between', marginTop: '20px' }}>
                                    {!salvando &&  (
                                        <Button type="submit" disabled={stencilList?.length === 0 || !resposta || carregadoCiclos } variant="contained" color="primary">Cadastrar</Button>
                                    )}
                                    {salvando && (
                                        <div>
                                            <LinearProgress color="primary" style={{ width: '100%', paddingRight: '2px' }} />
                                            <Typography variant="h6" marginBottom='10px' color="textSecondary" align="center" gutterBottom>
                                                Salvando dados....
                                            </Typography>
                                        </div>
                                    )}
                                    {!loadingRobot && (
                                        <div>
                                            <a style={{ cursor: 'pointer', padding: '10px', backgroundColor: 'rgb(96 165 250)', color: 'white', borderRadius: '5px' }} onClick={() => takePhotoRaspRequest(stencilSelected)}> Iniciar coleta de dados</a>
                                        </div>
                                    )}
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>

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

                {loadingRobot && (
                    <div className="mt-4 p rounded-none w-[90%]" style={{ minHeight: '30px' }}>
                        <Typography variant="h6" className="mb-4">Coletando dados...</Typography>
                        <LinearProgress color="success" style={{paddingTop: '5px', paddingBottom: '5px', borderRadius: '5px' }}/>
                    </div>
                )}

                {(loadingRobot || lendo) && (
                    <div className="mt-4 p rounded-none w-[90%]" style={{ minHeight: '400px', marginTop:'30px', marginLeft:'10px' }}>
                        <ProgressoTension/>
                    </div>
                )}

                {positionRobo && (
                    <div className="mt-4 p rounded-none w-[90%]" style={{ minHeight: '400px' }}>
                        <Typography variant="h6" className="mb-4">Posicionando o robo. Aguarde, ao posicionar o robo corretamente, você deve ligar o tenciometro...</Typography>
                        <LinearProgress color="error" style={{paddingTop: '5px', paddingBottom: '5px', borderRadius: '5px' }}/>
                    </div>
                )}

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