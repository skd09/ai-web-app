import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import OpenAIAPI from 'openai';
var openaiApiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAIAPI.OpenAI({apiKey: openaiApiKey});

// export { openaiInstance as openai }


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

        const response = await openai.chat.completions.create({
            model:  "gpt-3.5-turbo",
            messages: message
        })
        console.log("[Conversation Response]",  response.choices[0].message)
        

        return NextResponse.json(response.choices[0].message)

    }catch(error){
        console.log("[Conversation Error]", error)
        return new NextResponse("Internal Error", { status: 500 })
    } 
}