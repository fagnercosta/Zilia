"use client"
import Sidebar from "@/components/Sidebar";
import { useCallback, useEffect, useState } from "react";
import cookie from "cookie"
import { useRouter } from "next/navigation";
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlarmClock, CirclePlus, Clock10, Search, SquareActivity } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { BASE_URL } from "@/types/api";
import { Stencil } from "@/types/models";
import { Button } from "@/components/ui/button";
import { AlertColor, CircularProgress } from "@mui/material";
import InovaBottomImage from "@/components/InovaBottomImage";
import Stopwatch from "@/components/StopWatch";
import { SelectHistory } from "@/components/Select/SelectHistory";
import AlertItem from "@/components/AlertItem";
import { useTranslation } from 'react-i18next';

interface RequestRobot {
    id: number
    image_path: string
    message: string
    scratch_count: number
    stencil: number
    timestamp: string

}

export default function AutomaticMedition() {
    const { t } = useTranslation(['automatic', 'common']);



    const [alert, setAlert] = useState<AlertColor>("success");
    const [title, setTitle] = useState<string>("Success");
    const [viewAltert, setViewAltert] = useState(false);
    const [titlePage, setTitlePage] = useState(t('automatic:scratch.title'))

    const router = useRouter()
    const [stencils, setStencils] = useState<Stencil[]>([])
    const [stencilSelected, setStencilSelected] = useState<number | null>()
    const [resposta, setResposta] = useState<RequestRobot>()
    const [loadingRobot, setLoadingRobot] = useState(false)
    const [time, setTime] = useState(18000)

    const [message, setMessage] = useState(t('automatic:scratch.error'))
    const [erroRobot, setErroRobot] = useState(false)

    const [selectedStencil, setSelectedStencil] = useState<Stencil | null>(
        null
    )


    const getStencils = async () => {
        try {
            const response = await axios.get(`${BASE_URL}api/stencil/`)
            if (response) {
                setStencils(response.data.results)
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        getStencils()
    }, [])


    const takephotorequest = async () => {
        setTitlePage(t('automatic:scratch.title'))
        setResposta(undefined)
        setViewAltert(false)
        setErroRobot(false)
        setLoadingRobot(true)
        console.log(stencilSelected)
        try {
            const response = await axios.post(`${BASE_URL}api/takephoto/${selectedStencil?.stencil_id}/`)
            if (response) {
                setLoadingRobot(false)
                console.log(response.data)
                setResposta(response.data)
                setTitlePage(t('automatic:scratch.completed'))


                // setStencils(response.data)

            }
        } catch (error: any) {


            setLoadingRobot(false)
            setErroRobot(true)
        }
    }

    const handleLogout = useCallback(() => {
        // Remover o cookie definindo uma data de expiração no passado
        localStorage.removeItem("token");
        localStorage.removeItem("tokenTimestamp");

        localStorage.removeItem("first_name");
        localStorage.removeItem("last_name");
        localStorage.removeItem("email");

        document.cookie = cookie.serialize('authToken', '', {
            httpOnly: false, // No lado do cliente, httpOnly deve ser false
            secure: process.env.NODE_ENV !== 'development',
            maxAge: -1, // Expira imediatamente
            path: '/',
        });

        // Redireciona para a página de login
        router.push('/pages/login');
    }, [router]);


    const reset = () => {
        setTime(15000);
    };

    const style = {
        ...(resposta && { color: 'green' }) // Adiciona estilo condicional
    };

    return (


        <main className="lg:ml-[23rem] p-4">
            <Sidebar logouFunction={handleLogout} />
            <section className="w-full h-screen flex-col flex items-center justify-start relative ">

                {viewAltert && (
                    <div className="w-[100%] mb-4 w-[70%]">
                        <AlertItem severity={alert} message={message} title={title} />
                    </div>
                )}

                <Card className="w-[70%] bg-slate-50">
                    <CardHeader>
                        <div className="flex items-center  justify-between w-full">
                            <CardTitle className="text-2xl font-bold  " style={style}>{titlePage}</CardTitle>
                            {resposta ?
                                <Link href={"/"} className="h-[40px]  bg-green-400  gap-2 rounded-[6px] px-20 text-white m font-bold hover:opacity-60 flex items-center" style={{ marginLeft: '20px' }}>
                                    {t('automatic:scratch.ok')}

                                </Link> : <></>
                            }

                            <SquareActivity className="ml-auto w-8 h-8 text-blue-400" />

                        </div>
                    </CardHeader>
                    <CardContent>





                        <header className="w-full flex items-center justify-between">

                            <SelectHistory
                                stencils={stencils}
                                selectedStencil={selectedStencil}
                                setSelectedStencil={setSelectedStencil}
                            />

                            <Button
                                className="bg-blue-400 h-[50px] text-xl font-bold"
                                onClick={takephotorequest}
                                disabled={loadingRobot}
                            >
                                {t('automatic:scratch.start')}
                            </Button>

                        </header>
                        <br />
                        {
                            loadingRobot
                                ?
                                <div className="flex w-full items-start justify-center">
                                    <div className="flex w-full items-center justify-between">
                                        <span className="text-2xl font-bold text-blue-300" >{t('automatic:scratch.processing')}</span>

                                        <div className="
                                            flex 
                                            items-center 
                                            justify-center 
                                            gap-3 
                                            border-[2px]
                                            p-1
                                            border-white
                                        ">
                                            <Stopwatch
                                                isRunning={loadingRobot}
                                                setTime={setTime}
                                                time={time}
                                                validateRequisition={() => {
                                                    if ((time === 0)) {
                                                        setTime(15000)
                                                    }
                                                }}
                                            />
                                            <AlarmClock size={40} className="text-blue-300" />
                                        </div>
                                    </div>
                                </div>
                                :
                                resposta ?

                                    <div className="w-full flex relative">
                                        <img src={`${BASE_URL}${resposta.image_path}`} alt="imagem" className="w-full object-cover" />
                                        <label className="absolute top-0 left-0 p-2 text-green-500 text-4xl font-bold">
                                            {resposta.scratch_count}
                                        </label>
                                    </div>
                                    : <></>


                        }

                        {
                            erroRobot ?
                                <div>
                                    <span className="text-1xl font-bold text-red-400" >{t('automatic:scratch.clpError')}</span>
                                </div>
                                : <></>
                        }

                    </CardContent>
                </Card>
            </section>
        </main>
    )
}