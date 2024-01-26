"use client"

import { useEffect } from "react"
import { Crisp } from "crisp-sdk-web"

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("cb148785-401d-4e57-abba-f1912fd33215")
    }, [])

    return null
}