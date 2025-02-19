import { AlertColor } from "@mui/material";

export interface SnackControl{
    alert: AlertColor
    message: string
    openSnackBar: boolean
}

export interface ConfigurationsModel{
    maxLimitTension: string
    limitTension: string
    scratches: string
}