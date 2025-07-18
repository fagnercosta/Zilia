"use client";

import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BASE_URL } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  AlertColor,
  Button,
  Checkbox,
  Grid,
  Snackbar,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email("E-mail inválido"),
  first_name: z.string().min(2, "Mínimo 2 caracteres"),
  last_name: z.string().min(2, "Mínimo 2 caracteres"),
  password: z
    .string()
    .optional()
    .refine(
      (val) => val === undefined || val === "" || val.length >= 6,
      "A senha deve ter pelo menos 6 caracteres"
    ),
  is_active: z.boolean().default(true),
  super_user: z.boolean().default(false),
});

type FormData = z.infer<typeof userSchema>;

export default function EditarUsuario({ params }: { params: { id: string } }) {
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [alert, setAlert] = useState<AlertColor>("success");
  const [message, setMessage] = useState("");
  const navigate = useRouter();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      is_active: true,
      super_user: false,
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}users/${params.id}/`);
        const { password, ...userWithoutPassword } = response.data; // remove a senha
        reset(userWithoutPassword); // preenche o form sem a senha
      } catch (error) {
        setMessage("Erro ao carregar os dados do usuário.");
        setAlert("error");
        setOpenSnackBar(true);
      }
  };

  fetchUser();
}, [params.id, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      // Se senha estiver vazia, remove antes de enviar
      const payload = { ...data };
      if (!payload.password?.trim()) {
        delete payload.password;
      }

      await axios.put(`${BASE_URL}users/${params.id}/`, payload);

      setMessage("Usuário atualizado com sucesso!");
      setAlert("success");
      setOpenSnackBar(true);
      navigate.push("/pages/users");
    } catch (error) {
      setMessage("Erro ao atualizar o usuário.");
      setAlert("error");
      setOpenSnackBar(true);
    }
  };

  return (
    <main className="lg:ml-72 p-4">
      <Sidebar />
      <div className="w-full h-[80vh] flex flex-col items-center justify-center">
        <Card className="w-[90%] bg-slate-50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Editar Usuário</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={4}>
                  <Controller
                    name="first_name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Primeiro Nome"
                        error={!!errors.first_name}
                        helperText={errors.first_name?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  <Controller
                    name="last_name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Último Nome"
                        error={!!errors.last_name}
                        helperText={errors.last_name?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="E-mail"
                        type="email"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Senha"
                        type="password"
                        autoComplete="new-password"  // <-- aqui
                        error={!!errors.password}
                        helperText={errors.password?.message || "Deixe em branco para manter a senha atual"}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={3} sm={12} md={3}>
                  <Controller
                    name="is_active"
                    control={control}
                    render={({ field }) => (
                      <Checkbox {...field} checked={field.value} />
                    )}
                  />
                  Usuário Ativo
                </Grid>
                <Grid item xs={3} sm={12} md={3}>
                  <Controller
                    name="super_user"
                    control={control}
                    render={({ field }) => (
                      <Checkbox {...field} checked={field.value} />
                    )}
                  />
                  Administrador
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    Atualizar
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </div>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackBar(false)}
        message={message}
      >
        <Alert
          onClose={() => setOpenSnackBar(false)}
          severity={alert}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </main>
  );
}
