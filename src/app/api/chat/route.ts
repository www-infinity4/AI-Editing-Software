import { NextRequest, NextResponse } from "next/server";
import { ChatRequest, ChatResponse } from "@/lib/types";

/**
 * AI chat endpoint.
 *
 * This route handles the conversational AI interface. In production this would
 * call an actual LLM (e.g. OpenAI, Anthropic, or a self-hosted model). The
 * mock implementation below returns contextual responses based on the conversation
 * so the UI is fully functional end-to-end without requiring API keys.
 *
 * To integrate a real LLM, replace the `generateMockResponse` function with a
 * call to your preferred AI provider.
 */
export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { messages, mode, fileNames } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 }
      );
    }

    const lastUserMessage =
      messages.filter((m) => m.role === "user").at(-1)?.content ?? "";

    const response = generateMockResponse(
      lastUserMessage,
      messages.length,
      mode,
      fileNames
    );

    return NextResponse.json(response satisfies ChatResponse);
  } catch {
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// Mock AI response generator – replace with real LLM integration
// ---------------------------------------------------------------------------

function generateMockResponse(
  userMessage: string,
  messageCount: number,
  mode: "video" | "game",
  fileNames: string[]
): ChatResponse {
  const lower = userMessage.toLowerCase();
  const hasFiles = fileNames.length > 0;
  const fileList =
    fileNames.length > 0 ? fileNames.join(", ") : "no files uploaded yet";

  // Detect if the user is confirming / ready to proceed
  const isConfirming =
    lower.includes("yes") ||
    lower.includes("perfect") ||
    lower.includes("go ahead") ||
    lower.includes("start") ||
    lower.includes("proceed") ||
    lower.includes("do it") ||
    lower.includes("confirm") ||
    lower.includes("let's go") ||
    lower.includes("sure");

  if (!hasFiles && messageCount <= 2) {
    const modeLabel = mode === "video" ? "video" : "game ROM";
    return {
      message: `Hi! I'm your AI editing assistant. To get started, please upload your ${modeLabel} file(s) using the panel on the left. Once you've uploaded them, tell me exactly what you'd like me to do and I'll produce the result precisely as you describe.`,
      ready: false,
    };
  }

  if (mode === "video") {
    return generateVideoResponse(
      userMessage,
      lower,
      isConfirming,
      fileList,
      messageCount
    );
  } else {
    return generateGameResponse(
      userMessage,
      lower,
      isConfirming,
      fileList,
      messageCount
    );
  }
}

function generateVideoResponse(
  _userMessage: string,
  lower: string,
  isConfirming: boolean,
  fileList: string,
  messageCount: number
): ChatResponse {
  if (isConfirming && messageCount > 4) {
    return {
      message:
        "Great! I have everything I need. Starting the video editing process now. I'll apply all the changes exactly as you described — you can track the progress bar below.",
      ready: true,
    };
  }

  if (
    lower.includes("cut") ||
    lower.includes("trim") ||
    lower.includes("remove")
  ) {
    return {
      message: `Got it — I'll cut/trim the sections you specified from ${fileList}. Can you give me the exact timestamps (e.g. "remove 0:30–1:15") or describe which scenes to remove? Once I have those details I'm ready to process.`,
      ready: false,
    };
  }

  if (
    lower.includes("merge") ||
    lower.includes("combine") ||
    lower.includes("join")
  ) {
    return {
      message: `Perfect. I'll merge the uploaded videos (${fileList}) into a single output in the order you specify. Should I keep the original audio from each clip, or blend them? Any transitions (fade, cut, dissolve)?`,
      ready: false,
    };
  }

  if (
    lower.includes("color") ||
    lower.includes("grade") ||
    lower.includes("bright") ||
    lower.includes("contrast") ||
    lower.includes("saturation")
  ) {
    return {
      message: `Understood — color grading on ${fileList}. I can apply: brightness/contrast adjustments, color temperature, saturation boost, cinematic LUT, or custom color curves. Which style are you going for?`,
      ready: false,
    };
  }

  if (
    lower.includes("subtitle") ||
    lower.includes("caption") ||
    lower.includes("text")
  ) {
    return {
      message: `I'll add subtitles/captions to ${fileList}. Do you have the script/text ready, or should I auto-generate captions from the audio? What font, size, and position do you prefer?`,
      ready: false,
    };
  }

  if (
    lower.includes("music") ||
    lower.includes("audio") ||
    lower.includes("sound") ||
    lower.includes("volume")
  ) {
    return {
      message: `Audio editing noted for ${fileList}. I can adjust volume levels, remove background noise, add music (please upload an audio file), or sync audio to specific scenes. What exactly would you like done?`,
      ready: false,
    };
  }

  if (messageCount >= 6) {
    return {
      message: `I have a clear picture of what you want. Here's my plan for ${fileList}:\n\n• Apply the edits as described in our conversation\n• Maintain original quality where not specified\n• Export in the same format as the input\n\nShall I go ahead and process the video now? Type "yes" or "go ahead" to start.`,
      ready: false,
    };
  }

  return {
    message: `I'm ready to edit ${fileList}. Tell me exactly what you want — for example: cut specific scenes, merge clips, color grade, add subtitles, adjust audio, add effects, change speed, or anything else. The more detail you give me, the more precisely I can match your vision.`,
    ready: false,
  };
}

function generateGameResponse(
  _userMessage: string,
  lower: string,
  isConfirming: boolean,
  fileList: string,
  messageCount: number
): ChatResponse {
  if (isConfirming && messageCount > 4) {
    return {
      message:
        "Excellent! I have all the details I need. Starting the ROM editing process now. I'll generate the new game exactly as described — watch the progress bar below.",
      ready: true,
    };
  }

  if (
    lower.includes("character") ||
    lower.includes("sprite") ||
    lower.includes("skin")
  ) {
    return {
      message: `Got it — I'll modify the character sprites in ${fileList}. Describe which characters to change and what they should look like (appearance, colors, animations). If you're combining characters from multiple ROMs I'll cross-reference the sprite sheets.`,
      ready: false,
    };
  }

  if (lower.includes("level") || lower.includes("map") || lower.includes("world")) {
    return {
      message: `Level editing noted for ${fileList}. I can redesign level layouts, change tile arrangements, reposition enemies/items, or generate entirely new maps. How would you like the levels to differ from the original?`,
      ready: false,
    };
  }

  if (lower.includes("music") || lower.includes("sound") || lower.includes("audio")) {
    return {
      message: `Music/sound modification for ${fileList}. I can swap tracks between games, replace sound effects, adjust tempo, or create new chiptune compositions based on a theme you describe. What changes do you need?`,
      ready: false,
    };
  }

  if (lower.includes("merge") || lower.includes("combine") || lower.includes("crossover")) {
    return {
      message: `Great concept! I'll create a crossover/merge between the uploaded ROMs (${fileList}). I can take characters and story from one game and place them into the engine of another, blending assets while keeping gameplay consistent. Which game's engine should be the base?`,
      ready: false,
    };
  }

  if (lower.includes("difficulty") || lower.includes("balance") || lower.includes("enemy")) {
    return {
      message: `Gameplay balance changes for ${fileList}. I can adjust: enemy stats (HP, damage, speed), player stats, item drop rates, difficulty scaling, and collision boxes. Should I make it easier, harder, or just rebalanced?`,
      ready: false,
    };
  }

  if (messageCount >= 6) {
    return {
      message: `Based on our conversation, here's my plan for the ROM(s) ${fileList}:\n\n• Apply the modifications as discussed\n• Preserve all original gameplay mechanics not specified for change\n• Output a playable ROM file in the original format\n\nReady to process? Type "yes" or "go ahead" to start.`,
      ready: false,
    };
  }

  return {
    message: `I'm ready to edit your game ROM(s): ${fileList}. Tell me what you want — combine characters from multiple games, redesign levels, change music, modify sprites, adjust difficulty, or create a full crossover game. Be as specific as you like!`,
    ready: false,
  };
}
