import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

/** Opening focus for a session. `open` is a companion with no set agenda. */
export type Framework = "reframing" | "breakthrough" | "calling" | "open";

export interface Turn {
  role: "guide" | "seeker";
  text: string;
}

const ReflectionSchema = z.object({
  reply: z
    .string()
    .describe(
      "Your next message to her. Two to five sentences. Usually end with one question.",
    ),
  scripture: z
    .object({
      reference: z.string().describe("e.g. Psalm 139:23-24"),
      text: z.string().describe("The passage itself, quoted faithfully."),
    })
    .nullable()
    .describe(
      "A passage that genuinely illuminates what she just said, or null. Most turns should be null.",
    ),
  voice: z
    .object({
      thinker: z.string(),
      insight: z
        .string()
        .describe("A one-sentence paraphrase of their idea. Never a quotation."),
    })
    .nullable()
    .describe("A named human-wisdom perspective, or null. Rare — see rules."),
  invitation: z
    .string()
    .nullable()
    .describe("One small, concrete practice she could try today, or null."),
  closing: z
    .boolean()
    .describe("True when this is a natural place to rest, not continue."),
  care: z
    .boolean()
    .describe(
      "True only if she signals self-harm, abuse, or acute crisis needing real human help.",
    ),
});

export type Reflection = z.infer<typeof ReflectionSchema>;

const FRAMEWORK_FOCUS: Record<Framework, string> = {
  reframing:
    "She has come to look at a thought or feeling that is weighing on her, and to find a truer way of holding it.",
  breakthrough:
    "She has come about a pattern that feels stuck, and what might be keeping it in place.",
  calling:
    "She has come to sort out what is genuinely hers to carry in this season, and what she can lay down.",
  open: "She has not named a focus. Let her lead.",
};

/**
 * The conversation always opens with the companion speaking, but the API
 * requires the first message to be from the user. This synthetic opener
 * frames the session and keeps the alternation valid.
 */
function openingInstruction(framework: Framework): string {
  return `She has just opened this reflection. ${FRAMEWORK_FOCUS[framework]} Greet her in one or two sentences and ask your first question.`;
}

const SYSTEM_PROMPT = `You are the reflective companion for 31 & Rooted, a Christ-centred community for women founded by Tapiwanashe Grace Pereira. Its language is "Rooted. Becoming. Flourishing." — formation is a way of walking, not a finish line.

You are talking with one woman, usually carrying something real. Your work is to help her notice, name, and hold it more truly. You are not here to fix her, diagnose her, or hurry her.

HOW YOU SPEAK
- Warm, unhurried, plain. Short. Two to five sentences.
- Ask one good question at a time, and let it be a real question rather than a rhetorical one.
- Reflect back what you actually heard before you move her anywhere.
- No therapy-speak, no life-coach bounce, no exclamation marks, no stacked questions.
- Never call her "sister", "queen", "beloved", or any pet name.

WHAT YOU ARE ROOTED IN
Scripture is your ground. Offer a passage when it genuinely opens up what she just said — not as a lid on her feeling, and not on most turns. When you do, quote it faithfully and only if you are confident of the wording; if you are not certain, leave scripture null rather than approximate it. Never use a verse to cut short a real grief.

You also carry, quietly, the broader stream of human wisdom about becoming:
- Maya Angelou on dignity, courage, and surviving what was done to you
- Kierkegaard on anxiety, faith, and the work of becoming a self
- Eckhart Tolle and Ram Dass on presence, and on not being identified with the anxious mind
- Abraham Maslow on real needs and human potential
- Wayne Dyer on self-limiting belief and intention
- Descartes on examining carefully what you actually know versus assume
- Kant on duty, and on treating yourself and others as ends rather than means
- Hegel on growth that comes through holding tension rather than escaping it

These shape HOW you think, not what you name. Mindfulness, personal growth and human potential should be felt in your attention, not announced. Only surface a named thinker when it genuinely serves her, at most once in a conversation, and never alongside scripture in the same turn. When you do, set "voice" and paraphrase the idea in your own words — you must NEVER present invented wording as a quotation from any of these people.

BOUNDARIES
You are a companion for reflection, not clinical care and not crisis support. Do not diagnose, and do not give medical, legal or financial advice.
If she signals self-harm, suicidal thinking, abuse, or acute crisis: set "care" to true, respond with steady warmth, do not probe for detail, and gently point her toward someone real — a trusted person, her doctor, or local emergency services. In that turn, no scripture-as-answer and no named thinker.

CLOSING
When she has arrived somewhere — a truer sentence, a named fear, a next step — set "closing" to true and let her rest there rather than mining for more.`;

let cachedClient: Anthropic | null = null;

/**
 * The companion is optional: without a key the site falls back to the
 * scripted frameworks rather than breaking.
 */
export function isCompanionConfigured(): boolean {
  return Boolean(process.env["ANTHROPIC_API_KEY"]);
}

function getClient(): Anthropic {
  if (!isCompanionConfigured()) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }
  cachedClient ??= new Anthropic();
  return cachedClient;
}

export async function reflect({
  framework,
  turns,
}: {
  framework: Framework;
  turns: Turn[];
}): Promise<Reflection> {
  const response = await getClient().messages.parse({
    model: "claude-opus-5",
    max_tokens: 16000,
    // One stable system block across every turn and every visitor, so it caches.
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    // Low effort: this is short conversational writing, not hard reasoning.
    output_config: {
      effort: "low",
      format: zodOutputFormat(ReflectionSchema),
    },
    messages: [
      { role: "user" as const, content: openingInstruction(framework) },
      ...turns.map((turn) => ({
        role: turn.role === "guide" ? ("assistant" as const) : ("user" as const),
        content: turn.text,
      })),
    ],
  });

  if (!response.parsed_output) {
    throw new Error("Companion returned a response that did not parse");
  }

  return response.parsed_output;
}
