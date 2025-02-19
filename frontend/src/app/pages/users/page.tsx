"use client"; // Adicione esta linha no topo do arquivo

import React, { useCallback, useEffect, useState } from "react";
import cookie from 'cookie';
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { SelectHistory } from "@/components/Select/SelectHistory";
import { Stencil, StencilTensionValues, UsersTipe } from "@/types/models";
import axios from "axios";
import { BASE_URL } from "@/types/api";
import { Alert, AlertColor, Grid, IconButton, LinearProgress, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { Button } from "@/components/ui/button";
import { CirclePlus, CircleX, Search } from "lucide-react";
import { formatDateTime } from "@/functions/functions";
import Link from "next/link";
const columns = [
    { label: 'Primeiro Nome', minWidth: 50 },
    { label: 'E-mail', minWidth: 50 },
];

export default function Users() {
    const router = useRouter();
    const [stencils, setStencils] = useState<Stencil[]>([]);
    const [selectedStencil, setSelectedStencil] = useState<Stencil | null>(null);
    const [loadingValues, setLoadingValues] = useState(false);
    const [users, setUsers] = useState<UsersTipe[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);  // Variável para o total de usuários
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [message, setMessage] = useState("");
    const [typeMessage, setTypeMessage] = useState<AlertColor>("success");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
    };

    const handleLogout = useCallback(() => {
        document.cookie = cookie.serialize('authToken', '', {
            httpOnly: false,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: -1,
            path: '/',
        });
        router.push('/pages/login');
    }, [router]);

    const getUsers = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/users/`);
            if (response) {
                setUsers(response.data.results || []);  // Garantir que os dados sejam corretos
                setTotalUsers(response.data.count || 0);  // Definindo o total de usuários para a paginação
            }
        } catch (error: any) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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
            <div className="flex flex-col min-h-screen">
                <section className="w-full h-auto p-5 items-center justify-start flex">
                    <Link href={"/pages/cadastro_user"} className="h-[50px] ml-auto bg-blue-400 flex gap-2 rounded-[6px] justify-end items-center px-2 text-white font-bold hover:opacity-60">
                        Cadastrar Novo Usuário
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
                                {loadingValues ? (
                                    <TableRow>
                                        <TableCell>
                                            <Grid item xs={12} md={12} lg={12}>
                                                <div style={{ width: 400 }}>
                                                    <Typography variant="h6" color="#121212">Carregando...</Typography>
                                                    <LinearProgress color="info" />
                                                </div>
                                            </Grid>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.first_name}</TableCell>
                                            <TableCell>{item.email}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component="div"
                        count={totalUsers}  // Usando a variável totalUsers
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                    <Snackbar
                        open={openSnackBar}
                        autoHideDuration={4000}
                        action={action}
                        onClose={handleClose}
                        message={message}
                    >
                        <Alert onClose={handleClose} severity={typeMessage} variant="standard" sx={{ width: '100%' }}>
                            {message}
                        </Alert>
                    </Snackbar>
                </section>
            </div>
        </main>
    );
}
