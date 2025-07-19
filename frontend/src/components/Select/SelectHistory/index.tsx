"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Stencil } from "@/types/models"
import { useTranslation } from 'react-i18next'

type Status = {
    value: string
    label: string
}

const statuses: Status[] = [
    {
        value: "backlog",
        label: "Backlog",
    },
    {
        value: "todo",
        label: "Todo",
    },
    {
        value: "in progress",
        label: "In Progress",
    },
    {
        value: "done",
        label: "Done",
    },
    {
        value: "canceled",
        label: "Canceled",
    },
]

interface Props {
    stencils: Stencil[]
    selectedStencil: Stencil | null
    setSelectedStencil: any
    
}

export function SelectHistory({ stencils, setSelectedStencil, selectedStencil }: Props) {
    const { t } = useTranslation('stencil');
    const [open, setOpen] = React.useState(false)
    //   const isDesktop = useMediaQuery("(min-width: 768px)")
    

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-[30%] justify-start h-[50px]">
                    {selectedStencil ? <>{selectedStencil.stencil_part_nbr}</> : <>{t('selectStencil')}</>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                    <CommandInput placeholder={t('common:app.search') + '...'} />
                    <CommandList>
                        <CommandEmpty>{t('manual.noStencils')}</CommandEmpty>
                        <CommandGroup>
                            {stencils.map((status) => (
                                <CommandItem
                                    key={status.stencil_id}
                                    value={status.stencil_part_nbr.toString()}
                                    onSelect={(value: any) => {
                                        setSelectedStencil(
                                            stencils.find((priority) => priority.stencil_part_nbr.toString().toLowerCase().includes(String(value).toLowerCase())) || null
                                        )
                                        setOpen(false)
                                    }}
                                >
                                    {status.stencil_part_nbr}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )

    //   return (
    //     <Drawer open={open} onOpenChange={setOpen}>
    //       <DrawerTrigger asChild>
    //         <Button variant="outline" className="w-[150px] justify-start">
    //           {selectedStatus ? <>{selectedStatus.label}</> : <>+ Set status</>}
    //         </Button>
    //       </DrawerTrigger>
    //       <DrawerContent>
    //         <div className="mt-4 border-t">
    //           <StatusList setOpen={setOpen} setSelectedStatus={setSelectedStatus} />
    //         </div>
    //       </DrawerContent>
    //     </Drawer>
    //   )
}
