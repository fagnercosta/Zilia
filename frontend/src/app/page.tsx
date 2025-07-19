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
import AlertItem from "@/components/AlertItem";
import { useTranslation } from 'react-i18next';



export default function Home() {
  const { t } = useTranslation(['dashboard', 'common']);
  const router = useRouter();
  const [stencilDigited, setStencilDigited] = useState("")
  const [stencil, setStencil] = useState<Stencil | null>()
  const [openSnackBar, setOpenSnackBar] = useState(false)
  const [messageSnack, setMessageSnack] = useState("")
  const [alert, setAlert] = useState<AlertColor>("success")
  const [stencilTensionValues, setStencilTensionValues] = useState<StencilTensionValues[]>()
  const [lastRobotMedition, setLastRobotMedition] = useState<StencilRobotMedition>()
  const [lastStencilValues, setLastStencilValues] = useState<StencilTensionValues[]>()
  const [medicaoAranhao, setMedicaoAranhao] = useState<StencilRobotMedition[]>();

  const [viewAltert, setViewAltert] = useState(false)


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
        {t('common.app.undo')}
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

  const valuesInitial = {
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

  }

  const [graphData, setGraphData] = useState(valuesInitial)

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

    localStorage.removeItem("first_name");
    localStorage.removeItem("last_name");
    localStorage.removeItem("email");

    // Redireciona para a página de login
    router.push('/login');
  }, [router]);

  const handlePage = (pagePath: string) => {
    router.push(pagePath)
  }

  const scanBarCode = async () => {
    setOpenSnackBar(true)
    setAlert("info")
    setMessageSnack(t('dashboard:messages.waitingSensor'))
    try {
      const response = await axios.get(`${BASE_URL}api/scanner/`)
      setOpenSnackBar(false)
      setAlert("success")
      setMessageSnack(t('dashboard:messages.codeFound'))
      setOpenSnackBar(true)

      setStencilDigited(response.data.scanned_code)

    } catch (error) {
      console.log(error)
    }
  }

  const handleStencil = async () => {
    setViewAltert(false)
    if (stencilDigited == "" || stencilDigited == null) {
      setMessageSnack(t('dashboard:messages.provideStencil'))
      setOpenSnackBar(true)
      setAlert("warning")
    } else {
      try {

        setGraphData(valuesInitial)
        setStencil(null);
        const response = await axios.get(`${BASE_URL}/api/stencil/?stencil_id=${stencilDigited.toUpperCase()}`)

        if (response.status === 200) {
          setStencil(response.data.results[0])
          const responseValues = await axios.get(`${BASE_URL}/api/stencilTensionValues/?stencil_identification=${response.data.results[0].stencil_id}&timestamp=${new Date().getTime()}`)
          const responseLastStencilValues = await axios.get(`${BASE_URL}/api/stencilTensionLastValues/?stencil_identification=${response.data.results[0].stencil_id}`)
          const stencilValues: StencilTensionValues[] = responseValues.data.results
          const lastStencilValues: StencilTensionValues[] = responseLastStencilValues.data.results

          if (stencilValues.length > 0) {
            const valuesp1 = stencilValues.map((stencil) => { return { cycles: stencil.cicles, tension: stencil.p1 } })
            const valuesp2 = stencilValues.map((stencil) => { return { cycles: stencil.cicles, tension: stencil.p2 } })
            const valuesp3 = stencilValues.map((stencil) => { return { cycles: stencil.cicles, tension: stencil.p3 } })
            const valuesp4 = stencilValues.map((stencil) => { return { cycles: stencil.cicles, tension: stencil.p4 } })


            setGraphData({ P1: valuesp1, P2: valuesp2, P3: valuesp3, P4: valuesp4 })

            // setCicles(stencilValues[stencilValues.length - 1].cicles);
            setStencilTensionValues(stencilValues)
            setLastStencilValues(lastStencilValues)
            setMessageSnack(t('dashboard:messages.valuesFound'))
            setOpenSnackBar(true)
            setAlert("success")



          } else {
            setMessageSnack(t('dashboard:messages.noValuesFound'))
            setAlert("warning")
            setOpenSnackBar(true)
          }


          const responseLastMedition = await axios.get(`${BASE_URL}api/processedimages/?stencil_id=${response.data.results[0].stencil_id}&timestamp=${new Date().getTime()}`)
          const responseLastMeditionImage = await axios.get(`${BASE_URL}api/processedlastimages/?stencil_id=${response.data.results[0].stencil_id}`)
          
          
          if (responseLastMedition.status === 200) {
            setMedicaoAranhao(responseLastMeditionImage.data.results)
            console.log("LAST"+responseLastMedition.data.results)
            setLastRobotMedition(responseLastMedition.data.results[responseLastMedition.data.results.length - 1])
            console.log("ALL"+responseLastMedition.data.results)
          } else {
            setMessageSnack(t('dashboard:messages.stencilWithoutScratchMeasurement'));
            setOpenSnackBar(true);
            setAlert("warning")
          }





        } else {
          setMessageSnack(t('dashboard:messages.stencilNotFoundOrNoMeasurements'));
          setOpenSnackBar(true);
          setAlert("warning")
        }
      } catch (error: any) {
        if (!error.response) {
          // Erro de rede ou servidor inacessível
          setMessageSnack(t('dashboard:messages.networkError'));
          setAlert("error")
          setViewAltert(true)
          //setOpenSnackBar(true);
        } else if (error.response.status === 404) {
          // Erro 404 - não encontrado
          if (stencil != null) {

            if (stencilTensionValues?.length === 0) {
              setMessageSnack(t('dashboard:messages.stencilWithoutTensionMeasurements', { partNumber: stencil.stencil_part_nbr }));
              setOpenSnackBar(true);
              setAlert("warning")
            } else {
              setMessageSnack(t('dashboard:messages.stencilFoundButNoScratchMeasurements', { partNumber: stencil.stencil_part_nbr }));
              setOpenSnackBar(true);
              setAlert("success")
            }

          } else {
            setMessageSnack(t('dashboard:messages.stencilNotFound'));
            setOpenSnackBar(true);
            setAlert("error")
          }

        } else {
          // Outros erros
          setMessageSnack(t('dashboard:messages.errorFetchingData'));
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
        setMessageSnack(t('dashboard:messages.provideStencil'))
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
              setMessageSnack(t('dashboard:messages.valuesFound'))
              setOpenSnackBar(true)
              setAlert("success")



            } else {
              setMessageSnack(t('dashboard:messages.noValuesFound'))
              setAlert("warning")
              setOpenSnackBar(true)
            }


            const responseLastMedition = await axios.get(`${BASE_URL}api/processedimages/?stencil_id=${response.data.results[0].stencil_id}&timestamp=${new Date().getTime()}`)
            if (responseLastMedition.status === 200) {
              setLastRobotMedition(responseLastMedition.data.results[responseLastMedition.data.results.length - 1])
            } else {
              setMessageSnack(t('dashboard:messages.stencilWithoutScratchMeasurement'));
              setOpenSnackBar(true);
              setAlert("warning")
            }





          } else {
            setMessageSnack(t('dashboard:messages.stencilNotFoundOrNoMeasurements'));
            setOpenSnackBar(true);
            setAlert("warning")
          }
        } catch (error: any) {
          if (!error.response) {
            // Erro de rede ou servidor inacessível
            setMessageSnack(t('dashboard:messages.networkError'));
            setAlert("error")
            setOpenSnackBar(true);
          } else if (error.response.status === 404) {
            // Erro 404 - não encontrado
            if (stencil != null) {

              if (stencilTensionValues?.length === 0) {
                setMessageSnack(t('dashboard:messages.stencilWithoutTensionMeasurements', { partNumber: stencil.stencil_part_nbr }));
                setOpenSnackBar(true);
                setAlert("warning")
              } else {
                setMessageSnack(t('dashboard:messages.stencilFoundButNoScratchMeasurements', { partNumber: stencil.stencil_part_nbr }));
                setOpenSnackBar(true);
                setAlert("success")
              }

            } else {
              setMessageSnack(t('dashboard:messages.stencilNotFound'));
              setOpenSnackBar(true);
              setAlert("error")
            }

          } else {
            // Outros erros
            setMessageSnack(t('dashboard:messages.errorFetchingData'));
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

        {viewAltert && (
          <section className="grid grid-cols-1 mb-4">
            <AlertItem variant="standard" severity={alert} message={messageSnack} title={t('dashboard:alerts.error')}/>
          </section>
        )}

        <section className="grid grid-cols-4 gap-4">

          {/*Card de pesquisa*/}
          <Card className="bg-slate-50">
            <CardHeader>
              <div className="flex items-center justify-center">
                <CardTitle className="text-lg sm:text-xl text-blue-400 font-bold">
                  {t('dashboard:search.title')}
                </CardTitle>
                <Search className="ml-auto w-6 h-6 text-blue-400" />
              </div>
              <CardDescription>
                {t('dashboard:search.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col justify-center items-center gap-2">
                <div className="flex items-center justify-between w-full">
                  <Input
                    type="search"
                    placeholder={t('dashboard:search.placeholder')}
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
                        <h3 className="font-bold ">{t('dashboard:search.barcode.title')}</h3>
                        {t('dashboard:search.barcode.description')}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <Button className="w-full bg-blue-400" onClick={handleStencil} disabled={stencilDigited.length === 0 ? true : false}>{t('dashboard:search.button')}</Button>
              </div>

            </CardContent>
          </Card>

          {/*Card da quantidade de ciclos*/}
          <Card className="bg-slate-50">
            <CardHeader>
              <div className="flex items-center justify-center">
                <CardTitle className="text-lg sm:text-xl text-blue-400 font-bold">
                  {t('dashboard:cycles.title')}
                </CardTitle>
                <RefreshCcw className="ml-auto w-6 h-6 text-blue-400" />
              </div>
              <CardDescription>
                {t('dashboard:cycles.description')}
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
                  {t('dashboard:status.title')}
                </CardTitle>
                <ChartColumnIncreasing className="ml-auto w-6 h-6 text-blue-400" />
              </div>
              <CardDescription>
                {t('dashboard:status.description')}
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
                  {t('dashboard:lastMeasurement.title')}
                </CardTitle>
                <Calendar className="ml-auto w-6 h-6 text-blue-400" />
              </div>
              <CardDescription>
                {t('dashboard:lastMeasurement.description')}
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
                  {t('dashboard:lastPoints.title')}
                </CardTitle>
                <Diameter className="ml-auto w-6 h-6 text-blue-400" />
              </div>
              <CardDescription>
                {t('dashboard:lastPoints.description')}
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
                  {t('dashboard:lifeLimit.title')}
                </CardTitle>
                <SquareActivity className="ml-auto w-6 h-6 text-blue-400" />
              </div>
              <CardDescription>
                {t('dashboard:lifeLimit.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Aqui aparecerá gráfico do limite de vida*/}
              {/* <StencilGraphicLimit/> */}
              {stencil && (
                <Progress value={66} />
              )}
            </CardContent>
          </Card>

          {/*Card do novas medições*/}
          <Card className="bg-slate-50 col-span-2">
            <CardHeader>
              <div className="flex items-center justify-center">
                <CardTitle className="text-lg sm:text-xl text-blue-400 font-bold">
                  {t('dashboard:newMeasurements.title')}
                </CardTitle>
                <SquareActivity className="ml-auto w-6 h-6 text-blue-400" />
              </div>
              <CardDescription>
                {t('dashboard:newMeasurements.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Aqui aparecerá os botoes*/}
              <div className=" flex w-full justify-between gap-2 flex-wrap text-wrap ">
               

                <HoverCard>
                  
                  <HoverCardTrigger asChild>
                    <Button className="bg-blue-400 p-5 text-white w-[30%] hover:opacity-60" onClick={() => handlePage("/pages/stencil_automatic_medition")}>
                      {t('dashboard:newMeasurements.automaticTension')}
                    </Button>

                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="flex items-start space-x-4 flex-col gap-3">
                      <h3 className="font-bold ">{t('dashboard:newMeasurements.tension.title')}</h3>
                      {t('dashboard:newMeasurements.tension.description')}
                    </div>
                  </HoverCardContent>
                </HoverCard>


                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button className="bg-blue-400 p-5 text-white w-[30%] hover:opacity-60" onClick={() => handlePage("/pages/automatic_medition")}>
                      {t('dashboard:newMeasurements.measureScratches')}
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="flex items-start space-x-4 flex-col gap-3">
                      <h3 className="font-bold ">{t('dashboard:newMeasurements.scratches.title')}</h3>
                      {t('dashboard:newMeasurements.scratches.description')}
                    </div>
                  </HoverCardContent>
                </HoverCard>

                {stencil ? 
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <PDFDownloadLink
                        document={
                          <StencilReport
                            stencil={stencil}
                            tensionValues={lastStencilValues}
                            lastRobotMedition={lastRobotMedition}
                            arranhoesList = {medicaoAranhao }
                          />
                        }
                        fileName={`Relatorio_Stencil_${stencil?.stencil_id}.pdf`}
                        className="bg-orange-400  text-white w-[25%] hover:opacity-60 p-1.5 rounded"
                      >
                        {({ blob, url, loading, error }) =>
                          loading ? t('dashboard.newMeasurements.generatingReport') : t('dashboard.newMeasurements.generateReport')
                        }
                      </PDFDownloadLink>
                      
                    </HoverCardTrigger>

                    <HoverCardContent>
                      <div className="flex items-start space-x-4 flex-col gap-3">
                        <h3 className="font-bold ">{t('dashboard:newMeasurements.report.title')}</h3>
                        {t('dashboard:newMeasurements.report.description')}
                      </div>
                    </HoverCardContent>
                    
                  </HoverCard>
                  :<div className="w-[30%]"> 01 </div>
                }

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
