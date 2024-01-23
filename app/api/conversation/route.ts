import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import OpenAIAPI from 'openai';
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";

var openaiApiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAIAPI.OpenAI({apiKey: openaiApiKey});



export async function POST(
    req:Request
) {
    try{
        const { userId } = auth()
        const body = await req.json()
        const message = body.messages;
        if (!userId){
            return new NextResponse("Unauthorized", { status: 401 })
        }
        if (!openaiApiKey){
            return new NextResponse("OpenAI API Key nit configured", { status: 500 })
        }
        if (!message){
            return new NextResponse("Message is required", { status: 400 })
        }

        const freeTrial = await checkApiLimit()

        if (!freeTrial){
            return new NextResponse("Free trial has expried.", { status: 403 })
        }

        const response = await openai.chat.completions.create({
            model:  "gpt-3.5-turbo",
            messages: message
        })
        
        await increaseApiLimit()

        return NextResponse.json(response.choices[0].message)

    }catch(error){
        console.log("[Conversation Error]", error)
        return new NextResponse("Internal Error", { status: 500 })
    } 
}