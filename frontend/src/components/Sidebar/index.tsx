
import { Activity, BadgeCheck, ChevronDown, ChevronUp, ClipboardMinus, FileChartColumn, FileClock, LogOut, PanelBottom, Settings } from "lucide-react"
import Link from "next/link"
import Logo from "../../assets/logo.png"
import Image from "next/image"
import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { Button } from "../ui/button"
import { ModalOpenConfigurations } from "../Modals/ModalOpenConfigurations"
import SnackBarControl from "../SnackBarControl"
import { SnackControl } from "@/types/utils"
import InovaBottomImage from "../InovaBottomImage"

interface Props {
    logouFunction?: () => void
}

const Sidebar = ({ logouFunction }: Props) => {

    

    const [isOpen, setIsOpen] = useState(false)

    const [snackControl, setSnackControl] = useState<SnackControl>({
        alert: "success",
        message: "",
        openSnackBar: false
    })

    function logoutFunction() {

        console.log("AQUI SAINDO")
        
        localStorage.removeItem('token');
        localStorage.removeItem('tokenTimestamp');
        
    }

    return (
        <div className="flex w-full flex-col bg-muted/40 ">
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-[22rem] border-r bg-slate-50 sm:flex flex-col">
                <header className="w-full h-auto gap-3 bg-blue-400 p-4 flex flex-col items-center justify-evenly">
                    <Image
                        src={Logo}
                        alt="LogoHome"
                        className="w-[120px] h-[120px] object-cover"
                    />
                    <h1 className="text-4xl font-bold text-white">StencilVision</h1>
                </header>
                <nav className="flex flex-col items-start gap-4 px-3 py-5">
                    <Link
                        href={"/"}
                        className="flex h-9 w-auto items-center text-muted-foreground text-lg gap-3 hover:opacity-60"
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-blue-400 text-primary-foreground rounded-full">
                            <PanelBottom className="h-4 w-4" />
                        </div>
                        <span className="">Painel de controle</span>
                    </Link>
                    <Link
                        href={"/pages/list_stencil_medition"}
                        className="flex h-9 w-auto items-center text-muted-foreground text-lg gap-3 hover:opacity-60"
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-blue-400 text-primary-foreground rounded-full">
                            <FileClock className="h-4 w-4" />
                        </div>
                        <span className="">Medições de Tensão</span>
                    </Link>

                    <Link
                        href={"/pages/list_stencil_scracth"}
                        className="flex h-9 w-auto items-center text-muted-foreground text-lg gap-3 hover:opacity-60"
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-blue-400 text-primary-foreground rounded-full">
                            <FileClock className="h-4 w-4" />
                        </div>
                        <span className="">Medições de Arranhões</span>
                    </Link>

                    

                    <Collapsible
                        open={isOpen}
                        onOpenChange={setIsOpen}
                        className="w-[350px] space-y-2"
                    >
                        <CollapsibleTrigger asChild>
                            <div className="flex h-9 w-auto items-center text-muted-foreground text-lg gap-3 hover:opacity-60 hover:cursor-pointer">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-blue-400 text-primary-foreground rounded-full">
                                    <ClipboardMinus className="h-4 w-4" />
                                </div>
                                <span className="">Modo manual</span>
                                {!isOpen
                                    ? <ChevronDown className="h-5 w-5 " />
                                    : <ChevronUp className="h-5 w-5 " />}
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="w-full p-5 flex flex-col gap-8">
                                <Link
                                    href={"/pages/stencil_medition"}
                                    className="flex h-9 w-auto items-center text-muted-foreground text-lg gap-3 hover:opacity-60"
                                >
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-blue-400 text-primary-foreground rounded-full">
                                        <Activity className="h-4 w-4" />
                                    </div>
                                    <span className="w-[60%]">Medição de tensão</span>
                                </Link>
                                

                                
                                {/* <Link
                                    href={"/pages/list_stencil_medition"}
                                    className="flex h-9 w-auto items-center text-muted-foreground text-lg gap-3 hover:opacity-60"
                                >
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-blue-400 text-primary-foreground rounded-full">
                                        <BadgeCheck className="h-4 w-4" />
                                    </div>
                                    <span className="w-[60%]">Formulário de verificação</span>
                                </Link>
                                 */}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                    <Link
                                    href={"/pages/users"}
                                    className="flex h-9 w-auto items-center text-muted-foreground text-lg gap-3 hover:opacity-60"
                                >
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-blue-400 text-primary-foreground rounded-full">
                                        <FileClock className="h-4 w-4" />
                                    </div>
                                    <span className="">Usuários</span>
                                </Link>

                    <div
                        className="flex h-9 w-auto items-center text-muted-foreground text-lg gap-3 hover:opacity-60 cursor-pointer"
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-blue-400 text-primary-foreground rounded-full">
                            <Settings className="h-4 w-4" />
                        </div>
                        <ModalOpenConfigurations setSnackControl={setSnackControl} />

                    </div>
                </nav>
                <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-5">
                        
                            
                        
                    <div
                        className="flex h-9 w-auto shrink-0 items-center justify-center gap-3 rounded-lg text-red-600 transition-colors hover:text-foreground hover: cursor-pointer"
                        onClick={logouFunction}
                    >
                        
                        
                        <LogOut className="h-5 w-5" />
                        <span className="">Sair</span>
                    </div>

                    <InovaBottomImage />
                </nav>
            </aside>

            <SnackBarControl
                alert={snackControl.alert}
                handleClose={() => setSnackControl({ ...snackControl, openSnackBar: false })}
                messageSnack={snackControl.message}
                openSnackBar={snackControl.openSnackBar}
            />
        </div>
    )
}

export default Sidebar