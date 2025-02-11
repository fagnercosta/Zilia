"use client"

import Image from "next/image";
import cookie from 'cookie';
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Barcode, Calendar, ChartColumnIncreasing, ChartNoAxesColumnIncreasing, CircleX, ClipboardMinus, Diameter, DollarSign, RefreshCcw, Search, SquareActivity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HoverCard } from "@radix-ui/react-hover-card";
import { HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { BASE_URL } from "@/types/api";
import axios from "axios";
import StencilGraphicLimit from "@/components/PizzaGraphic";
import { Progress } from "@/components/ui/progress";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { TensionGraphics } from "@/components/TensionGraphic";
import { Stencil, StencilRobotMedition, StencilTensionValues } from "@/types/models";
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import { Alert, AlertColor } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import { formatDateTime } from "@/functions/functions";
import { PDFDownloadLink, renderToStream } from '@react-pdf/renderer';
import StencilReport from "@/components/Report/ReportDashboard";
import InovaImage from "../assets/inova.png"
import InovaBottomImage from "@/components/InovaBottomImage";
import { fstat } from "fs";



export default function Home() {

  const router = useRouter();
  const [stencilDigited, setStencilDigited] = useState("")
  const [stencil, setStencil] = useState<Stencil|null>()
  const [openSnackBar, setOpenSnackBar] = useState(false)
  const [messageSnack, setMessageSnack] = useState("")
  const [alert, setAlert] = useState<AlertColor>("success")
  const [stencilTensionValues, setStencilTensionValues] = useState<StencilTensionValues[]>()
  const [lastRobotMedition, setLastRobotMedition] = useState<StencilRobotMedition>()

  const handleClick = () => {
    setOpenSnackBar(true);
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
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

  const [graphData, setGraphData] = useState(
    {
      P1: [
        { cycles: 0, tension: 0 },
        { cycles: 0, tension: 0 },
        { cycles: 0, tension: 0 },
        { cycles: 0, tension: 0 },
        { cycles: 0, tension: 0 },
        { cycles: 0, tension: 0 },
      ],
      P2: [
        { cycles: 0, tension: 0 },
        { cycles: 0, tension: 0 },
        { cycles: 0, tension: 0 },
        { cycles: 0, tension: 0 },
        { cycles: 0, tension: 0 },
        { cycles: 0, tension: 0 },
      ],
      P3: [
        { cycles: 0, tension: 0 },
        { cycles: 0, tension: 0 },
      ],
      P4: [
        { cycles: 0, tension: 0 },
        { cycles: 0, tension: 0 },
      ],

    })

  useEffect(() => {
    const cookies = cookie.parse(document.cookie);
    const authToken = cookies.authToken;
    if (!authToken) {
      router.push('/');  // Redireciona para a página de login se não estiver autenticado
    }
  }, [router]);

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

  const handlePage = (pagePath: string) => {
    router.push(pagePath)
  }

  const scanBarCode = async () => {
    setOpenSnackBar(true)
    setAlert("info")
    setMessageSnack("Esperando o sensor reconhecer um código...")
    try {
      const response = await axios.get(`${BASE_URL}api/scanner/`)
      setOpenSnackBar(false)
      setAlert("success")
      setMessageSnack("Código encontrado!")
      setOpenSnackBar(true)

      setStencilDigited(response.data.scanned_code)

    } catch (error) {
      console.log(error)
    }
  }

  const handleStencil = async () => {
    if (stencilDigited == "" || stencilDigited == null) {
      setMessageSnack("Forneça um stencil")
      setOpenSnackBar(true)
      setAlert("warning")
    } else {
      try {

        setStencil(null);
        const response = await axios.get(`${BASE_URL}/api/stencil/?stencil_id=${stencilDigited.toUpperCase()}`)

        if (response.status === 200) {
          setStencil(response.data.results[0])
          const responseValues = await axios.get(`${BASE_URL}/api/stencilTensionValues/?stencil_identification=${response.data.results[0].stencil_id}&timestamp=${new Date().getTime()}`)

          const stencilValues: StencilTensionValues[] = responseValues.data.results

          if (stencilValues.length > 0) {
            const valuesp1 = stencilValues.map((stencil) => { return { cycles: stencil.cicles, tension: stencil.p1 } })
            const valuesp2 = stencilValues.map((stencil) => { return { cycles: stencil.cicles, tension: stencil.p2 } })
            const valuesp3 = stencilValues.map((stencil) => { return { cycles: stencil.cicles, tension: stencil.p3 } })
            const valuesp4 = stencilValues.map((stencil) => { return { cycles: stencil.cicles, tension: stencil.p4 } })


            setGraphData({ P1: valuesp1, P2: valuesp2, P3: valuesp3, P4: valuesp4 })

            // setCicles(stencilValues[stencilValues.length - 1].cicles);
            setStencilTensionValues(stencilValues)
            setMessageSnack("Valores encontrados!")
            setOpenSnackBar(true)
            setAlert("success")

            

          } else {
            setMessageSnack('Não foram encontrados valores para o Stencil')
            setAlert("warning")
            setOpenSnackBar(true)
          }

         
          const responseLastMedition = await axios.get(`${BASE_URL}api/processedimages/?stencil_id=${response.data.results[0].stencil_id}&timestamp=${new Date().getTime()}`)
          if (responseLastMedition.status === 200){ 
              setLastRobotMedition(responseLastMedition.data.results[responseLastMedition.data.results.length - 1])
          }else{
                setMessageSnack('Stencil sem medição de arranhões ');
                setOpenSnackBar(true);
                setAlert("warning")
          }
          
            

          

        } else {
          setMessageSnack('Stencil não encontrado. Ou o Stencil está sem medições de arranhões');
          setOpenSnackBar(true);
          setAlert("warning")
        }
      } catch (error: any) {
        if (!error.response) {
          // Erro de rede ou servidor inacessível
          setMessageSnack('Erro de rede. Houve um problema de comunicação com Api.');
          setAlert("error")
          setOpenSnackBar(true);
        } else if (error.response.status === 404) {
          // Erro 404 - não encontrado
          if(stencil!=null){

            if(stencilTensionValues?.length === 0){
              setMessageSnack(`Stencil ${stencil.stencil_part_nbr} está sem medições de  tensão `);
              setOpenSnackBar(true);
              setAlert("warning")
            }else{
              setMessageSnack(`Stencil ${stencil.stencil_part_nbr} foi encontrado, mas está sem medições de arranhões `);
              setOpenSnackBar(true);
              setAlert("success")
            }
            
          }else{
            setMessageSnack('Stencil não encontrado');
            setOpenSnackBar(true);
            setAlert("error")
          }

        } else {
          // Outros erros
          setMessageSnack('Ocorreu um erro ao buscar os dados. Por favor, tente novamente.');
          setAlert("warning")
          setOpenSnackBar(true);
        }
        console.error(error);
      }
    }
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (stencilDigited == "" || stencilDigited == null) {
        setMessageSnack("Forneça um stencil")
        setOpenSnackBar(true)
        setAlert("warning")
      } else {
        try {
  
          setStencil(null);
          const response = await axios.get(`${BASE_URL}/api/stencil/?stencil_id=${stencilDigited.toUpperCase()}`)
  
          if (response.status === 200) {
            setStencil(response.data.results[0])
            const responseValues = await axios.get(`${BASE_URL}/api/stencilTensionValues/?stencil_identification=${response.data.results[0].stencil_id}&timestamp=${new Date().getTime()}`)
  
            const stencilValues: StencilTensionValues[] = responseValues.data.results
  
            if (stencilValues.length > 0) {
              const valuesp1 = stencilValues.map((stencil) => { return { cycles: stencil.cicles, tension: stencil.p1 } })
              const valuesp2 = stencilValues.map((stencil) => { return { cycles: stencil.cicles, tension: stencil.p2 } })
              const valuesp3 = stencilValues.map((stencil) => { return { cycles: stencil.cicles, tension: stencil.p3 } })
              const valuesp4 = stencilValues.map((stencil) => { return { cycles: stencil.cicles, tension: stencil.p4 } })
  
  
              setGraphData({ P1: valuesp1, P2: valuesp2, P3: valuesp3, P4: valuesp4 })
  
              // setCicles(stencilValues[stencilValues.length - 1].cicles);
              setStencilTensionValues(stencilValues)
              setMessageSnack("Valores encontrados!")
              setOpenSnackBar(true)
              setAlert("success")
  
              
  
            } else {
              setMessageSnack('Não foram encontrados valores para o Stencil')
              setAlert("warning")
              setOpenSnackBar(true)
            }
  
           
            const responseLastMedition = await axios.get(`${BASE_URL}api/processedimages/?stencil_id=${response.data.results[0].stencil_id}&timestamp=${new Date().getTime()}`)
            if (responseLastMedition.status === 200){ 
                setLastRobotMedition(responseLastMedition.data.results[responseLastMedition.data.results.length - 1])
            }else{
                  setMessageSnack('Stencil sem medição de arranhões ');
                  setOpenSnackBar(true);
                  setAlert("warning")
            }
            
              
  
            
  
          } else {
            setMessageSnack('Stencil não encontrado. Ou o Stencil está sem medições de arranhões');
            setOpenSnackBar(true);
            setAlert("warning")
          }
        } catch (error: any) {
          if (!error.response) {
            // Erro de rede ou servidor inacessível
            setMessageSnack('Erro de rede. Houve um problema de comunicação com Api.');
            setAlert("error")
            setOpenSnackBar(true);
          } else if (error.response.status === 404) {
            // Erro 404 - não encontrado
            if(stencil!=null){
  
              if(stencilTensionValues?.length === 0){
                setMessageSnack(`Stencil ${stencil.stencil_part_nbr} está sem medições de  tensão `);
                setOpenSnackBar(true);
                setAlert("warning")
              }else{
                setMessageSnack(`Stencil ${stencil.stencil_part_nbr} foi encontrado, mas está sem medições de arranhões `);
                setOpenSnackBar(true);
                setAlert("success")
              }
              
            }else{
              setMessageSnack('Stencil não encontrado');
              setOpenSnackBar(true);
              setAlert("error")
            }
  
          } else {
            // Outros erros
            setMessageSnack('Ocorreu um erro ao buscar os dados. Por favor, tente novamente.');
            setAlert("warning")
            setOpenSnackBar(true);
          }
          console.error(error);
        }
      }
    }
  };

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  } satisfies ChartConfig

  return (
    <main className="lg:ml-[23rem] p-4">
      <Sidebar logouFunction={handleLogout} />
      <div className="flex flex-col min-h-screen relative">
        <section className="grid grid-cols-4 gap-4">
          
          {/*Card de pesquisa*/}
          <Card className="bg-slate-50">
            <CardHeader>
              <div className="flex items-center justify-center">
                <CardTitle className="text-lg sm:text-xl text-blue-400 font-bold">
                  Pesquisa de Stencil
                </CardTitle>
                <Search className="ml-auto w-6 h-6 text-blue-400" />
              </div>
              <CardDescription>
                Pesquise para verificar as medições
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col justify-center items-center gap-2">
                <div className="flex items-center justify-between w-full">
                  <Input
                    type="search"
                    placeholder="Digite o identificador..."
                    className="w-9/12 bg-white"
                    onChange={(e) => setStencilDigited(e.target.value)}
                    onKeyDown={handleKeyDown}
                    value={stencilDigited}
                    
                  />
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button type="button" variant={"outline"} onClick={scanBarCode}>
                        <Barcode className="ml-auto w-6 h-6 " />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <div className="flex items-start space-x-4 flex-col gap-3">
                        <h3 className="font-bold ">Código de barras</h3>
                        Esta função permite ler um código de barras de um Stencil e transcreve para o campo de pesquisa.
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <Button className="w-full bg-blue-400" onClick={handleStencil} disabled={stencilDigited.length === 0 ? true : false}>Pesquisar</Button>
              </div>

            </CardContent>
          </Card>

          {/*Card da quantidade de ciclos*/}
          <Card className="bg-slate-50">
            <CardHeader>
              <div className="flex items-center justify-center">
                <CardTitle className="text-lg sm:text-xl text-blue-400 font-bold">
                  Ciclos
                </CardTitle>
                <RefreshCcw className="ml-auto w-6 h-6 text-blue-400" />
              </div>
              <CardDescription>
                Informações sobre os ciclos das medidas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Aqui Aparecerão os ciclos */}
              {stencil && (
                <p className="text-base font-bold">{stencilTensionValues && (stencilTensionValues[stencilTensionValues.length - 1].cicles)}</p>
              )}
            </CardContent>
          </Card>

          {/*Card do Status do Stencil*/}
          <Card className="bg-slate-50">
            <CardHeader>
              <div className="flex items-center justify-center">
                <CardTitle className="text-lg sm:text-xl text-blue-400 font-bold">
                  Status
                </CardTitle>
                <ChartColumnIncreasing className="ml-auto w-6 h-6 text-blue-400" />
              </div>
              <CardDescription>
                Mostra o status do Stencil
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Aqui Aparecerá o Status do Stencil */}
              {stencil && (
                <p className="text-base font-bold">{stencil.status}</p>
              )}
            </CardContent>
          </Card>

          {/*Card da ultima medição*/}
          <Card className="bg-slate-50">
            <CardHeader>
              <div className="flex items-center justify-center">
                <CardTitle className="text-lg sm:text-xl text-blue-400 font-bold">
                  Ultima medição
                </CardTitle>
                <Calendar className="ml-auto w-6 h-6 text-blue-400" />
              </div>
              <CardDescription>
                Mostra a data referente a última medição
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Aqui aparecerá data da ultima medição do Stencil*/}
              {stencil && (
                <p className="text-base font-bold">
                  {stencilTensionValues && (
                    formatDateTime(stencilTensionValues[stencilTensionValues.length - 1].measurement_datetime || "")
                  )}
                </p>
              )}
            </CardContent>
          </Card>

          {/*Card dos últimos pontos medidos*/}
          <Card className="bg-slate-50 ">
            <CardHeader>
              <div className="flex items-center justify-center">
                <CardTitle className="text-lg sm:text-xl text-blue-400 font-bold">
                  Ultimos pontos medidos
                </CardTitle>
                <Diameter className="ml-auto w-6 h-6 text-blue-400" />
              </div>
              <CardDescription>
                Mostra o valor de tensão dos pontos na ultima medição
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Aqui aparecerá data da ultima medição do Stencil*/}
              {stencil && (
                <div className="flex items-center justify-between w-full">
                  <p className="text-base font-bold">P1: {stencil.p1_value} N/cm²</p>
                  <p className="text-base font-bold">P2: {stencil.p2_value} N/cm²</p>
                  <p className="text-base font-bold">P3: {stencil.p3_value} N/cm²</p>
                  <p className="text-base font-bold">P4: {stencil.p4_value} N/cm²</p>
                </div>
              )}
            </CardContent>
          </Card>



          {/*Card do limite de vida*/}
          <Card className="bg-slate-50">
            <CardHeader>
              <div className="flex items-center justify-center">
                <CardTitle className="text-lg sm:text-xl text-blue-400 font-bold">
                  Limite de vida estimado
                </CardTitle>
                <SquareActivity className="ml-auto w-6 h-6 text-blue-400" />
              </div>
              <CardDescription>
                Mostra o limite de vida estimado do Stencil
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Aqui aparecerá gráfico do limite de vida*/}
              {/* <StencilGraphicLimit/> */}
              {stencil && (
                <Progress value={66}/>
              )}
            </CardContent>
          </Card>

          {/*Card do novas medições*/}
          <Card className="bg-slate-50 col-span-2">
            <CardHeader>
              <div className="flex items-center justify-center">
                <CardTitle className="text-lg sm:text-xl text-blue-400 font-bold">
                  Novas medições
                </CardTitle>
                <SquareActivity className="ml-auto w-6 h-6 text-blue-400" />
              </div>
              <CardDescription>
                Escolha o tipo de medição que deseja relizar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Aqui aparecerá os botoes*/}
              <div className=" flex w-full justify-between gap-1 flex-wrap text-wrap ">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button className="bg-blue-400 text-white w-[25%] hover:opacity-60" onClick={() => handlePage("/pages/stencil_medition")}>
                      Tensão Manual
                    </Button>

                  </HoverCardTrigger>
                  <HoverCardTrigger asChild>
                    <Button className="bg-blue-400 text-white w-[25%] hover:opacity-60" onClick={() => handlePage("/pages/stencil_automatic_medition")}>
                      Tensão Automática
                    </Button>

                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="flex items-start space-x-4 flex-col gap-3">
                      <h3 className="font-bold ">Medir Tensão</h3>
                      Esta função levará para uma aba específica para realizar medidas manuais, fornecendo informações e preenchendo-as conforme o necessário no sistema.
                    </div>
                  </HoverCardContent>
                </HoverCard>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button className="bg-blue-400 text-white w-[25%] hover:opacity-60" onClick={() => handlePage("/pages/automatic_medition")}>
                      Medir Aranhões
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="flex items-start space-x-4 flex-col gap-3">
                      <h3 className="font-bold ">Medir Aranhões</h3>
                      Esta função abre um modal onde será necessário escolher o Stencil a ser medido e iniciará o processo de conexão com o robô e demais processos e equipamentos.
                    </div>
                  </HoverCardContent>
                </HoverCard>

                {stencil && (
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <PDFDownloadLink
                        document={
                          <StencilReport
                            stencil={stencil}
                            tensionValues={stencilTensionValues}
                            lastRobotMedition={lastRobotMedition}
                          />
                        }
                        fileName={`Relatorio_Stencil_${stencil?.stencil_id}.pdf`}
                        className="bg-orange-300 text-white w-[25%] hover:opacity-60 p-1.5 rounded"
                      >
                        {({ blob, url, loading, error }) =>
                          loading ? 'Gerando Relatório...' : 'Gerar relatório'
                        }
                      </PDFDownloadLink>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <div className="flex items-start space-x-4 flex-col gap-3">
                        <h3 className="font-bold ">Geração de relatório de conformidade</h3>
                        Esta função gera um relatório referente a conformidade do stencil pesquisado e demais medidas realizadas.
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                )}

              </div>
            </CardContent>
          </Card>
        </section>
        <br />
        <section className="grid grid-cols-4 gap-4">
          <Card className="bg-slate-50">
            <CardHeader>
              <div className="flex items-center justify-center">
                <CardTitle className="text-lg sem:text-xl text-blue-400 ">
                  P1
                </CardTitle>
                <ChartNoAxesColumnIncreasing className="ml-auto w-4 h-4 text-blue-400 " />
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} >
                <TensionGraphics data={graphData.P1} />
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="bg-slate-50">
            <CardHeader>
              <div className="flex items-center justify-center">
                <CardTitle className="text-lg sem:text-xl text-blue-400 ">
                  P2
                </CardTitle>
                <ChartNoAxesColumnIncreasing className="ml-auto w-4 h-4 text-blue-400 " />
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} >
                <TensionGraphics data={graphData.P2} />
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="bg-slate-50">
            <CardHeader>
              <div className="flex items-center justify-center">
                <CardTitle className="text-lg sem:text-xl text-blue-400 ">
                  P3
                </CardTitle>
                <ChartNoAxesColumnIncreasing className="ml-auto w-4 h-4 text-blue-400 " />
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} >
                <TensionGraphics data={graphData.P3} />
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="bg-slate-50">
            <CardHeader>
              <div className="flex items-center justify-center">
                <CardTitle className="text-lg sem:text-xl text-blue-400 ">
                  P4
                </CardTitle>
                <ChartNoAxesColumnIncreasing className="ml-auto w-4 h-4 text-blue-400 " />
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} >
                <TensionGraphics data={graphData.P4} />
              </ChartContainer>
            </CardContent>
          </Card>
        </section>
      </div>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleClose}
        message={messageSnack}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        action={action}
      >
        <Alert
          onClose={handleClose}
          severity={alert}
          variant="standard"
          sx={{ width: '100%', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}

        >
          {messageSnack}
        </Alert>
      </Snackbar>
    </main>
  );
}
