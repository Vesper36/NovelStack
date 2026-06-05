import Database from 'better-sqlite3';
import { createId } from '@paralleldrive/cuid2';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.resolve(process.cwd(), 'data', 'inkweave.db');
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// 删除旧库重新创建
if (fs.existsSync(DB_PATH)) fs.unlinkSync(DB_PATH);

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ========== 建表 ==========
db.exec(`
  CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    email_verified INTEGER,
    image TEXT,
    bio TEXT,
    role TEXT DEFAULT 'reader' CHECK(role IN ('reader','author','editor','moderator','admin')),
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch())
  );

  CREATE TABLE works (
    id TEXT PRIMARY KEY,
    author_id TEXT NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    cover_url TEXT,
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft','reviewing','published','archived')),
    visibility TEXT DEFAULT 'public' CHECK(visibility IN ('public','private','link_only')),
    category TEXT,
    word_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    favorite_count INTEGER DEFAULT 0,
    rating TEXT DEFAULT 'general' CHECK(rating IN ('general','teen','mature','explicit')),
    language TEXT DEFAULT 'zh',
    publish_at INTEGER,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch())
  );

  CREATE TABLE volumes (
    id TEXT PRIMARY KEY,
    work_id TEXT NOT NULL REFERENCES works(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft','published')),
    created_at INTEGER DEFAULT (unixepoch())
  );

  CREATE TABLE chapters (
    id TEXT PRIMARY KEY,
    volume_id TEXT NOT NULL REFERENCES volumes(id) ON DELETE CASCADE,
    work_id TEXT NOT NULL REFERENCES works(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content_mdx TEXT,
    content_html TEXT,
    sort_order INTEGER DEFAULT 0,
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft','reviewing','published','archived')),
    word_count INTEGER DEFAULT 0,
    read_time_est INTEGER DEFAULT 0,
    author_note TEXT,
    published_at INTEGER,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch())
  );

  CREATE TABLE tags (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    color TEXT,
    category TEXT,
    usage_count INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (unixepoch())
  );

  CREATE TABLE work_tags (
    work_id TEXT NOT NULL REFERENCES works(id) ON DELETE CASCADE,
    tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (work_id, tag_id)
  );

  CREATE TABLE chapter_tags (
    chapter_id TEXT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (chapter_id, tag_id)
  );

  CREATE TABLE user_preferences (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL REFERENCES users(id),
    theme TEXT DEFAULT 'default',
    font_size INTEGER DEFAULT 16,
    font_family TEXT DEFAULT 'serif',
    line_height REAL DEFAULT 1.75,
    reading_width INTEGER DEFAULT 65,
    dark_mode INTEGER DEFAULT 0,
    auto_save INTEGER DEFAULT 1,
    email_notifications INTEGER DEFAULT 1
  );

  CREATE TABLE reading_progress (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    chapter_id TEXT NOT NULL REFERENCES chapters(id),
    work_id TEXT NOT NULL REFERENCES works(id),
    progress REAL DEFAULT 0,
    scroll_position INTEGER DEFAULT 0,
    status TEXT DEFAULT 'reading' CHECK(status IN ('reading','completed','dropped')),
    last_read_at INTEGER DEFAULT (unixepoch())
  );

  CREATE TABLE favorites (
    user_id TEXT NOT NULL REFERENCES users(id),
    work_id TEXT NOT NULL REFERENCES works(id),
    created_at INTEGER DEFAULT (unixepoch()),
    PRIMARY KEY (user_id, work_id)
  );

  CREATE TABLE comments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    chapter_id TEXT NOT NULL REFERENCES chapters(id),
    parent_id TEXT,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK(status IN ('active','hidden','deleted')),
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch())
  );

  CREATE TABLE draft_versions (
    id TEXT PRIMARY KEY,
    chapter_id TEXT NOT NULL REFERENCES chapters(id),
    content_mdx TEXT,
    title TEXT,
    version INTEGER NOT NULL,
    created_at INTEGER DEFAULT (unixepoch())
  );

  CREATE TABLE content_warnings (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    severity TEXT DEFAULT 'mild' CHECK(severity IN ('mild','moderate','severe'))
  );

  CREATE TABLE work_content_warnings (
    work_id TEXT NOT NULL REFERENCES works(id) ON DELETE CASCADE,
    warning_id TEXT NOT NULL REFERENCES content_warnings(id) ON DELETE CASCADE,
    PRIMARY KEY (work_id, warning_id)
  );

  CREATE TABLE themes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    author_id TEXT REFERENCES users(id),
    config TEXT,
    is_default INTEGER DEFAULT 0,
    is_public INTEGER DEFAULT 1,
    usage_count INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (unixepoch())
  );

  CREATE TABLE reports (
    id TEXT PRIMARY KEY,
    reporter_id TEXT NOT NULL REFERENCES users(id),
    target_type TEXT NOT NULL CHECK(target_type IN ('work','chapter','comment','user')),
    target_id TEXT NOT NULL,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending','reviewing','resolved','dismissed')),
    resolved_by TEXT REFERENCES users(id),
    resolved_at INTEGER,
    created_at INTEGER DEFAULT (unixepoch())
  );

  CREATE INDEX idx_works_author ON works(author_id);
  CREATE INDEX idx_works_status ON works(status);
  CREATE INDEX idx_works_slug ON works(slug);
  CREATE INDEX idx_volumes_work ON volumes(work_id);
  CREATE INDEX idx_chapters_volume ON chapters(volume_id);
  CREATE INDEX idx_chapters_work ON chapters(work_id);
  CREATE INDEX idx_chapters_slug ON chapters(slug);
  CREATE INDEX idx_work_tags_work ON work_tags(work_id);
  CREATE INDEX idx_work_tags_tag ON work_tags(tag_id);
  CREATE INDEX idx_reading_progress_user ON reading_progress(user_id);
  CREATE INDEX idx_favorites_user ON favorites(user_id);
  CREATE INDEX idx_comments_chapter ON comments(chapter_id);
`);

// ========== 种子数据 ==========
const now = Math.floor(Date.now() / 1000);

// 用户
const users = [
  { id: createId(), name: '织梦者', email: 'admin@inkweave.dev', role: 'admin', bio: 'InkWeave 创始人，热爱文字与代码的交织。', image: null },
  { id: createId(), name: '月下清歌', email: 'writer1@example.com', role: 'author', bio: '古风言情写手，代表作《长安旧事》。', image: null },
  { id: createId(), name: '星尘旅人', email: 'writer2@example.com', role: 'author', bio: '科幻爱好者，擅长硬核世界观构建。', image: null },
  { id: createId(), name: '墨染青衫', email: 'writer3@example.com', role: 'author', bio: '同人创作者，主攻二次元衍生。', image: null },
  { id: createId(), name: '安静的读者', email: 'reader1@example.com', role: 'reader', bio: '书虫一枚，日均阅读三万字。', image: null },
];

const insertUser = db.prepare(`INSERT INTO users (id, name, email, role, bio, image, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
for (const u of users) {
  insertUser.run(u.id, u.name, u.email, u.role, u.bio, u.image, now, now);
}

// 标签
const tags = [
  { name: '奇幻', slug: 'fantasy', color: '#8b5cf6', category: '题材' },
  { name: '科幻', slug: 'sci-fi', color: '#06b6d4', category: '题材' },
  { name: '古代', slug: 'ancient', color: '#f59e0b', category: '题材' },
  { name: '现代', slug: 'modern', color: '#10b981', category: '题材' },
  { name: '言情', slug: 'romance', color: '#ec4899', category: '类型' },
  { name: '悬疑', slug: 'mystery', color: '#6366f1', category: '类型' },
  { name: '冒险', slug: 'adventure', color: '#f97316', category: '类型' },
  { name: '治愈', slug: 'healing', color: '#84cc16', category: '类型' },
  { name: 'BG', slug: 'bg', color: '#e11d48', category: '配对' },
  { name: 'BL', slug: 'bl', color: '#7c3aed', category: '配对' },
  { name: '无CP', slug: 'no-cp', color: '#64748b', category: '配对' },
  { name: '连载中', slug: 'ongoing', color: '#22c55e', category: '状态' },
  { name: '已完结', slug: 'completed', color: '#64748b', category: '状态' },
  { name: '同人', slug: 'fanfic', color: '#db2777', category: '题材' },
  { name: '仙侠', slug: 'xianxia', color: '#a855f7', category: '题材' },
];

const tagIds: Record<string, string> = {};
const insertTag = db.prepare(`INSERT INTO tags (id, name, slug, color, category, usage_count, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`);
for (const t of tags) {
  const id = createId();
  tagIds[t.slug] = id;
  insertTag.run(id, t.name, t.slug, t.color, t.category, Math.floor(Math.random() * 200) + 10, now);
}

// 作品
const worksData = [
  {
    title: '长安旧事',
    slug: 'changan-past',
    authorSlug: 'writer1',
    description: '大唐天宝年间，长安城暗流涌动。一位来自江南的女琴师，因一曲《凤求凰》卷入皇权与江湖的漩涡。在权谋与真情之间，她将如何抉择？',
    category: '古代言情',
    rating: 'teen',
    status: 'published',
    tags: ['古代', '言情', 'BG', '已完结'],
    volumes: [
      {
        title: '卷一 凤鸣长安',
        chapters: [
          { title: '第一章 江南烟雨', slug: 'v1-c1', content: generateChapterContent('江南', '琴师') },
          { title: '第二章 长安月', slug: 'v1-c2', content: generateChapterContent('长安', '月色') },
          { title: '第三章 凤求凰', slug: 'v1-c3', content: generateChapterContent('古琴', '知音') },
        ]
      },
      {
        title: '卷二 权谋暗涌',
        chapters: [
          { title: '第四章 宫墙深深', slug: 'v2-c1', content: generateChapterContent('宫廷', '权谋') },
          { title: '第五章 棋局', slug: 'v2-c2', content: generateChapterContent('棋局', '博弈') },
        ]
      }
    ]
  },
  {
    title: '星际迷航：新纪元',
    slug: 'stellar-voyage',
    authorSlug: 'writer2',
    description: '公元2847年，人类已殖民三个星系。"远征号"星舰在执行例行探索任务时，意外发现了一个被时间冻结的星球。船员们必须在72小时内解开星球的秘密，否则将被永远困在时间的裂缝中。',
    category: '科幻冒险',
    rating: 'teen',
    status: 'published',
    tags: ['科幻', '冒险', '无CP', '连载中'],
    volumes: [
      {
        title: '卷一 时间裂缝',
        chapters: [
          { title: '第一章 远征号', slug: 'v1-c1', content: generateChapterContent('星舰', '远征') },
          { title: '第二章 冻结之域', slug: 'v1-c2', content: generateChapterContent('时间', '星球') },
          { title: '第三章 72小时', slug: 'v1-c3', content: generateChapterContent('倒计时', '危机') },
          { title: '第四章 时间回廊', slug: 'v1-c4', content: generateChapterContent('回廊', '谜题') },
        ]
      }
    ]
  },
  {
    title: '妖怪公寓日常',
    slug: 'yokai-apartment',
    authorSlug: 'writer3',
    description: '大学生林默因为房租便宜，搬进了一栋传说中的"妖怪公寓"。狐妖室友爱追剧、树精房东收租只收灵气、隔壁的幽灵小姐姐每晚练美声。在这栋不可思议的公寓里，温馨又搞笑的同居生活就此展开。',
    category: '奇幻日常',
    rating: 'general',
    status: 'published',
    tags: ['奇幻', '治愈', '现代', '连载中'],
    volumes: [
      {
        title: '卷一 欢迎来到妖怪公寓',
        chapters: [
          { title: '第一章 最便宜的房租', slug: 'v1-c1', content: generateChapterContent('公寓', '妖怪') },
          { title: '第二章 狐妖室友', slug: 'v1-c2', content: generateChapterContent('狐妖', '追剧') },
          { title: '第三章 树精房东', slug: 'v1-c3', content: generateChapterContent('树精', '灵气') },
        ]
      }
    ]
  },
  {
    title: '暗夜侦探事务所',
    slug: 'dark-night-detective',
    authorSlug: 'writer1',
    description: '退休警探陈暮年在城市暗巷开设了一间只在夜间营业的事务所。每个委托人的背后，都藏着一个比案件本身更复杂的故事。真相，往往比谎言更令人心碎。',
    category: '悬疑推理',
    rating: 'mature',
    status: 'published',
    tags: ['悬疑', '现代', 'BG', '连载中'],
    volumes: [
      {
        title: '卷一 暗巷委托',
        chapters: [
          { title: '第一章 午夜来客', slug: 'v1-c1', content: generateChapterContent('侦探', '午夜') },
          { title: '第二章 失踪的画家', slug: 'v1-c2', content: generateChapterContent('画家', '失踪') },
        ]
      }
    ]
  },
  {
    title: '修仙界摸鱼指南',
    slug: 'xianxia-slacker',
    authorSlug: 'writer3',
    description: '穿越到修仙世界的张小鱼，发现自己资质平平，但他有一个绝技——摸鱼。当别人苦修百年时，他在种菜；当别人渡劫飞升时，他在钓鱼。然而命运总是爱开玩笑，这个最不求上进的修仙者，偏偏成了最接近天道的人。',
    category: '仙侠喜剧',
    rating: 'general',
    status: 'published',
    tags: ['仙侠', '治愈', '无CP', '已完结'],
    volumes: [
      {
        title: '卷一 山门摸鱼记',
        chapters: [
          { title: '第一章 穿越也要躺平', slug: 'v1-c1', content: generateChapterContent('穿越', '修仙') },
          { title: '第二章 种菜也是一种修行', slug: 'v1-c2', content: generateChapterContent('种菜', '修行') },
          { title: '第三章 渡劫？不如钓鱼', slug: 'v1-c3', content: generateChapterContent('渡劫', '钓鱼') },
        ]
      },
      {
        title: '卷二 天道摸鱼系统',
        chapters: [
          { title: '第四章 天道也摸鱼', slug: 'v2-c1', content: generateChapterContent('天道', '系统') },
          { title: '第五章 飞升？明天再说', slug: 'v2-c2', content: generateChapterContent('飞升', '懒散') },
        ]
      }
    ]
  },
];

function generateChapterContent(scene: string, theme: string): string {
  return `---
title: "${scene}与${theme}"
---

# ${scene}与${theme}

> 文字是时间的容器，故事是灵魂的居所。

## 第一节

${scene}的空气中弥漫着一种难以言说的气息。那是一种混合了记忆与期待的味道，像是旧书页间夹带的干花，又像是雨后泥土中冒出的新芽。

她站在${scene}的边缘，目光穿过层层叠叠的光影，落在远处那个模糊的身影上。风起了，带着${theme}特有的温度，拂过她的发梢。

"你来了。"那个声音从远处传来，带着一丝不易察觉的颤抖。

她没有回答，只是微微点了点头。有些话，不需要说出口。

## 第二节

关于${theme}的记忆，要追溯到很久以前。那时候的天空比现在更蓝，河水比现在更清，而他们之间的距离，比现在更远，也更近。

\`\`\`javascript
// ${scene}中的一段记录
const memory = {
  place: '${scene}',
  feeling: '${theme}',
  timestamp: '那个夏天',
  preserved: true,
};
\`\`\`

时间是最残忍的编剧，它把最好的故事留给了回忆，却把最差的结局留给了现实。

## 第三节

夜深了，${scene}渐渐安静下来。远处传来几声犬吠，打破了沉默的平衡。

她翻开随身携带的笔记本，在泛黄的纸页上写下一行字：

> *${theme}不是结局，而是开始。*

这句话后来被很多人引用，但没有人知道，它诞生于一个如此平凡的夜晚，诞生于${scene}中一个普通人的心底。

---

*（作者说：这一章写了很久，改了很多遍。希望你们能感受到那种安静的力量。）*`;
}

const insertWork = db.prepare(`INSERT INTO works (id, author_id, title, slug, description, cover_url, status, visibility, category, word_count, view_count, favorite_count, rating, language, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
const insertVolume = db.prepare(`INSERT INTO volumes (id, work_id, title, sort_order, status, created_at) VALUES (?, ?, ?, ?, ?, ?)`);
const insertChapter = db.prepare(`INSERT INTO chapters (id, volume_id, work_id, title, slug, content_mdx, content_html, sort_order, status, word_count, read_time_est, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
const insertWorkTag = db.prepare(`INSERT INTO work_tags (work_id, tag_id) VALUES (?, ?)`);

for (const w of worksData) {
  const workId = createId();
  const author = users.find(u => u.email.includes(w.authorSlug))!;
  const wordCount = w.volumes.reduce((sum, v) => sum + v.chapters.length * 1800, 0);
  const viewCount = Math.floor(Math.random() * 50000) + 1000;
  const favoriteCount = Math.floor(viewCount * 0.08);

  insertWork.run(
    workId, author.id, w.title, w.slug, w.description, null,
    w.status, 'public', w.category, wordCount, viewCount, favoriteCount,
    w.rating, 'zh', now - Math.floor(Math.random() * 30 * 86400), now
  );

  // 标签
  for (const tagName of w.tags) {
    const tagEntry = tags.find(t => t.name === tagName);
    if (tagEntry && tagIds[tagEntry.slug]) {
      insertWorkTag.run(workId, tagIds[tagEntry.slug]);
    }
  }

  // 卷和章
  w.volumes.forEach((vol, volIdx) => {
    const volumeId = createId();
    insertVolume.run(volumeId, workId, vol.title, volIdx, 'published', now);

    vol.chapters.forEach((ch, chIdx) => {
      const chapterId = createId();
      const wordCount = ch.content.length;
      insertChapter.run(
        chapterId, volumeId, workId, ch.title, ch.slug,
        ch.content, null, chIdx, 'published', wordCount,
        Math.max(1, Math.ceil(wordCount / 300)),
        now - Math.floor(Math.random() * 7 * 86400), now, now
      );
    });
  });
}

// 收藏数据
const insertFavorite = db.prepare(`INSERT INTO favorites (user_id, work_id, created_at) VALUES (?, ?, ?)`);
const allWorkIds = db.prepare(`SELECT id FROM works`).all() as { id: string }[];
const readerId = users[4].id;
for (const w of allWorkIds.slice(0, 3)) {
  insertFavorite.run(readerId, w.id, now);
}

db.close();
console.log('Database seeded successfully!');
console.log(`  Users: ${users.length}`);
console.log(`  Tags: ${tags.length}`);
console.log(`  Works: ${worksData.length}`);
