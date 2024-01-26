import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import OpenAIAPI from 'openai';
import { ChatCompletionSystemMessageParam } from "openai/resources/chat/completions"
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from '@/lib/subscription';

var openaiApiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAIAPI.OpenAI({apiKey: openaiApiKey});

const instructionMessage: ChatCompletionSystemMessageParam = {
    role: "system",
    content: "ou are a code generator. Respond with well-formatted Markdown code snippets. Use code comments to explain your thought process and any important details."
    // content: "You are a code generator. You must answer only in markdown code snippets. Use code comment for explaination.",
};

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
        const isPro = await checkSubscription()

        if (!freeTrial && !isPro){
            return new NextResponse("Free trial has expried.", { status: 403 })
        }

        const response = await openai.chat.completions.create({
            model:  "gpt-3.5-turbo",
            messages: [instructionMessage, ...message]
        })
        
        if(!isPro){
            await increaseApiLimit()
        }

        return NextResponse.json(response.choices[0].message)

    }catch(error){
        console.log("[Code Error]", error)
        return new NextResponse("Internal Error", { status: 500 })
    } 
}