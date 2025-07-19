"use client";

import Sidebar from "@/components/Sidebar";
import React, { use, useCallback, useEffect, useState } from "react";
import cookie from "cookie"
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label"
import { DatePickerDemo } from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { BASE_URL } from "@/types/api";
import { getRGBFromDate } from "@/functions/functions";
import InovaBottomImage from "@/components/InovaBottomImage";
import { TextField } from "@mui/material";
import SnackBarControl from "@/components/SnackBarControl";
import { AlertColor, Divider } from "@mui/material";
import { ConfigurationsModel, SnackControl } from "@/types/utils";
import { boolean } from "zod";

import { CircularProgress, Snackbar, Alert, IconButton } from "@mui/material";
import { CircleX } from "lucide-react";
import AlertItem from "@/components/AlertItem";
import { useTranslation } from 'react-i18next';

export default function Configurations() {
    const { t } = useTranslation(['configuration', 'common']);

    const [alert, setAlert] = useState<AlertColor>("success");
    const [title, setTitle] = useState<string>("Success");
    const [message, setMessage] = useState('');
    const [viewAltert, setViewAltert] = useState(false);

    const router = useRouter()
    const [date, setDate] = useState<Date>()
    const [lengthResponse, setLengthResponse] = useState<any[]>([])
    const [snackControl, setSnackControl] = useState<SnackControl>({
        alert: "success",
        message: "",
        openSnackBar: false
    })

    const [salvoParams, setSalvoParms] = useState(false)

    const [limits, setLimits] = useState<ConfigurationsModel>({
        minLimitTension: "",
        maxLimitTension: "",
        scratchesValue: ""
    })


    const changeMaxScratches = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLimits({ ...limits, scratchesValue: e.target.value })
    }

    const changeMaxLimitTension = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLimits({ ...limits, maxLimitTension: e.target.value })
        console.log(limits.maxLimitTension)
    }

    const changeLimitTension = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLimits({ ...limits, minLimitTension: e.target.value })
    }

    const [sincronizando, setSincronizando] = useState<boolean>(false)
    const [mensagemSicronizacao, setMensagemSincronizacao] = useState<String>("");
    const [messageInfo, setMessageInfo] = useState<String>("");
    const [retorno, setRetorno] = useState(null);
    const [openSnackBar, setOpenSnackBar] = useState(false)
    const [typeMessage, setTypeMessage] = useState<AlertColor>("success")
    const [disableButtonSinc, setDisableButtonSinc] = useState<boolean>(false);

    const verifyData = async () => {
        try {
            const response = await axios.get(`${BASE_URL}api/parameters-tension/`)
            if (response.data.results.length > 0) {
                const firstResult = response.data.results[0];

                const dados = {
                    minLimitTension: firstResult.min_value.toString(),
                    maxLimitTension: firstResult.max_value.toString(),
                    scratchesValue: firstResult.scratch_value.toString(),
                };

                setLimits(dados);
                setDate(new Date()); // Ajuste a data conforme necessário

                console.log("Dados carregados:", dados);
            } else {
                setDate(new Date())
            }
        } catch (error: any) {
            if (error.code === "ERR_NETWORK") {
                setSnackControl({
                    openSnackBar: true,
                    alert: "error",
                    message: t('configuration:settings.apiError')
                })
            }
            console.log(error)
        }
    }

    const handleSaveParams = async () => {
        setSalvoParms(false)
        try {
            const data = {
                min_value: Number(limits.minLimitTension),
                max_value: Number(limits.maxLimitTension),
                scratch_value: Number(limits.scratchesValue)
            }
            const response = await axios.post(`${BASE_URL}api/parameters-tension/`, data)
            if (response) {
                console.log(response)
                setSalvoParms(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        verifyData()
    }, [])

    const handleLogout = useCallback(() => {
        // Remover o cookie definindo uma data de expiração no passado
        document.cookie = cookie.serialize('authToken', '', {
            httpOnly: false, // No lado do cliente, httpOnly deve ser false
            secure: process.env.NODE_ENV !== 'development',
            maxAge: -1, // Expira imediatamente
            path: '/',
        });

        localStorage.removeItem("token");
        localStorage.removeItem("tokenTimestamp");

        // Redireciona para a página de login
        router.push('/pages/login');
    }, [router]);


    const handleLamp = async (event: boolean) => {
        let message = event ? "true" : "false"
        try {
            const response = await axios.get(`${BASE_URL}api/changeLamp/${message}/`)
            if (response) {
                console.log(response)
            }
        } catch (error) {
            console.log(error)
        }
    }

    var rota = ""
    const handleSincrozizeDataWiptrack = async () => {
        setViewAltert(false)
        try {
            setSincronizando(true);
            setMensagemSincronizacao(t('configuration:settings.processingSynchronization'))
            setDisableButtonSinc(true)

            rota = `${BASE_URL}sinck_data_stencil/`;
            const response = await axios.get(`${BASE_URL}api/sinck_data_stencil/`)

            if (response.status === 500) {
                console.error("Erro ao sincronizar"); // console.error é melhor para erros
                setSincronizando(false);
                setDisableButtonSinc(false); // Corrigido o nome se necessário
                setAlert("error"); // Adicionado para consistência
                setViewAltert(true); // Corrigido o nome se necessário
                setMessage(t('configuration:settings.syncError500'));
            } else {
                console.log("Sucesso ao sincronizar");
                setSincronizando(false);
                setDisableButtonSinc(false); // Corrigido o nome se necessário
                setAlert("success");
                setViewAltert(true); // Corrigido o nome se necessário
                setMessage(t('configuration:settings.syncSuccess'));
            }

            

        } catch (erro) {
            setSincronizando(false)
            setDisableButtonSinc(false)
            setAlert("error");
            setViewAltert(true)
            setMessage(t('configuration:settings.syncError'));
        }
    }

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const handleDateDB = async (e: any) => {
        const dataNova = new Date(e);
        const formattedDate = formatDate(dataNova);
        console.log(lengthResponse)
        verifyData()

        try {
            if (lengthResponse.length > 0) {
                const data = {
                    id: lengthResponse[lengthResponse.length - 1].id,
                    date_to_review: formattedDate
                }
                const response = await axios.put(`${BASE_URL}api/configurations/`, data)
                if (response) {
                    setDate(new Date(response.data.date_to_review))
                    console.log(response.data.date_to_review)
                }
            } else {
                const data = {
                    date_to_review: formattedDate
                }
                const response = await axios.post(`${BASE_URL}api/configurations/`, data)
                if (response) {
                    setDate(new Date(response.data.date_to_review))
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
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

    return (
        <main className="lg:ml-[23rem] p-4">
            <Sidebar logouFunction={handleLogout} />
            <div className="w-full h-screen flex items-start justify-center relative">
                
                <div className=" h-screen flex items-center  flex-col w-[60%]">
                                {viewAltert && (             
                                    <div className="w-[100%] mb-4 ">
                                        <AlertItem severity={alert} message={message} title={title} />
                                    </div>
                                )}
                    <Card className="w-[100%] bg-slate-50">
                        <CardHeader>
                            <CardTitle className="text-2xl text-blue-400">{t('configuration:settings.title')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full flex flex-col items-start justify-start gap-5">
                                <div className="w-full flex items-center justify-start gap-2">
                                    <span className="mr-auto font-bold text-[18px]">{t('configuration:settings.preventiveMaintenanceAlert')}</span>
                                    <div style={{
                                        width: 25,
                                        height: 25,
                                        backgroundColor: getRGBFromDate(date || new Date()),
                                        borderRadius: 99
                                    }}>
                                    </div>
                                    <DatePickerDemo
                                        date={date}
                                        setDate={setDate}
                                        handleData={handleDateDB}
                                    />
                                </div>
                                <div className="w-full flex items-center justify-start">
                                    <span className="mr-auto font-bold text-[18px]">{t('configuration:settings.wipTrackConnectionTest')}</span>
                                    <Button className="bg-blue-400">
                                        {t('configuration:settings.startTest')}
                                    </Button>
                                </div>
                                <div className="w-full flex items-center justify-start">
                                    <span className="mr-auto font-bold text-[18px]">{t('configuration:settings.automaticSyncActivation')}</span>
                                    <Button
                                        className="bg-blue-400"
                                        onClick={() => handleSincrozizeDataWiptrack()}
                                        disabled={disableButtonSinc}
                                    >
                                        {t('configuration:settings.startSync')}
                                    </Button>
                                </div>
                                <div className="w-full ">
                                    <Divider />
                                </div>
                                <div className="w-full flex items-center justify-start">
                                    <span className="mr-auto font-bold text-[18px]">Lâmpadas da máquina:</span>
                                    <Switch
                                        onCheckedChange={(e) => handleLamp(e)}
                                        color="green"
                                    />
                                </div>

                                <div className="w-full ">
                                    <Divider />
                                </div>

                                <div className="w-full flex items-center justify-start">
                                    <span className="mr-auto font-bold text-[18px]">Limite de tensão:</span>
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-[18px]">Min:</span>
                                        <TextField
                                            onChange={changeLimitTension}
                                            value={limits.minLimitTension}
                                            size="small"
                                            type="number"
                                            sx={{ width: 80 }}
                                        />
                                        <span className="font-bold text-[18px]">Máx:</span>
                                        <TextField
                                            onChange={changeMaxLimitTension}
                                            value={limits.maxLimitTension}
                                            size="small"
                                            type="number"
                                            sx={{ width: 80 }}
                                        />
                                    </div>
                                </div>
                                <div className="w-full flex items-center justify-start">
                                    <span className="mr-auto font-bold text-[18px]">Limite de arranhões:</span>
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-[18px]">{t('configuration:settings.max')}</span>
                                        <TextField
                                            onChange={changeMaxScratches}
                                            value={limits.scratchesValue}
                                            size="small"
                                            type="number"
                                            sx={{ width: 80 }}
                                        />
                                    </div>
                                </div>

                                <div className="w-full flex items-center justify-between">
                                    <div></div>
                                    <div>
                                        <Button
                                            className="bg-blue-400"
                                            onClick={() => handleSaveParams()}
                                        >
                                            Salvar Parametros
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <SnackBarControl
                        alert={snackControl.alert}
                        handleClose={() => setSnackControl({ ...snackControl, openSnackBar: false })}
                        messageSnack={snackControl.message}
                        openSnackBar={snackControl.openSnackBar}
                    />

                    <div className="w-[60%] mt-10">
                        {sincronizando ?
                            <div className="flex flex-col items-center w-[100%]">
                                <CircularProgress color="primary" size={30} />
                                <Label className="mt-3 text-green-900 size-10 w-full text-center">
                                    {mensagemSicronizacao}
                                </Label>
                            </div>
                            : <></>
                        }
                        {salvoParams ?
                            <AlertItem message={"Parametros Salvos Com Sucesso!"} title={"success"} />
                            : <></>
                        }
                    </div>
                </div>
            </div>
        </main>
    )
}