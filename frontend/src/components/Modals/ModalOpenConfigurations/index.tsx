"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SnackControl } from "@/types/utils"
import { Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useState } from "react"
import { useTranslation } from "react-i18next"

interface Props {
    setSnackControl: Dispatch<SetStateAction<SnackControl>>
}

export function ModalOpenConfigurations({ setSnackControl }: Props) {
    const { t } = useTranslation('configuration');
    const [password, setPassword] = useState("")
    const router = useRouter()

    const loginMethod = () => {
        if (password === "admin") {
            setSnackControl({
                alert: "success",
                message: t('modal.correctPassword'),
                openSnackBar: true
            })
            router.push("/pages/configurations")
        } else {
            setSnackControl({
                alert: "error",
                message: t('modal.incorrectPassword'),
                openSnackBar: true
            })
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <span className="">{t('modal.title')}</span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]" >
                <DialogHeader >
                    <DialogTitle className="text-[28px]">
                        {t('modal.subtitle')}
                    </DialogTitle>
                    <DialogDescription className="text-[18px]">
                        {t('modal.description')}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            defaultValue="Pedro Duarte"
                            className="col-span-3"
                        />
                    </div> */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-center text-[18px]">
                            {t('modal.password')}
                        </Label>
                        <Input
                            id="username"
                            className="col-span-3"
                            type="password"
                            value={password}
                            onChange={(e)=> setPassword(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" className="bg-blue-400" onClick={loginMethod}>{t('modal.advance')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
