import { NextRequest, NextResponse } from "next/server";

// Handle CORS preflight requests
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

// Handle POST request to generate meme
export async function POST(request: NextRequest) {
  try {
    const { error } = await request.json();

    if (!error) {
      const response = NextResponse.json({ error: "Error message is required" }, { status: 400 });
      response.headers.set("Access-Control-Allow-Origin", "*");
      return response;
    }

    const roast = await generateRoast(error);
    const memeUrl = await createMemeWithRandomTemplate(roast);

    const response = NextResponse.json({ memeUrl });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    console.error("Meme generation error:", error);
    const response = NextResponse.json({ error: "Failed to generate meme" }, { status: 500 });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  }
}

async function generateRoast(errorText: string): Promise<string> {
  try {
    const errorLower = errorText.toLowerCase();

    if (errorLower.includes("syntax error") || errorLower.includes("unexpected token")) {
      return "One does not simply forget their semicolons and brackets.";
    }

    if (errorLower.includes("undefined") || errorLower.includes("null")) {
      return "Your variables are like my social life - undefined.";
    }

    if (errorLower.includes("permission") || errorLower.includes("access denied")) {
      return "Access denied: even your code doesn't want to work with you.";
    }

    if (errorLower.includes("memory") || errorLower.includes("heap")) {
      return "Your memory management is worse than my ability to remember birthdays.";
    }

    if (errorLower.includes("timeout") || errorLower.includes("timed out")) {
      return "Your code is so slow, Internet Explorer feels sorry for it.";
    }

    if (errorLower.includes("404") || errorLower.includes("not found")) {
      return "404: Developer skills not found.";
    }

    const roasts = [
      "One does not simply fix this bug without crying first.",
      "Your code is so broken, even Stack Overflow is laughing.",
      "This isn't a bug, it's a feature... said no one ever about THIS monstrosity.",
      "I've seen better error handling in a calculator from the 90s.",
      "Your bug is so obvious, even a junior dev would spot it... after laughing for 5 minutes.",
      "This code looks like it was written during a power outage.",
      "Not even ChatGPT could make sense of this error.",
      "Have you tried turning it off and never turning it back on again?",
      "This bug is older than some programming languages.",
      "Your error handling strategy: pretend it doesn't exist.",
    ];

    return roasts[Math.floor(Math.random() * roasts.length)];
  } catch (error) {
    console.error("Roast generation error:", error);
    return "Your code is so broken, I couldn't even roast it properly.";
  }
}

async function createMemeWithRandomTemplate(text: string): Promise<string> {
  try {
    const username = process.env.IMGFLIP_USERNAME || "";
    const password = process.env.IMGFLIP_PASSWORD || "";

    console.log("Username:", username)
    console.log("Password:", password)


    if (!username || !password) {
      throw new Error("Missing Imgflip credentials");
    }

    const memeListRes = await fetch("https://api.imgflip.com/get_memes");
    const memeListData = await memeListRes.json();

    if (!memeListData.success) {
      throw new Error("Failed to fetch meme templates");
    }

    const genZTemplates = memeListData.data.memes.filter((meme: any) =>
      [
        "Drake Hotline Bling",
        "Two Buttons",
        "Change My Mind",
        "Distracted Boyfriend",
        "UNO Draw 25 Cards",
        "Surprised Pikachu",
        "Mocking Spongebob",
        "Is This A Pigeon",
        "Roll Safe Think About It",
        "One Does Not Simply",
        "This Is Fine",
        "Waiting Skeleton",
        "Left Exit 12 Off Ramp",
        "Boardroom Meeting Suggestion",
      ].includes(meme.name),
    );

    if (genZTemplates.length === 0) {
      const fallbackTemplate = memeListData.data.memes.find((meme: any) => meme.name === "One Does Not Simply");
      if (!fallbackTemplate) {
        throw new Error("Could not find any suitable meme templates");
      }
      genZTemplates.push(fallbackTemplate);
    }

    const selected = genZTemplates[Math.floor(Math.random() * genZTemplates.length)];

    const formData = new URLSearchParams({
      template_id: selected.id,
      username,
      password,
      text0: "Bug Detected",
      text1: text,
    });

    const response = await fetch("https://api.imgflip.com/caption_image", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    const data = await response.json();

    if (!data.success) {
      console.error("Imgflip API error:", data.error_message);
      throw new Error(data.error_message || "Failed to generate meme");
    }

    return data.data.url;
  } catch (error) {
    console.error("Meme creation error:", error);
    throw new Error("Failed to generate meme with Imgflip API");
  }
}
