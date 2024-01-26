"use client"

import { Zap } from "lucide-react"
import { Button } from "./ui/button"
import axios from "axios"
import { useState } from "react"

interface SubscriptionButtonProps{
    isPro: boolean
}

export const SubscriptionButton = ({
    isPro = false
}: SubscriptionButtonProps) => {
    const [isLoading, setLoading] = useState(false)

    const onClick = async () => {
        try{
            setLoading(true)
            const response = await axios.get("/api/stripe")
            window.location.href = response.data.url
        } catch (error){
            setLoading(false)
            console.log("[BILLING ERROR]", error)
        } finally {
            setLoading(false)
        }
    }

    return(
        <Button
            variant={ isPro ? "default" : "premium"}
            onClick={ onClick }
            disabled = { isLoading }
        >
            { isPro ? "Manage Subscription" : "Upgrade"}
            { !isPro && <Zap className="w-4 h-4 ml-2 fill-white"/> }
        </Button>
    )
}