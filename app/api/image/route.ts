import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import OpenAIAPI from 'openai';
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from '@/lib/subscription';

var openaiApiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAIAPI.OpenAI({apiKey: openaiApiKey});


export async function POST(
    req:Request
) {
    try{
        const { userId } = auth()
        const body = await req.json()
        const { prompt, amount = 1, resolution = "512x512" } = body;
        if (!userId){
            return new NextResponse("Unauthorized", { status: 401 })
        }
        if (!openaiApiKey){
            return new NextResponse("OpenAI API Key nit configured", { status: 500 })
        }
        if (!prompt){
            return new NextResponse("Prompt is required", { status: 400 })
        }
        if (!amount){
            return new NextResponse("Amount is required", { status: 400 })
        }
        if (!resolution){
            return new NextResponse("Resolution is required", { status: 400 })
        }
        const freeTrial = await checkApiLimit()
        const isPro = await checkSubscription()

        if (!freeTrial && !isPro){
            return new NextResponse("Free trial has expried.", { status: 403 })
        }

        const response = await openai.images.generate({
            n: parseInt(amount, 10), 
            prompt: prompt,
            size: resolution
        })
        
        if(!isPro){
            await increaseApiLimit()
        }

        return NextResponse.json(response.data)

    }catch(error){
        console.log("[Image Error]", error)
        return new NextResponse("Internal Error", { status: 500 })
    } 
}