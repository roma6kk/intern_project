import type { RecentMessagePayload } from '../contracts/assistant-api.types';
import type { TargetUserProfileDto } from './dto/target-user-profile.dto';
import type {
  ChatQaData,
  DialogSummaryData,
  TopicSuggestionsData,
} from '../contracts/assistant-api.types';

const GENERIC_TOPICS = [
  'Как прошёл день?',
  'Чем сейчас увлекаешься?',
  'Есть планы на выходные?',
  'Что недавно посмотрел(а) или прочитал(а)?',
];

function pickFromBio(bio: string | null | undefined): string[] {
  if (!bio?.trim()) return [];
  const lower = bio.toLowerCase();
  const hits: string[] = [];
  const rules: Array<{ keys: string[]; topic: string }> = [
    {
      keys: ['music', 'музык', 'гитар', 'dj'],
      topic: 'Расскажи про любимую музыку или концерты.',
    },
    {
      keys: ['sport', 'спорт', 'run', 'бег', 'gym', 'трен'],
      topic: 'Как тебе удаётся совмещать спорт и работу/учёбу?',
    },
    {
      keys: ['code', 'dev', 'разраб', 'it', 'програм'],
      topic: 'Чем сейчас занимаешься в разработке?',
    },
    {
      keys: ['travel', 'путеш', 'trip'],
      topic: 'Куда мечтаешь поехать в следующий раз?',
    },
    {
      keys: ['photo', 'фото', 'camera'],
      topic: 'Как пришёл(ла) к фотографии?',
    },
  ];
  for (const r of rules) {
    if (r.keys.some((k) => lower.includes(k))) {
      hits.push(r.topic);
    }
  }
  return hits.slice(0, 3);
}

export function fallbackTopicSuggestions(
  profile: TargetUserProfileDto,
): TopicSuggestionsData {
  const fromBio = pickFromBio(profile.bio);
  const suggestions = [
    ...fromBio,
    ...GENERIC_TOPICS.filter((t) => !fromBio.includes(t)),
  ].slice(0, 5);
  return {
    suggestions,
    tone: 'casual',
    confidence: fromBio.length ? 0.35 : 0.2,
  };
}

export function fallbackDialogSummary(
  messages: RecentMessagePayload[],
  maxBullets: number,
): DialogSummaryData {
  if (messages.length === 0) {
    return {
      summary: 'В чате пока нет сообщений для резюме.',
      actionItems: [],
    };
  }
  const texts = messages
    .map((m) => m.content?.trim())
    .filter((c): c is string => Boolean(c));
  const head = texts[0]?.slice(0, 120) ?? '(вложения без текста)';
  const tail = texts.length > 1 ? texts[texts.length - 1]?.slice(0, 120) : '';
  const summary =
    texts.length <= 1
      ? `Кратко: обсуждение начинается с «${head}».`
      : `Диалог из ${messages.length} сообщений: начали с «${head}»${tail ? `, последнее по смыслу — «${tail}».` : '.'}`;

  const actionItems: string[] = [];
  if (maxBullets > 0 && texts.some((t) => /напиши|скинь|завтра|встреч/i.test(t))) {
    actionItems.push('Проверь, есть ли договорённости, которые стоит подтвердить.');
  }
  return { summary, actionItems: actionItems.slice(0, maxBullets) };
}

export function fallbackChatQa(
  question: string,
  messages: RecentMessagePayload[],
): ChatQaData {
  const q = question.toLowerCase();
  const joined = messages
    .map((m) => m.content?.toLowerCase() ?? '')
    .join(' ');
  if (!messages.length) {
    return {
      answer:
        'В переписке нет сообщений — не могу ответить по истории чата.',
      citations: [],
    };
  }
  if (joined.length < 5) {
    return {
      answer:
        'Сообщения почти без текста (например, только вложения) — ответить по содержанию не получится.',
      citations: [],
    };
  }
  // Very naive keyword overlap for offline mode
  const words = q.split(/\s+/).filter((w) => w.length > 3);
  const hit = messages.find((m) => {
    const c = m.content?.toLowerCase() ?? '';
    return words.some((w) => c.includes(w));
  });
  if (hit?.content) {
    return {
      answer: `По доступным сообщениям: в переписке упоминается тема, близкая к вопросу. См. цитату.`,
      citations: [
        { messageId: hit.id, excerpt: hit.content.slice(0, 160) },
      ],
    };
  }
  return {
    answer:
      'Не нашёл в последних сообщениях явного ответа на этот вопрос. Уточни или спроси в чате напрямую.',
    citations: [],
  };
}
