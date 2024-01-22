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

        const response = await openai.images.generate({
            // model:  "dall-e-3",
            n: parseInt(amount, 10), 
            prompt: prompt,
            size: resolution
        })
        console.log("[Conversation Response]",  response.data)
        

        return NextResponse.json(response.data)

    }catch(error){
        console.log("[Image Error]", error)
        return new NextResponse("Internal Error", { status: 500 })
    } 
}