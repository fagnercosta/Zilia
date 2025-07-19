"use client";

import React, { useCallback, useEffect, useState } from "react";
import cookie from "cookie";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { SelectHistory } from "@/components/Select/SelectHistory";
import { Stencil, Arranhaos,StencilTensionValues } from "@/types/models";
import axios from "axios";
import { BASE_URL } from "@/types/api";
import {
    Alert,
    AlertColor,
    Grid,
    LinearProgress,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from "@mui/material";
import { Button } from "@/components/ui/button";
import { CirclePlus, Search } from "lucide-react";
import { formatDateTime } from "@/functions/functions";
import Link from "next/link";
import { useTranslation } from 'react-i18next';

// Colunas da Tabela
const getColumns = (t: any) => [
    { label: t('stencil:scratchList.columns.scratchCount'), minWidth: 50 },
    { label: t('stencil:scratchList.columns.date'), minWidth: 100 }
];

export default function ListStencilMedition() {
    const { t } = useTranslation(['stencil', 'common']);
    const columns = getColumns(t);
    const router = useRouter();
    const [stencils, setStencils] = useState<Stencil[]>([]);
    const [arranhoes,setArranhoes] = useState<Arranhaos[]>([]);
    const [selectedStencil, setSelectedStencil] = useState<Stencil | null>(null);
    const [loadingValues, setLoadingValues] = useState(false);
    const [tensionValues, setTensionValues] = useState<StencilTensionValues[]>([]);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [message, setMessage] = useState("");
    const [typeMessage, setTypeMessage] = useState<AlertColor>("success");

    // Estados de paginação
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackBar(false);
    };

    const handleLogout = useCallback(() => {
        document.cookie = cookie.serialize("authToken", "", {
            httpOnly: false,
            secure: process.env.NODE_ENV !== "development",
            maxAge: -1,
            path: "/"
        });
        router.push("/login");
    }, [router]);

    const getStencils = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/stencil/`);
            if (response) {
                setStencils(response.data.results);
            }
        } catch (error: any) {
            console.error(error);
        }
    };

    useEffect(() => {
        getStencils();
    }, []);

    const handleStencilValuePoints = async (stencil_identification: any) => {
        setLoadingValues(true);

        setTimeout(async () => {
            try {
                const responseValues = await axios.get(
                    `${BASE_URL}/api/processed-images-by-stencil/?stencil_id=${stencil_identification}`
                );

                //setTensionValues(responseValues.data.results);
                setArranhoes(responseValues.data.results)
                setMessage(responseValues.data.results.length > 0 ? t('stencil:scratchList.messages.found') : t('stencil:scratchList.messages.notFound'));
                setTypeMessage(responseValues.data.results.length > 0 ? "success" : "warning");
                setOpenSnackBar(true);
            } catch (error: any) {
                setMessage(t('stencil:scratchList.messages.error'));
                setTypeMessage("error");
                setOpenSnackBar(true);
            } finally {
                setLoadingValues(false);
            }
        }, 1200);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <main className="lg:ml-[23rem] p-4">
            <Sidebar logouFunction={handleLogout} />
            <div className="flex flex-col min-h-screen relative">
                <header className="w-full h-2 p-5 flex items-center justify-start">
                    <h1 className="text-4xl font-bold">{t('stencil:scratchList.title')}</h1>
                </header>
                <section className="w-full h-auto p-5 flex items-center">
                    <SelectHistory stencils={stencils} selectedStencil={selectedStencil} setSelectedStencil={setSelectedStencil} />
                    <Button
                        className="h-[50px] ml-4 bg-blue-400 flex gap-2 font-bold hover:opacity-60"
                        onClick={() => handleStencilValuePoints(selectedStencil?.stencil_id)}
                        disabled={selectedStencil === null ? true : false}

                    >
                        {t('stencil:scratchList.searchButton')}
                        <Search className="w-5 h-5" />
                    </Button>
                    <section className="ml-auto flex gap-2">
                

                        <Link href={"/pages/automatic_medition"} className="h-[50px]  bg-yellow-400  gap-2 rounded-[6px] px-2 text-white font-bold hover:opacity-60 flex items-center">
                            {t('stencil:scratchList.automaticMeasurement')}
                            <CirclePlus className="w-5 h-5" />
                        </Link>
                    </section>
                </section>
                <section className="w-full p-5">
                    <TableContainer component={Paper}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {columns.map((column, index) => (
                                        <TableCell key={index} style={{ fontWeight: "bold" }}>
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loadingValues ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length}>
                                            <Typography variant="h6">{t('common:app.loading')}</Typography>
                                            <LinearProgress color="info" />
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    arranhoes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.scratch_count}</TableCell>
                                            <TableCell>{formatDateTime(item.timestamp)}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component="div"
                        count={tensionValues.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage={t('common:pagination.rowsPerPage')}
                        labelDisplayedRows={({ from, to, count }) => `${from}–${to} ${t('common:pagination.of')} ${count} ${t('common:pagination.records')}`}
                    />
                </section>
            </div>
        </main>
    );
}
