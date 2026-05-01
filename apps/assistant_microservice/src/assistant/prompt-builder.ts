import type { RecentMessagePayload } from '../contracts/assistant-api.types';
import type { TargetUserProfileDto } from './dto/target-user-profile.dto';

export function formatTranscript(messages: RecentMessagePayload[]): string {
  return messages
    .map((m) => {
      const text = m.content?.trim() || '[attachment or empty]';
      return `id:${m.id} | t:${m.createdAt} | sender:${m.senderId} | ${text}`;
    })
    .join('\n');
}

export function buildTopicSuggestionPrompts(params: {
  profile: TargetUserProfileDto;
  recentMessages: RecentMessagePayload[];
}): { system: string; user: string } {
  const { profile, recentMessages } = params;
  const profileBlock = [
    `userId: ${profile.userId}`,
    profile.username && `username: ${profile.username}`,
    profile.firstName && `firstName: ${profile.firstName}`,
    profile.secondName && `secondName: ${profile.secondName}`,
    profile.bio != null && `bio: ${profile.bio}`,
    profile.platformRole && `platformRole: ${profile.platformRole}`,
    profile.locale && `locale: ${profile.locale}`,
  ]
    .filter(Boolean)
    .join('\n');

  const transcript =
    recentMessages.length > 0
      ? formatTranscript(recentMessages)
      : '(no messages yet)';

  const system = `You are a conversation coach. Suggest 3-5 short, friendly conversation starter topics tailored to the other person's profile and recent chat context.
Respond ONLY with valid JSON matching this shape:
{"suggestions":["..."],"tone":"casual|professional|playful","confidence":0.0-1.0}
Rules: suggestions must be specific, respectful, and in the same language as the profile/locale when possible. No personal data beyond what's given.`;

  const user = `Other person profile:\n${profileBlock}\n\nRecent chat:\n${transcript}`;

  return { system, user };
}

export function buildDialogSummaryPrompts(params: {
  recentMessages: RecentMessagePayload[];
  maxBullets: number;
}): { system: string; user: string } {
  const { recentMessages, maxBullets } = params;
  const transcript = formatTranscript(recentMessages);

  const system = `Summarize the chat for the user. Respond ONLY with valid JSON:
{"summary":"2-4 sentences","actionItems":["up to ${maxBullets} short bullets or empty array"]}
Be factual; only use information from the transcript. Same language as the majority of messages.`;

  const user = `Transcript:\n${transcript}`;

  return { system, user };
}

export function buildChatQaPrompts(params: {
  question: string;
  recentMessages: RecentMessagePayload[];
}): { system: string; user: string } {
  const { question, recentMessages } = params;
  const transcript = formatTranscript(recentMessages);

  const system = `Answer using ONLY the chat transcript. If the answer is not in the transcript, say you cannot tell from the messages.
Respond ONLY with valid JSON:
{"answer":"...","citations":[{"messageId":"uuid from transcript line if used","excerpt":"short quote"}]}
Each transcript line starts with id:<messageUuid>. Use those UUIDs in citations when you quote. Use empty citations if nothing specific applies. Same language as the question when reasonable.`;

  const user = `Question: ${question}\n\nTranscript:\n${transcript}`;

  return { system, user };
}
