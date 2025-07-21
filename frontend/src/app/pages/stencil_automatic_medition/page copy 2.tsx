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
import {
    Alert,
    AlertColor,
    Button,
    Autocomplete,
    Checkbox,
    Divider,
    LinearProgress,
    CircularProgress,
    Typography,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Snackbar,
    TextField,
    AlertProps,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";
import axios from "axios";
import { set } from "date-fns";
import { CircleX, Link } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslation } from 'react-i18next';

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
    path_p1: string | null;
    path_p2: string | null;
    path_p3: string | null;
    path_p4: string | null;
    responsable: string | null;
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
    path_p1: string;
    path_p2: string;
    path_p3: string;
    path_p4: string;
}

export default function StencilAutomaticMedition() {
    const { t } = useTranslation(['automatic', 'common']);
    // Estados principais
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
    const [disabledInput, setDisabledInput] = useState(true);
    const [loadingPhotos, setLoadingPhotos] = useState(false);
    const [loadingRobot, setLoadingRobot] = useState(false);
    const [menssagemRobo, setMenssagemRobo] = useState("");
    const [positionRobo, setPositionRobo] = useState(false);
    const [inputValue, setInputValue] = useState<String>("0");
    const [viewAltert, setViewAltert] = useState(false);
    const [lendo, setLendo] = useState(false);
    const [carregadoCiclos, setCarregadoCiclos] = useState(false);
    const [nomeResponsavel, setNomeResponsavel] = useState('');
    const [active_status, setActiceStatus] = useState(true);
    const [active_pending, setActivePending] = useState(true);
    const [limits, setLimits] = useState({
        minLimitTension: 0,
        maxLimitTension: 0,
        scratchesValue: 0
    });

    // Estados para o diálogo de confirmação
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [formDataToSubmit, setFormDataToSubmit] = useState<FormData | null>(null);

    // Estado do formulário
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
        path_p1: null,
        path_p2: null,
        path_p3: null,
        path_p4: null,
        responsable: localStorage.getItem("first_name") + " " + localStorage.getItem("last_name"),
    });

    // Monitorar abertura do diálogo para debug
    useEffect(() => {
        console.log("Estado do diálogo alterado:", openConfirmDialog);
        console.log("Dados para submissão:", formDataToSubmit);
    }, [openConfirmDialog, formDataToSubmit]);

    // Funções de validação
    const checkApprovalStatus = (p1: number | string | null, p2: number | string | null, p3: number | string | null, p4: number | string | null) => {
        const p1Num = p1 !== null ? Number(p1) : null;
        const p2Num = p2 !== null ? Number(p2) : null;
        const p3Num = p3 !== null ? Number(p3) : null;
        const p4Num = p4 !== null ? Number(p4) : null;

        let retorno = true;
        if (p1Num !== null && p1Num < limits.minLimitTension) {
            retorno = false;
        }
        if (p2Num !== null && p2Num < limits.minLimitTension) {
            retorno = false;
        }
        if (p3Num !== null && p3Num < limits.minLimitTension) {
            retorno = false;
        }
        if (p4Num !== null && p4Num < limits.minLimitTension) {
            retorno = false;
        }

        if (retorno) {
            setActiceStatus(false);
            setActivePending(false);
        }
        return retorno;
    };

    const checkApprovalStatusAll = (p1: number | string | null, p2: number | string | null, p3: number | string | null, p4: number | string | null) => {
        const p1Num = p1 !== null ? Number(p1) : null;
        const p2Num = p2 !== null ? Number(p2) : null;
        const p3Num = p3 !== null ? Number(p3) : null;
        const p4Num = p4 !== null ? Number(p4) : null;

        let retorno = false;
        if (p1Num !== null && p1Num < limits.minLimitTension) {
            retorno = true;
        }
        if (p2Num !== null && p2Num < limits.minLimitTension) {
            retorno = true;
        }
        if (p3Num !== null && p3Num < limits.minLimitTension) {
            retorno = true;
        }
        if (p4Num !== null && p4Num < limits.minLimitTension) {
            retorno = true;
        }

        if (retorno) {
            setActivePending(false);
        }
        return retorno;
    };

    // Funções de manipulação de dados
    const handleDecimalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        // Remove tudo que não for dígito ou separador válido
        let filteredValue = value.replace(/[^0-9,.]/g, '');
        
        // Auto-insere o separador após 2 dígitos
        if (/^\d{3}$/.test(filteredValue)) {
            filteredValue = filteredValue.slice(0, 2) + '.' + filteredValue.slice(2);
        }
        
        // Garante o formato final XX.X
        if (filteredValue === '' || 
            /^\d{0,2}$/.test(filteredValue) || 
            /^\d{2}[,.]$/.test(filteredValue) || 
            /^\d{2}[,.]\d{0,1}$/.test(filteredValue)) {
            
            const newFormData = {
                ...formData,
                [name]: filteredValue.replace(',', '.')
            };
    
            // Verifica se todos os campos P estão preenchidos
            const allPFieldsFilled = 
                newFormData.p1 && newFormData.p1.toString().length > 0 &&
                newFormData.p2 && newFormData.p2.toString().length > 0 &&
                newFormData.p3 && newFormData.p3.toString().length > 0 &&
                newFormData.p4 && newFormData.p4.toString().length > 0;
    
            if (allPFieldsFilled) {
                const shouldApprove = checkApprovalStatus(
                    newFormData.p1,
                    newFormData.p2,
                    newFormData.p3,
                    newFormData.p4
                );
                
                setFormData({
                    ...newFormData,
                    is_approved_status: shouldApprove
                });
            } else {
                setFormData(newFormData);
            }
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;
    
        // Tratamento especial para o campo p1 (com validação decimal)
        if (name === 'p1') {
            const digitsAndDecimal = value
                .replace(/[^\d.]/g, '') // Remove tudo exceto dígitos e pontos
                .replace(/(\..*)\./g, '$1'); // Permite apenas um ponto
    
            // Valida o formato XX.X durante a digitação
            let formattedValue = digitsAndDecimal;
            if (/^\d{3,}$/.test(digitsAndDecimal)) {
                formattedValue = `${digitsAndDecimal.slice(0, 2)}.${digitsAndDecimal.slice(2, 3)}`;
            }
    
            const newFormData = {
                ...formData,
                [name]: formattedValue
            };
    
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
        } else {
            // Mantém o tratamento original para outros campos
            const newFormData = {
                ...formData,
                [name]: type === 'checkbox' ? checked : value,
            };
    
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
        }
    };

    // Funções de API
    const getStencils = async () => {
        try {
            const response = await axios.get(`${BASE_URL}api/stencil/`);
            if (response && response.data.results.length > 0) {
                setStencilList(response.data.results);
                setStencils(response.data.results);
            } else if (!response || response.data.results.length === 0) {
                setMessage(t('automatic:tension.noStencils'));
                setAlert("warning");
            }
        } catch (error: any) {
            handleApiError(error);
        }
    };

    const getParams = async () => {
        try {
            const response = await axios.get(`${BASE_URL}api/parameters-tension/`);
            if (response.data.results.length > 0) {
                const firstResult = response.data.results[0];
                setLimits({
                    minLimitTension: firstResult.min_value,
                    maxLimitTension: firstResult.max_value,
                    scratchesValue: firstResult.scratch_value,
                });
            }
        } catch (error) {
            console.error("Erro ao buscar parâmetros:", error);
        }
    };

    const fetchLatestMeasurement = async (stencilId: number) => {
        setCarregadoCiclos(true);
        try {
            const url = `${BASE_URL}/stencil-tension/latest/${stencilId}/`;
            const response = await axios.get(url);
            const lastCicles = response.data?.cicles || 0;
            setFormData(prev => ({
                ...prev,
                cicles: lastCicles + 1
            }));
        } catch (error) {
            console.error("Erro ao buscar ciclos:", error);
            setFormData(prev => ({
                ...prev,
                cicles: 1,
            }));
        } finally {
            setTimeout(() => {
                setCarregadoCiclos(false);
            }, 2000);
        }
    };

    // Funções de manipulação do formulário
    const resetFormExceptDate = () => {
        setFormData({
            p1: "",
            p2: "",
            p3: "",
            p4: "",
            path_p1: null,
            path_p2: null,
            path_p3: null,
            path_p4: null,
            measurement_datetime: new Date(new Date().getTime() - 4 * 60 * 60 * 1000),
            is_registration_measurement: false,
            is_pending_measurement: false,
            is_approved_status: false,
            cicles: 0,
            stencil_id: selectedStencil ? selectedStencil.stencil_id : 0,
            responsable: localStorage.getItem("first_name") + " " + localStorage.getItem("last_name"),
        });
        setResposta(undefined);
        setDisabledInput(false);
        setActiceStatus(true);
        setActivePending(true);
    };

    const resetForm = () => {
        setFormData(prev => ({
            ...prev,
            measurement_datetime: new Date(new Date().getTime() - 4 * 60 * 60 * 1000),
            responsable: localStorage.getItem("first_name") + " " + localStorage.getItem("last_name"),
        }));
    };

    const handleFormStencilId = () => {
        setFormData(prev => ({
            ...prev,
            stencil_id: selectedStencil ? selectedStencil.stencil_id : 0,
            responsable: localStorage.getItem("first_name") + " " + localStorage.getItem("last_name"),
        }));
    };

    const handleDisableInput = () => {
        if (formData.p1 !== null && formData.p2 !== null && formData.p3 !== null && formData.p4 !== null) {
            setDisabledInput(false);
        }
    };

    // Funções de manipulação do robô
    const handlePosicionarRobo = async () => {
        setLendo(false);
        setResposta(undefined);
        setLoadingRobot(false);
        setPositionRobo(true);
        setViewAltert(false);

        try {
            const responseRobo = await axios.get(`${BASE_URL}api/position-point/`);
            setMenssagemRobo(responseRobo.data.menssage || "Robô posicionado");
            setMessage(t('automatic:tension.robotPositioned'));
            setAlert("success");
            setViewAltert(true);
            setPositionRobo(false);
        } catch (error: any) {
            handleApiError(error);
            setPositionRobo(false);
        }
    };

    const takePhotoRaspRequest = async (stencilId: number) => {
        resetFormExceptDate();
        setResposta(undefined);
        setDisabledInput(false);
        setViewAltert(false);
        setLendo(false);
        setLoadingRobot(false);

        if (!selectedStencil?.stencil_id) {
            setMessage(t('automatic:tension.selectStencil'));
            setAlert("warning");
            setViewAltert(true);
            return;
        }

        setMenssagemRobo("");
        handleFormStencilId();

        try {
            const response = await axios.post(`${BASE_URL}api/takephotraspy/${selectedStencil.stencil_id}/`);
            setLoadingRobot(false);
            setResposta(response.data);
            fetchLatestMeasurement(selectedStencil.stencil_id);

            setFormData(prev => ({
                ...prev,
                p1: null,
                p2: null,
                p3: null,
                p4: null,
                path_p1: response.data.p1,
                path_p2: response.data.p2,
                path_p3: response.data.p3,
                path_p4: response.data.p4,
                responsable: localStorage.getItem("first_name") + " " + localStorage.getItem("last_name"),
                is_approved_status: checkApprovalStatus(
                    response.data.textoP1,
                    response.data.textoP2,
                    response.data.textoP3,
                    response.data.textoP4
                ),
                is_pending_measurement: false
            }));
            handleDisableInput();
        } catch (error) {
            setMessage(t('automatic:tension.robotError'));
            setLendo(false);
            setLoadingRobot(false);
            setAlert("error");
            setViewAltert(true);
        }
    };

    // Funções de manipulação de eventos
    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setOpenSnackBar(false);
    };

    const handleChangeAutocomplete = (event: React.SyntheticEvent, value: Stencil | null) => {
        setSelectedStencil(value);
        if (value) {
            setStencilSelected(value.stencil_id);
            setFormData(prev => ({
                ...prev,
                stencil_id: value.stencil_id,
            }));
        }
    };

    // Função principal de submissão
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Validação dos campos
        if ((!formData.p1 || Number(formData.p1) <= 0) || !formData.p2 || !formData.p3 || !formData.p4 || formData.cicles === 0) {
            setMessage(t('automatic:tension.fillFields'));
            setAlert("error");
            setOpenSnackBar(true);
            return;
        }

        // Preparar dados para envio
        const fullName = localStorage.getItem("first_name") + " " + localStorage.getItem("last_name");
        const updatedFormData = {
            ...formData,
            responsable: fullName
        };

        // Atualizar estado e abrir diálogo
        setFormDataToSubmit(updatedFormData);
        setTimeout(() => setOpenConfirmDialog(true), 0);
    };

    const handleConfirmSubmit = async () => {
        if (!formDataToSubmit) return;

        setOpenConfirmDialog(false);
        setSalvando(true);

        try {
            const response = await axios.post(`${BASE_URL}api/stencilTensionValues/`, formDataToSubmit);
            if (response) {
                setMessage(t('automatic:tension.savedSuccess'));
                setAlert("success");
                resetFormExceptDate();
            }
        } catch (error) {
            console.error("Erro ao salvar:", error);
            setMessage(t('automatic:tension.operationError'));
            setAlert("error");
        } finally {
            setSalvando(false);
            setOpenSnackBar(true);
        }
    };

    // Função auxiliar para tratamento de erros
    const handleApiError = (error: any) => {
        if (error.response) {
            if (error.response.status === 500) {
                setMessage(t('automatic:tension.robotCommunicationProblem'));
            } else {
                setMessage(t('automatic:tension.errorWithStatus', { status: error.response.status, message: error.response.data?.message || t('automatic:tension.unknownError') }));
            }
        } else if (error.request) {
            setMessage(t('automatic:tension.serverError'));
        } else {
            setMessage(t('automatic:tension.unexpectedError'));
        }
        setAlert("error");
        setViewAltert(true);
    };

    // Efeitos iniciais
    useEffect(() => {
        getStencils();
        getParams();
        resetForm();
    }, []);

    return (
        <main className="lg:ml-[23rem] p-4">
            <Sidebar />

            <div className="w-full mt-10 flex flex-col items-start justify-start">

                {viewAltert && (
                    <div className="w-[100%] mb-4">
                        <AlertItem severity={alert} message={message} title={title} />
                    </div>
                )}

                <Card className="w-[100%] m-0 bg-slate-50">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">{t('automatic:tension.title')}</CardTitle>
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
                                        required
                                        value={formData.p1}
                                        onChange={handleDecimalChange}
                                        inputMode="decimal"
                                        sx={{
                                            '& input': {
                                                pattern: '^\\d{2}[,.]\\d{1}$' // Padrão XX,X
                                            }
                                        }}

                                        inputProps={{
                                            inputMode: 'decimal',
                                            maxLength: 4 // Permite até "99.9" (4 caracteres)
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        required
                                        label="P2"
                                        name="p2"
                                        disabled={disabledInput}
                                        size="small"
                                        value={formData.p2}
                                        onChange={handleDecimalChange}
                                        inputMode="decimal"
                                        sx={{
                                            '& input': {
                                                pattern: '^\\d{2}[,.]\\d{1}$' // Padrão XX,X
                                            }
                                        }}

                                        inputProps={{
                                            inputMode: 'decimal',
                                            maxLength: 4 // Permite até "99.9" (4 caracteres)
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="P3"
                                        required
                                        disabled={disabledInput}
                                        name="p3"
                                        size="small"
                                        value={formData.p3}
                                        onChange={handleDecimalChange}
                                        inputMode="decimal"
                                        sx={{
                                            '& input': {
                                                pattern: '^\\d{2}[,.]\\d{1}$' // Padrão XX,X
                                            }
                                        }}

                                        inputProps={{
                                            inputMode: 'decimal',
                                            maxLength: 4 // Permite até "99.9" (4 caracteres)
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        required
                                        label="P4"
                                        name="p4"
                                        disabled={disabledInput}
                                        size="small"
                                        value={formData.p4}
                                        onChange={handleDecimalChange}
                                        inputMode="decimal"
                                        sx={{
                                            '& input': {
                                                pattern: '^\\d{2}[,.]\\d{1}$' // Padrão XX,X
                                            }
                                        }}

                                        inputProps={{
                                            inputMode: 'decimal',
                                            maxLength: 4 // Permite até "99.9" (4 caracteres)
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12}>
                                    <Divider />
                                </Grid>

                                <Grid item xs={12} sm={12} md={6}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        required
                                        label={t('automatic:tension.cycles')}
                                        size="small"
                                        name="cicles"
                                        value={formData.cicles}
                                        onChange={handleChange}
                                        disabled
                                    />
                                    {carregadoCiclos && (
                                        <div>
                                            <Typography variant="h6">{t('automatic:tension.loading')}</Typography>
                                            <LinearProgress color="info" />
                                        </div>
                                    )}
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                    <TextField
                                        fullWidth
                                        type="datetime-local"
                                        required
                                        label={t('automatic:tension.measurementDate')}
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
                                        label={t('automatic:tension.approvedMeasurement')}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={12} md={12} style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between', marginTop: '20px' }}>
                                    {!salvando && (
                                        <Button
                                            type="submit"
                                            disabled={stencilList?.length === 0 || !resposta || carregadoCiclos}
                                            variant="contained"
                                            color="primary"
                                        >
                                            {t('automatic:tension.register')}
                                        </Button>
                                    )}
                                    {salvando && (
                                        <div>
                                            <LinearProgress color="primary" style={{ width: '100%', paddingRight: '2px' }} />
                                            <Typography variant="h6" marginBottom='10px' color="textSecondary" align="center" gutterBottom>
                                                {t('automatic:tension.savingData')}
                                            </Typography>
                                        </div>
                                    )}
                                    {!loadingRobot && (
                                        <div>
                                            <Button
                                                variant="contained"
                                                onClick={() => takePhotoRaspRequest(stencilSelected)}
                                                style={{ backgroundColor: 'rgb(96 165 250)', color: 'white' }}
                                            >
                                                {t('automatic:tension.startDataCollection')}
                                            </Button>
                                        </div>
                                    )}
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>

                {resposta && (
                    <Card className="mt-4 p rounded-none w-[100%] bg-slate-50" style={{ minHeight: '300px' }}>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">{t('automatic:tension.collectedImages')}</CardTitle>
                            <Divider />
                        </CardHeader>
                        <Grid container spacing={2} className="p-4" style={{ minHeight: '100%' }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <div>
                                    <p className="font-bold mb-2">{t('automatic:tension.point1')}</p>
                                    <img className="rounded-lg" src={`${BASE_URL}${resposta.p1}?timestamp=${new Date().getTime()}`} width="100%" height="100%" alt="Ponto 1" />
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={12} md={3}>
                                <div>
                                    <p className="font-bold mb-2">{t('automatic:tension.point2')}</p>
                                    <img className="rounded-lg" src={`${BASE_URL}${resposta.p2}?timestamp=${new Date().getTime()}/`} width="100%" height="100%" alt="Ponto 2" />
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={12} md={3}>
                                <div>
                                    <p className="font-bold mb-2">{t('automatic:tension.point3')}</p>
                                    <img className="rounded-lg" src={`${BASE_URL}${resposta.p3}?timestamp=${new Date().getTime()}/`} width="100%" height="100%" alt="Ponto 3" />
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={12} md={3}>
                                <div>
                                    <p className="font-bold mb-2">{t('automatic:tension.point4')}</p>
                                    <img className="rounded-lg" src={`${BASE_URL}${resposta.p4}?timestamp=${new Date().getTime()}/`} width="100%" height="100%" alt="Ponto 4" />
                                </div>
                            </Grid>
                        </Grid>
                    </Card>
                )}

                {loadingRobot && (
                    <div className="mt-4 p rounded-none w-[98%]" style={{ minHeight: '30px' }}>
                        <Typography variant="h6" className="mb-4">{t('automatic:tension.collectingData')}</Typography>
                        <LinearProgress color="success" style={{ paddingTop: '5px', paddingBottom: '5px', borderRadius: '5px' }} />
                    </div>
                )}

                {(loadingRobot || lendo) && resposta == undefined && (
                    <div className="mt-4 p rounded-none w-[98%]" style={{ minHeight: '400px', marginTop: '30px', marginLeft: '10px' }}>
                        <ProgressoTension />
                    </div>
                )}

                {positionRobo && (
                    <div className="mt-4 p rounded-none w-[98%]" style={{ minHeight: '400px' }}>
                        <Typography variant="h6" className="mb-4">{t('automatic:tension.positioningRobot')}</Typography>
                        <LinearProgress color="error" style={{ paddingTop: '5px', paddingBottom: '5px', borderRadius: '5px' }} />
                    </div>
                )}

                {/* Diálogo de Confirmação */}
                <Dialog
                    open={openConfirmDialog}
                    onClose={() => setOpenConfirmDialog(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth
                    maxWidth="sm"
                    style={{ zIndex: 9999 }}
                >
                    <DialogTitle id="alert-dialog-title" style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <Typography variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                            {t('automatic:tension.confirmSave')}
                        </Typography>
                    </DialogTitle>
                    <DialogContent style={{ padding: '20px', backgroundColor: '#f8fafc' }}>
                        <DialogContentText id="alert-dialog-description">
                            <Typography variant="body1" style={{ marginBottom: '15px' }}>
                                {t('automatic:tension.aboutToSave')}:
                            </Typography>

                            <Grid container spacing={2} style={{ marginBottom: '20px' }}>
                                <Grid item xs={6}>
                                    <Typography><strong>P1:</strong> {formDataToSubmit?.p1 || 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography><strong>P2:</strong> {formDataToSubmit?.p2 || 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography><strong>P3:</strong> {formDataToSubmit?.p3 || 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography><strong>P4:</strong> {formDataToSubmit?.p4 || 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography><strong>{t('automatic:tension.cycles')}:</strong> {formDataToSubmit?.cicles || '0'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography><strong>{t('automatic:tension.responsible')}:</strong> {formDataToSubmit?.responsable || t('automatic:tension.notInformed')}</Typography>
                                </Grid>
                            </Grid>

                            <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                                {t('automatic:tension.reallyWantToSave')}
                            </Typography>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '15px' }}>
                        <Button
                            onClick={() => setOpenConfirmDialog(false)}
                            color="primary"
                            variant="outlined"
                            style={{ marginRight: '10px' }}
                        >
                            {t('automatic:tension.cancel')}
                        </Button>
                        <Button
                            onClick={handleConfirmSubmit}
                            color="primary"
                            variant="contained"
                            autoFocus
                        >
                            {t('automatic:tension.confirm')}
                        </Button>
                    </DialogActions>
                </Dialog>

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