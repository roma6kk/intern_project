import type { RecentMessagePayload } from '../contracts/assistant-api.types';
import type { TargetUserProfileDto } from './dto/target-user-profile.dto';

const USERNAME_DISPLAY_RULE = `Participant naming (mandatory): each transcript line marks the speaker as sender:@username and whether they are participant:self (assistant client — the sender of this assistant request, see JSON below) vs participant:peer (their chat counterpart(s)). When your output mentions who wrote, asked, or agreed with something, use only those exact @username handles from the transcript. Do not invent labels ("User A", "пользователь", numeric fragments, UUIDs, roles), and do not use real names from JSON profile bio/firstName unless the user-message text itself refers to names. Lines with sender:@unknown: neutral wording only — no fabricated identities.`;

const PERSONAL_ASSISTANT_RULE = `Personal assistant: you serve ONLY the assistant client marked participant:self in each transcript line and described in Assistant client JSON. participant:peer rows are conversation partners—they are NOT your audience. Address advice, summaries, and answers to participant:self alone (implicit "you"). Questions like "did I/we agree?", "who offered?" mean participant:self viewpoint. Conversation topics must be wording participant:self might naturally send to counterpart(s)—not generic advice aimed at participant:peer. Do not confuse or merge identities.`;

const RUSSIAN_ONLY_RULE = `Language (mandatory): All natural-language text you generate (suggestions, summary, actionItems, answer) MUST be in Russian only, even if the question or transcript is in another language. JSON keys stay in English. citation.excerpt may quote transcript wording verbatim when citing a message.`;

export interface ViewerContext {
  viewerUserId: string;
}

function transcriptSenderDisplay(m: RecentMessagePayload): string {
  const u = m.senderUsername?.trim();
  if (u) {
    const handle = u.startsWith('@') ? u : `@${u}`;
    return handle;
  }
  return '@unknown';
}

function participantLane(
  m: RecentMessagePayload,
  viewer: ViewerContext | null | undefined,
): string {
  if (!viewer?.viewerUserId) return '';
  return m.senderId === viewer.viewerUserId
    ? 'participant:self'
    : 'participant:peer';
}

export function formatTranscript(
  messages: RecentMessagePayload[],
  viewer?: ViewerContext | null,
): string {
  return messages
    .map((m) => {
      const text = m.content?.trim() || '[attachment or empty]';
      const speaker = transcriptSenderDisplay(m);
      const lane = participantLane(m, viewer ?? null);
      const laneSeg = lane ? ` | ${lane}` : '';
      return `id:${m.id} | t:${m.createdAt} | sender:${speaker}${laneSeg} | ${text}`;
    })
    .join('\n');
}

export function buildProfileBlockObject(
  profile?: TargetUserProfileDto | null,
): Record<string, string> {
  if (!profile) {
    return {};
  }
  const out: Record<string, string> = { userId: profile.userId };
  if (profile.username) {
    out.username = profile.username;
  }
  if (profile.firstName) {
    out.firstName = profile.firstName;
  }
  if (profile.secondName) {
    out.secondName = profile.secondName;
  }
  if (profile.bio != null && profile.bio !== '') {
    out.bio = profile.bio;
  }
  if (profile.platformRole) {
    out.platformRole = profile.platformRole;
  }
  if (profile.locale) {
    out.locale = profile.locale;
  }
  return out;
}

export function formatProfileBlockJson(
  profile?: TargetUserProfileDto | null,
): string {
  return JSON.stringify(buildProfileBlockObject(profile), null, 2);
}

export function buildTopicSuggestionPrompts(params: {
  requesterProfile: TargetUserProfileDto;
  recentMessages: RecentMessagePayload[];
  viewer: ViewerContext;
}): { system: string; user: string } {
  const { requesterProfile, recentMessages, viewer } = params;
  const requesterJson = formatProfileBlockJson(requesterProfile);

  const transcript =
    recentMessages.length > 0
      ? formatTranscript(recentMessages, viewer)
      : '(no messages yet)';

  const system = `You are a personal conversation coach for ONE user only—the assistant client (participant:self).

Suggest 3-5 short conversation starter lines they can realistically send in this chat, based on the full transcript from all participants (participant:self and participant:peer).

Respond ONLY with valid JSON matching this shape:
{"suggestions":["..."],"tone":"casual|professional|playful","confidence":0.0-1.0}
Rules: No fabricated personal data beyond inputs.

${RUSSIAN_ONLY_RULE}

${PERSONAL_ASSISTANT_RULE}

${USERNAME_DISPLAY_RULE}`;

  const user = `Assistant client (participant:self):\n${requesterJson}\n\nRecent chat (all participants):\n${transcript}`;
  return { system, user };
}

export function buildDialogSummaryPrompts(params: {
  requesterProfile: TargetUserProfileDto;
  counterpartyProfile?: TargetUserProfileDto | null;
  recentMessages: RecentMessagePayload[];
  maxBullets: number;
  viewer: ViewerContext;
}): { system: string; user: string } {
  const {
    requesterProfile,
    counterpartyProfile,
    recentMessages,
    maxBullets,
    viewer,
  } = params;
  const requesterJson = formatProfileBlockJson(requesterProfile);
  const counterpartJson = formatProfileBlockJson(counterpartyProfile);
  const transcript = formatTranscript(recentMessages, viewer);

  const system = `Produce a recap for ONLY the assistant client (participant:self): what happened in THEIR chat thread with counterpart(s).

Respond ONLY with valid JSON:
{"summary":"2-4 sentences","actionItems":["up to ${maxBullets} short bullets or empty array"]}

Be factual — only transcript content drives events (profile JSON hints who participant:peer might be — not events).

Action items belong to participant:self unless transcript clearly assigns externally.

${RUSSIAN_ONLY_RULE}

${PERSONAL_ASSISTANT_RULE}

${USERNAME_DISPLAY_RULE}`;

  const user = `Assistant client (participant:self):\n${requesterJson}\n\nCounterparty optional profile JSON (participant:peer, not message log):\n${counterpartJson || '{}'}\n\nTranscript:\n${transcript}`;

  return { system, user };
}

export function buildChatQaPrompts(params: {
  requesterProfile: TargetUserProfileDto;
  counterpartyProfile?: TargetUserProfileDto | null;
  question: string;
  recentMessages: RecentMessagePayload[];
  viewer: ViewerContext;
}): { system: string; user: string } {
  const {
    requesterProfile,
    counterpartyProfile,
    question,
    recentMessages,
    viewer,
  } = params;
  const requesterJson = formatProfileBlockJson(requesterProfile);
  const counterpartJson = formatProfileBlockJson(counterpartyProfile);
  const transcript = formatTranscript(recentMessages, viewer);

  const system = `The question belongs to ONLY the assistant client (participant:self). Interpret pronouns accordingly.

Answer using ONLY the chat transcript content. When unknown, refuse from transcript ambiguity.

Respond ONLY with valid JSON:
{"answer":"...","citations":[{"messageId":"uuid from transcript line if used","excerpt":"short quote"}]}

participant:self / participant:peer mark authorship lanes. citations use message ids. Counterparty JSON is contextual—not chat text.

${RUSSIAN_ONLY_RULE}

${PERSONAL_ASSISTANT_RULE}

${USERNAME_DISPLAY_RULE}`;

  const user = `Assistant client (participant:self):\n${requesterJson}\n\nCounterparty optional JSON (participant:peer):\n${counterpartJson || '{}'}\n\nTheir question:\n${question}\n\nTranscript:\n${transcript}`;

  return { system, user };
}
