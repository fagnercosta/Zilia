import { Alert, AlertColor, Snackbar } from "@mui/material"
import React from "react"
import { Button } from "../ui/button"
import IconButton from '@mui/material/IconButton';
import { CircleX } from "lucide-react";


interface Props {
    openSnackBar: boolean
    handleClose: () => void
    messageSnack: string
    alert: AlertColor
}

const SnackBarControl = ({
    handleClose,
    messageSnack,
    openSnackBar,
    alert
}: Props) => {

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
        <Snackbar
            open={openSnackBar}
            autoHideDuration={6000}
            onClose={handleClose}
            message={messageSnack}

            action={action}
        >
            <Alert
                onClose={handleClose}
                severity={alert}
                variant="standard"
                sx={{ width: '100%' }}

            >
                {messageSnack}
            </Alert>
        </Snackbar>
    )
}


export default SnackBarControl