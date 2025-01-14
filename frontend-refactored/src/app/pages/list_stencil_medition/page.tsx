"use client"

import React, { useCallback, useEffect, useState } from "react";
import cookie from 'cookie';
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { SelectHistory } from "@/components/Select/SelectHistory";
import { Stencil, StencilTensionValues } from "@/types/models";
import axios from "axios";
import { BASE_URL } from "@/types/api";
import { Alert, AlertColor, Grid, IconButton, LinearProgress, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { Button } from "@/components/ui/button";
import { CirclePlus, CircleX, Search } from "lucide-react";
import { formatDateTime } from "@/functions/functions";
import Link from "next/link";
import InovaBottomImage from "@/components/InovaBottomImage";


const columns = [
    { label: 'P1', minWidth: 50 },
    { label: 'P2', minWidth: 50 },
    { label: 'P3', minWidth: 50 },
    { label: 'P4', minWidth: 50 },
    { label: 'Ciclos', minWidth: 50 },
    { label: 'Data da medição', minWidth: 100 },

];

export default function ListStencilMedition() {

    const router = useRouter()
    const [stencils, setStencils] = useState<Stencil[]>([])
    const [selectedStencil, setSelectedStencil] = useState<Stencil | null>(
        null
    )
    const [loadingValues, setLoadingValues] = useState(false)
    const [tensionValues, setTensionValues] = useState<StencilTensionValues[]>([])
    const [openSnackBar, setOpenSnackBar] = useState(false)
    const [message, setMessage] = useState("")
    const [typeMessage, setTypeMessage] = useState<AlertColor>("success")
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
    };

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

    const getStencils = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/stencil/`)
            if (response) {
                console.log(response)
                setStencils(response.data.results)
            }
        } catch (error: any) {
            console.log(error)
        }
    }

    useEffect(() => {
        getStencils()
    }, [])

    const handleStencilValuePoints = async (stencil_identification: any) => {
        setLoadingValues(true)

        const timeout = setTimeout(async () => {
            try {
                const responseValues = await axios.get(`http://127.0.0.1:8000/api/stencilTensionValues/?stencil_identification=${stencil_identification}`)
                console.log(responseValues.data.results)
                setTensionValues(responseValues.data.results)

                if (responseValues && responseValues.data.results.length > 0) {
                    setMessage("Medições encontradas!")
                    setTypeMessage("success")
                    setOpenSnackBar(true);
                    setLoadingValues(false)
                } else {
                    setMessage("Não foram encontrados medições para este Stencil!")
                    setTypeMessage("warning")
                    setOpenSnackBar(true);
                    setLoadingValues(false)
                }
            } catch (error: any) {
                if (error.response.status === 404) {
                    // Erro 404 - não encontrado
                    setMessage('Stencil não encontrado.');
                    setOpenSnackBar(true);
                    setLoadingValues(false)
                }
            }
        }, 1200)

        return () => clearTimeout(timeout)
    }

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
            <div className="flex flex-col min-h-screen relative">
                <InovaBottomImage/>
                <header className="w-full h-2 p-5 flex items-center justify-start">
                    <h1 className="text-4xl font-bold">Histórico de medições</h1>
                </header>
                <section className="w-full h-auto p-5 items-center justify-start flex">
                    <SelectHistory
                        stencils={stencils}
                        selectedStencil={selectedStencil}
                        setSelectedStencil={setSelectedStencil}
                    />
                    <Button className="h-[50px] ml-4 bg-blue-400 flex gap-2 font-bold hover:opacity-60" onClick={() => handleStencilValuePoints(selectedStencil?.stencil_id)}>
                        BUSCAR
                        <Search className="w-5 h-5" />
                    </Button>
                    <Link href={"/pages/stencil_medition"} className="h-[50px] ml-auto bg-blue-400 flex gap-2 rounded-[6px] justify-end items-center px-2 text-white font-bold hover:opacity-60">
                        REALIZAR UMA NOVA MEDIÇÃO
                        <CirclePlus className="w-5 h-5" />
                    </Link>

                </section>
                <section className="w-full p-5 items-center justify-center">
                    <TableContainer component={Paper}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column, index) => (
                                        <TableCell key={index} style={{ width: `${100 / columns.length}%`, backgroundColor: "rgb(96, 165, 250)", color: "white", fontWeight: "bold" }}>
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loadingValues ?
                                    <TableRow>
                                        <TableCell>
                                            <Grid item xs={12} md={12} lg={12}>
                                                <div style={{
                                                    width: 400,
                                                }}>
                                                    <Typography variant="h6" color="#121212">Carregando...</Typography>
                                                    <LinearProgress color="info" />
                                                </div>
                                            </Grid>
                                        </TableCell>
                                    </TableRow>
                                    :
                                    tensionValues.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.p1}</TableCell>
                                            <TableCell>{item.p2}</TableCell>
                                            <TableCell>{item.p3}</TableCell>
                                            <TableCell>{item.p4}</TableCell>
                                            <TableCell>{item.cicles}</TableCell>
                                            <TableCell>{formatDateTime(item.measurement_datetime)}</TableCell>

                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    /> */}
                    <Snackbar
                        open={openSnackBar}
                        autoHideDuration={4000}
                        action={action}
                        onClose={handleClose}
                        message={message}

                    >
                        <Alert
                            onClose={handleClose}
                            severity={typeMessage}
                            variant="standard"
                            sx={{ width: '100%' }}

                        >
                            {message}
                        </Alert>
                    </Snackbar>
                </section>
            </div>
        </main>
    )
}