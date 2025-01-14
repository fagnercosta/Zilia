"use client"
import Sidebar from "@/components/Sidebar";
import { useCallback, useEffect, useState } from "react";
import cookie from "cookie"
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlarmClock, Clock10, SquareActivity } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { BASE_URL } from "@/types/api";
import { Stencil } from "@/types/models";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@mui/material";
import InovaBottomImage from "@/components/InovaBottomImage";
import Stopwatch from "@/components/StopWatch";

interface RequestRobot {
    id: number
    image_path: string
    message: string
    scratch_count: number
    stencil: number
    timestamp: string
}

export default function AutomaticMedition() {

    const router = useRouter()
    const [stencils, setStencils] = useState<Stencil[]>([])
    const [stencilSelected, setStencilSelected] = useState<number | null>()
    const [resposta, setResposta] = useState<RequestRobot>()
    const [loadingRobot, setLoadingRobot] = useState(false)
    const [time, setTime] = useState(18000)


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
        setLoadingRobot(true)
        console.log(stencilSelected)
        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/takephoto/${stencilSelected}/`)
            if (response) {
                setLoadingRobot(false)
                console.log(response.data)
                setResposta(response.data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleLogout = useCallback(() => {
        // Remover o cookie definindo uma data de expiração no passado
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

    return (
        <main className="lg:ml-[23rem] p-4">
            <Sidebar logouFunction={handleLogout} />
            <section className="w-full h-screen flex items-center justify-center relative">
                <InovaBottomImage />
                <Card className="w-[70%] bg-slate-50">
                    <CardHeader>
                        <div className="flex items-center  justify-between w-full">
                            <CardTitle className="text-2xl font-bold">Medição automática</CardTitle>
                            <SquareActivity className="ml-auto w-8 h-8 text-blue-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <header className="w-full flex items-center justify-between">
                            <Select onValueChange={(value) => setStencilSelected(parseInt(value))}>
                                <SelectTrigger className="w-[70%] h-[50px] bg-white text-xl">
                                    <SelectValue placeholder="Selecione um Stencil..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel className="text-xl">Stencils</SelectLabel>
                                        {stencils.map((stencil) => {
                                            return (
                                                <SelectItem
                                                    value={stencil.stencil_id.toString()}
                                                    className="text-xl"
                                                    key={stencil.stencil_id}
                                                >
                                                    {stencil.stencil_id}
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Button
                                className="w-[25%] bg-blue-400 h-[50px] text-xl font-bold" onClick={takephotorequest}
                            >
                                Iniciar Medição
                            </Button>
                        </header>
                        <br />
                        {
                            loadingRobot
                                ?
                                <div className="flex w-full items-center justify-center">
                                    <div className="flex w-full items-center justify-between">
                                        <span className="text-2xl font-bold">Tempo de espera estimado:</span>
                                        <div className="
                                            flex 
                                            items-center 
                                            justify-center 
                                            gap-3 
                                            border-[2px]
                                            p-2
                                            border-blue-400
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
                                            <AlarmClock size={40} className="text-blue-400" />
                                        </div>
                                    </div>
                                </div>
                                :
                                resposta ?
                                    <div className="w-full flex relative">
                                        <img src={`http://localhost:8000/${resposta.image_path}`} alt="imagem" className="w-full object-cover" />
                                        <label className="absolute top-0 left-0 p-2 text-green-500 text-4xl font-bold">
                                            {resposta.scratch_count}
                                        </label>
                                    </div>
                                    : <></>
                        }

                    </CardContent>
                </Card>
            </section>
        </main>
    )
}