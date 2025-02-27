
import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';



export default function ProgressoTension() {
  const [activeStep, setActiveStep] = useState(0);
  const [passoFinal,setPassoFinal] = useState("Finalizando...")

  const steps = [
    'Inciando Processo',
    'Tirando fotos',
    'Processando imagens para leitura de dígitos',
    passoFinal,
  ];

  useEffect(() => {
    
    const interval = setInterval(() => {
      setActiveStep((prevActiveStep) => {
        if (prevActiveStep < steps.length - 1) {
          return prevActiveStep + 1; // Avança para o próximo passo
        } else {
          setPassoFinal("Finalizado")
          return prevActiveStep+1; // Mantém no último passo
        }
      });
    }, 10000); // Intervalo de 10 segundos

    return () => clearInterval(interval); // Limpa o intervalo quando o componente é desmontado
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ width: '100%', marginLeft:'5px' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              StepIconProps={{
                sx: {
                  // Estilo para a bolinha (ícone) ativo
                  '&.Mui-active': {
                    color: 'primary.main', // Cor da bolinha ativa
                    fontSize: '3rem', // Tamanho da bolinha ativa
                  },
                  // Estilo para a bolinha (ícone) concluído
                  '&.Mui-completed': {
                    color: 'green', // Cor da bolinha concluída
                    fontSize: '3rem', // Tamanho da bolinha concluída
                  },
                  // Estilo para a bolinha (ícone) inativo
                  '&.Mui-disabled': {
                    color: 'black', // Cor da bolinha inativa
                    fontSize: '3.5rem', // Tamanho da bolinha inativa
                  },
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
    </Box>
  );
}