"use client";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BASE_URL } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertColor, Button, Checkbox, Grid, IconButton, Snackbar, TextField } from "@mui/material";
import axios from "axios";
import { CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useTranslation } from 'react-i18next';

// Definição do esquema de validação com Zod
const createUserSchema = (t: any) => z.object({
  email: z.string().email(t('configuration:users.validation.invalidEmail')),
  first_name: z.string().min(2, t('configuration:users.validation.minChars', { min: 2 })),
  last_name: z.string().min(2, t('configuration:users.validation.minChars', { min: 2 })),
  password: z.string().min(6, t('configuration:users.validation.passwordMinChars', { min: 6 })),
  is_active: z.boolean().default(true),
  super_user: z.boolean().default(false),
});

type FormData = z.infer<ReturnType<typeof createUserSchema>>;

export default function CadastroUser() {
  const { t } = useTranslation(['configuration', 'common']);
  const userSchema = createUserSchema(t);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [alert, setAlert] = useState<AlertColor>("success");
  const [message, setMessage] = useState("");
  const navigate = useRouter();

  const {
    handleSubmit,
    control,
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

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post(`${BASE_URL}create-user/`, data);
      setMessage(t('configuration:users.successMessage'));
      setAlert("success");
      setOpenSnackBar(true);
      navigate.push("/pages/users");
    } catch (error) {
      setMessage(t('configuration:users.errorMessage'));
      setAlert("error");
      setOpenSnackBar(true);
    }
  };
  

  return (
    <main className="lg:ml-72 p-4">
      <Sidebar />
      <div className="w-full h-[80vh] flex flex-col items-center justify-center">
        <Card className="w-[70%] bg-slate-50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{t('configuration:users.registrationTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={4}>
                  <Controller
                    name="first_name"
                    control={control}
                    render={({ field }) => (
                      <TextField size="small"{...field} fullWidth label={t('configuration:users.firstName')} error={!!errors.first_name} helperText={errors.first_name?.message} />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  <Controller
                    name="last_name"
                    control={control}
                    render={({ field }) => (
                      <TextField size="small"{...field} fullWidth label={t('configuration:users.lastName')} error={!!errors.last_name} helperText={errors.last_name?.message} />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField  size="small" {...field} fullWidth label={t('configuration:users.email')} type="email" error={!!errors.email} helperText={errors.email?.message} />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <TextField size="small" {...field} fullWidth label={t('configuration:users.password')} type="password" error={!!errors.password} helperText={errors.password?.message} />
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
                  {t('configuration:users.activeUser')}
                </Grid>
                <Grid item xs={3} sm={12} md={3}>
                  <Controller
                    name="super_user"
                    control={control}
                    render={({ field }) => (
                      <Checkbox {...field} checked={field.value} />
                    )}
                  />
                  {t('configuration:users.administrator')}
                </Grid>
                <Grid item xs={6} sm={12} md={6} style={{ display: "flex", gap: "10px" }}>
                  <Button type="submit" variant="contained" color="primary">
                    {t('configuration:users.register')}
                  </Button>

                  <a 
                    onClick={() => navigate.push("/")}
                    style={{cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "red", color: "white", padding: "10px", paddingLeft:'30px', paddingRight:'30px', borderRadius: "5px"}}>
                    {t('configuration:users.cancel')}
                  </a>
                </Grid>
               
              </Grid>
            </form>
          </CardContent>
        </Card>
      </div>
      <Snackbar open={openSnackBar} autoHideDuration={4000} onClose={() => setOpenSnackBar(false)} message={message}>
        <Alert onClose={() => setOpenSnackBar(false)} severity={alert} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </main>
  );
}
