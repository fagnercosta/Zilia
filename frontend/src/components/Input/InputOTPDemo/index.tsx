import React, { useState } from "react"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"


interface Props {
    value: string
    onChangeValue: (e: string) => void
    isScratches?: boolean
}

export function InputOTPDemoSmart({ onChangeValue, value, isScratches }: Props) {

    return (
        <div>
            <InputOTP
                maxLength={6}
                value={value}
                onChange={(e) => onChangeValue(e)}
            >
                <InputOTPGroup>
                    <InputOTPSlot
                        index={0}
                    />
                    <InputOTPSlot
                        index={1}
                    />
                    {isScratches && (
                        <>
                            <InputOTPSlot
                                index={2}
                            />
                            <InputOTPSlot
                                index={3}
                            />
                        </>
                    )}
                </InputOTPGroup>
            </InputOTP>
        </div>
    )
}
