import * as React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import AlertTitle from '@mui/material/AlertTitle';
import { AlertColor, AlertProps } from '@mui/material/Alert'; // Importa o tipo AlertColor

// Definição do tipo das props
interface AlertItemProps {
  severity?: AlertColor; // Aceita apenas os valores permitidos
  message?: string;
  variant?: AlertProps['variant'];
  title?: string;
}

export default function AlertItem({ severity = "success", variant = "standard", message = "This is a default alert", title = "Success" }: AlertItemProps) {

  const [open, setOpen] = React.useState(true); // Estado para controlar visibilidade

  return (
    <Stack sx={{ width: '100%', }} spacing={2}>
      {
        open && (
          <Alert

            onClose={() => {  }
            }
            variant={variant}
            severity={severity}
            sx={{ fontSize: '1rem', }}>

            <AlertTitle>{title}</AlertTitle>

            {message}

          </Alert >)
      }
    </Stack >
  );
}
