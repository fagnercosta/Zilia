"use client"
import Sidebar from "@/components/Sidebar";
import { useCallback, useEffect, useState } from "react";
import cookie from "cookie"
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlarmClock, Clock10, Search, SquareActivity } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { BASE_URL } from "@/types/api";
import { Stencil } from "@/types/models";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@mui/material";
import InovaBottomImage from "@/components/InovaBottomImage";
import Stopwatch from "@/components/StopWatch";
import { SelectHistory } from "@/components/Select/SelectHistory";
import AlertItem from "@/components/AlertItem";
import ProgressoScrath from "@/components/ProgressoScrath";

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

    const [message, setMessage] = useState("Erro na comunicação com o robo")
    const [erroRobot, setErroRobot] = useState(false)
    const [lendo, setLendo] = useState(false)

    const [selectedStencil, setSelectedStencil] = useState<Stencil | null>(
        null
    )

    const [viewAltert, setViewAltert] = useState(false)


    const getStencils = async () => {
        try {
            const response = await axios.get(`${BASE_URL}api/stencil/`)
            if (response) {
                setStencils(response.data.results)
            } else {
                setViewAltert(true)
                setMessage("Erro na comunicação com o servidor!")
                setLoadingRobot(false)
            }
        } catch (error) {
            setViewAltert(true)
            setMessage("Erro na comunicação com o servidor!")
            setLoadingRobot(false)
        }
    }

    useEffect(() => {
        getStencils()
    }, [])


    const takephotorequest = async () => {




        setErroRobot(false)
        setLoadingRobot(true)
        setLendo(true)
        setViewAltert(false)


        console.log(stencilSelected)
        try {

            if (selectedStencil?.stencil_id === 0 || selectedStencil === null) {
                setMessage("Selecione um stencil para realizar a medição.");
                setViewAltert(true)
                setLoadingRobot(false)
                setLendo(false)
            } else {
                const response = await axios.post(`http://127.0.0.1:8000/api/takephoto/${selectedStencil?.stencil_id}/`)
                if (response) {
                    setLoadingRobot(true)
                    console.log(response.data)
                    setResposta(response.data)

                }
            }

        } catch (error: any) {

            console.log("Api is not running", error)
            setMessage("Erro na comunicação com o clp/robo!.Sugestão: \n Resetar o clp.")   
            setLoadingRobot(false)
            setErroRobot(true)
            setViewAltert(true)
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

        localStorage.removeItem("token");
        localStorage.removeItem("tokenTimestamp");

        // Redireciona para a página de login
        router.push('/pages/login');
    }, [router]);


    const reset = () => {
        setTime(15000);
    };

    return (
        <main className="lg:ml-[23rem] p-4">
            <Sidebar logouFunction={handleLogout} />
            <section className="w-full h-screen  flex-col flex items-center justify-center relative">


                {
                    viewAltert && (
                        <div className="w-[70%] mb-6 ">
                            <AlertItem variant="standard" severity={"error"} message={message} title="Warning" />
                        </div>
                    )

                }
                <Card className="w-[70%] bg-slate-50">
                    <CardHeader>
                        <div className="flex items-center  justify-between w-full">
                            <CardTitle className="text-2xl font-bold">Medição automática</CardTitle>
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
                                className="w-[25%] bg-blue-400 h-[50px] text-xl font-bold"
                                onClick={takephotorequest}
                                disabled={loadingRobot}
                            >
                                Iniciar Medição
                            </Button>
                        </header>
                        <br />


                        {
                            loadingRobot
                                ?
                                <div className="flex w-full items-start justify-center">
                                    <div className="flex w-full items-center justify-between">
                                        <span className="text-2xl font-bold text-blue-300" >Procesamendo. Tempo  estimado...</span>

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
                                        <img src={`http://localhost:8000/${resposta.image_path}`} alt="imagem" className="w-full object-cover" />
                                        <label className="absolute top-0 left-0 p-2 text-green-500 text-4xl font-bold">
                                            {resposta.scratch_count}
                                        </label>
                                    </div>
                                    : <></>


                        }





                    </CardContent>

                </Card>

                {
                    (loadingRobot || lendo && !erroRobot) && (
                        <div className="mt-4 p rounded-none w-[90%]" style={{ minHeight: '400px', marginTop: '30px', marginLeft: '10px' }}>
                            <ProgressoScrath />
                        </div>

                    )
                }
            </section>
        </main>
    )
}