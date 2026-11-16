# Neon DB: Pooled Connection URL বনাম Normal (Direct) Connection URL

Neon Serverless PostgreSQL-এ ডাটাবেসের সাথে কানেক্ট করার জন্য প্রধানত দুটি ধরণের Connection String / URL প্রদান করা হয়:
1. **Normal (Direct) Connection URL**
2. **Pooled Connection URL**

এই গাইডে বিস্তারিত আলোচনা করা হয়েছে তাদের পার্থক্য, কাজের ধরন, কখন কোনটি ব্যবহার করবেন এবং বাস্তব উদাহরণের মাধ্যমে কিভাবে কনফিগার করবেন।

---

## ১. Neon Connection URL-এর মূল পার্থক্য কী?

### ক. Normal (Direct) Connection URL
এটি সরাসরি আপনার Neon PostgreSQL ডাটাবেসের Compute Node-এর সাথে কানেকশন তৈরি করে। মাঝখানে কোনো মিডলওয়্যার বা প্রক্সি থাকে না।

- **URL ফরম্যাট:**
  ```text
  postgresql://user:password@ep-cool-fog-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
  ```
- **বৈশিষ্ট্য:**
  - সরাসরি PostgreSQL প্রসেসের সাথে সংযুক্ত থাকে।
  - PostgreSQL-এর সমস্ত নেটিভ সেশন ফিচার (যেমন: `LISTEN`/`NOTIFY`, Temporary Tables, Prepared Statements, Session-level Advisory Locks) সাপোর্ট করে।
  - কানেকশন সংখ্যা সীমিত (Neon Compute-এর সাইজ অনুযায়ী সাধারণত ১০০ থেকে ৫০০ পর্যন্ত হতে পারে)।

---

### খ. Pooled Connection URL
Neon-এ Pooled URL ব্যবহার করলে আপনার রিকোয়েস্ট ডাটাবেসে সরাসরি না গিয়ে মাঝখানে থাকা **PgBouncer** (Connection Pooler)-এর মধ্য দিয়ে যায়।

- **URL ফরম্যাট:**
  লক্ষ্য করুন, হোস্টনেমে `-pooler` শব্দটি যুক্ত থাকে:
  ```text
  postgresql://user:password@ep-cool-fog-123456-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
  ```
- **বৈশিষ্ট্য:**
  - এটি **PgBouncer**-এর Transaction Pooling মোড ব্যবহার করে।
  - হাজার হাজার কনকারেন্ট (একযোগে) ক্লায়েন্ট কানেকশন সামলাতে পারে (১০,০০০ পর্যন্ত কানেকশন সাপোর্ট করে)।
  - ক্লায়েন্ট ডিসকানেক্ট না হলেও কুয়েরি বা ট্রানজ্যাকশন শেষ হলে ডাটাবেসের মূল কানেকশন অন্য ক্লায়েন্টের জন্য ছেড়ে দেয়।
  - যেহেতু এটি ট্রানজ্যাকশন মোডে কাজ করে, তাই সেশনভিত্তিক কিছু ফিচার (যেমন: সেশন ভেরিয়েবল, `LISTEN`/`NOTIFY`) এতে কাজ নাও করতে পারে।

---

## ২. তুলনামূলক বিশ্লেষণ (Comparison Table)

| বৈশিষ্ট্য / ক্রাইটেরিয়া | Normal (Direct) URL | Pooled Connection URL |
| :--- | :--- | :--- |
| **হোস্টনেম (Hostname)** | `ep-xxx.region.aws.neon.tech` | `ep-xxx-pooler.region.aws.neon.tech` |
| **মাঝখানের আর্কিটেকচার** | সরাসরি Postgres Serverless Compute Node | মাঝখানে **PgBouncer** প্রক্সি থাকে |
| **সর্বোচ্চ কানেকশন লিমিট** | কম (সাধারণত ১০০-৫০০) | অনেক বেশি (১০,০০০+ পর্যন্ত) |
| **কানেকশন ওভারহেড** | প্রতিটি কানেকশনের জন্য Postgres RAM/CPU খরচ হয় | লাইটওয়েট, খুব দ্রুত কানেকশন হ্যান্ডেল করে |
| **কানেকশন তৈরির গতি** | তুলনামূলক ধীর (TCP + SSL + Auth হ্যান্ডশেক) | খুব দ্রুত কারণ PgBouncer কানেকশন রিইউজ করে |
| **Prepared Statements** | সম্পূর্ণ সমর্থিত | সীমাবদ্ধ (PgBouncer মোড অনুযায়ী কনফিগার প্রয়োজন) |
| **Session Features (LISTEN/NOTIFY)** | সম্পূর্ণ কাজ করে | কাজ করে না |
| **Database Migrations** | **আদর্শ ও নিরাপদ** | মাইগ্রেশনে ফেইল করতে পারে |
| **Serverless / Lambda** | কানেকশন দ্রুত এক্সহস্ট হতে পারে | **সবচেয়ে উপযুক্ত ও সুপারিশকৃত** |

---

## ৩. কখন কোনটি ব্যবহার করবেন এবং কেন?

### কখন Pooled Connection URL ব্যবহার করবেন?

1. **Serverless আর্কিটেকচার (Next.js, Vercel, AWS Lambda, Cloudflare, Supabase Edge Functions):**
   - **কেন?** সার্ভারলেস ফাংশনগুলো স্ট্যাটলেস (Stateless)। যতবার ইউজার রিকোয়েস্ট আসে, নতুন ফাংশন ইনস্ট্যান্স চালু হতে পারে। যদি ১০০টি ল্যাম্বডা ফাংশন চালু হয় এবং সবাই ডিরেক্ট কানেকশন নেয়, তবে ডাটাবেসের লিমিট মুহূর্তেই শেষ হয়ে যাবে (`FATAL: remaining connection slots are reserved for non-replication superuser connections` বা `too many clients already` এরর আসবে)। Pooled URL ব্যবহার করলে PgBouncer এগুলো সুন্দরভাবে ম্যানেজ করে।

2. **হাই-ট্রাফিক ওয়েব অ্যাপ্লিকেশন (High Concurrency):**
   - **কেন?** যেসব অ্যাপ্লিকেশনে একসাথে অনেক ইউজার কুয়েরি করে কিন্তু কুয়েরিগুলো খুব দ্রুত শেষ হয় (যেমন REST API বা GraphQL API), সেখানে Pooled URL কানেকশন রিইউজ করে ল্যাটেন্সি কমায়।

---

### কখন Normal (Direct) Connection URL ব্যবহার করবেন?

1. **ডাটাবেস মাইগ্রেশন (Prisma Migrate, Drizzle Kit, Knex Migrations):**
   - **কেন?** মাইগ্রেশনের সময় ডাটাবেস স্কিমা পরিবর্তনের জন্য দীর্ঘস্থায়ী লক (Advisory Lock) এবং সেশন লেভেল স্টেট দরকার হয়। PgBouncer ট্রানজ্যাকশন শেষ হলেই কানেকশন বদলে ফেলে, যার ফলে মাইগ্রেশন প্রক্রিয়া ফেইল বা হ্যাং হয়ে যেতে পারে। তাই মাইগ্রেশন চালানোর জন্য সবসময় Direct URL ব্যবহার করা বাধ্যতামূলক।

2. **ট্রেডিশনাল লং-রানিং সার্ভার (যদি নিজেই Pool ম্যানেজ করেন):**
   - **কেন?** যদি আপনি একটি স্ট্যান্ডার্ড Node.js/Express সার্ভার অথবা ডকার কন্টেইনার চালান (যা সবসময় ব্যাকগ্রাউন্ডে চলছে) এবং আপনার কোডে ইতিমধ্যে `new Pool()` এর সাইজ সীমিত করা থাকে (যেমন: max 10-20 connections), তবে Direct URL ব্যবহার করা যেতে পারে।

3. **Advanced PostgreSQL Features প্রয়োজন হলে:**
   - **কেন?** যদি আপনার অ্যাপ্লিকেশনে `LISTEN` এবং `NOTIFY` কমান্ডের মাধ্যমে রিয়েলটাইম চেঞ্জ শোনা লাগে, অথবা Temporary Table তৈরি করতে হয়, তবে Direct URL ব্যবহার করতে হবে।

---

## ৪. বাস্তব কোড উদাহরণ (Implementation Examples)

### উদাহরণ ১: Prisma ORM-এ সঠিক কনফিগারেশন

Prisma-তে সবচেয়ে সেরা নিয়ম হলো কুয়েরি করার জন্য **Pooled URL** ব্যবহার করা এবং মাইগ্রেশনের জন্য **Direct URL** ব্যবহার করা।

`.env` ফাইল:
```env
# রানটাইম অ্যাপ্লিকেশনের জন্য Pooled URL (PgBouncer সাপোর্টের জন্য ?pgbouncer=true যোগ করা ভালো)
DATABASE_URL="postgresql://user:password@ep-sample-123456-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"

# মাইগ্রেশন এবং Prisma CLI-এর জন্য Direct URL
DIRECT_URL="postgresql://user:password@ep-sample-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

`prisma/schema.prisma` ফাইল:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")   // Pooled URL ব্যবহার হবে সাধারণ কুয়েরির জন্য
  directUrl = env("DIRECT_URL")     // Direct URL ব্যবহার হবে 'npx prisma migrate' চালানোর সময়
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

---

### উদাহরণ ২: Node.js `pg` (node-postgres) ড্রাইভার

আপনার বর্তমান প্রজেক্টে (`pg` লাইব্রেরি ব্যবহার করে):

#### ক. সার্ভারলেস বা স্কেলেবল পরিবেশের জন্য (Pooled URL):
```typescript
import { Pool } from "pg";

// .env ফাইলে DATABASE_URL হিসেবে Pooled URL থাকবে (-pooler যুক্ত)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10, // লোকাল পুলের সাইজ
  idleTimeoutMillis: 30000,
});

export default pool;
```

#### খ. মাইগ্রেশন স্ক্রিপ্ট চালানোর জন্য (Direct URL):
```typescript
import { Client } from "pg";

async function runMigration() {
  // মাইগ্রেশনের জন্য সরাসরি Direct URL ব্যবহার করতে হবে
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("Connected directly to Postgres for migration...");

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Migration executed successfully!");
  } finally {
    await client.end();
  }
}

runMigration();
```

---

### উদাহরণ ৩: Drizzle ORM-এ কনফিগারেশন

`drizzle.config.ts` (মাইগ্রেশন টুল Direct URL ব্যবহার করবে):
```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DIRECT_URL!, // মাইগ্রেশনের জন্য Direct URL
  },
});
```

`src/db/index.ts` (রানটাইম অ্যাপ Pooled URL ব্যবহার করবে):
```typescript
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // রানটাইমের জন্য Pooled URL
});

export const db = drizzle(pool);
```

---

## ৫. সংক্ষেপে সিদ্ধান্ত নেওয়ার সহজ নিয়ম (Summary Checklist)

| আপনার কাজের ধরণ | কোন URL বেছে নেবেন? |
| :--- | :--- |
| **Next.js / Remix / Serverless API** | 👉 **Pooled URL** |
| **`npx prisma migrate dev` বা DB মাইগ্রেশন** | 👉 **Normal / Direct URL** |
| **উচ্চ ট্রাফিকের প্রোডাকশন রিকোয়েস্ট** | 👉 **Pooled URL** |
| **PostgreSQL `LISTEN` / `NOTIFY` রিয়েলটাইম লিসেনার** | 👉 **Normal / Direct URL** |
| **লং রানিং ডেডিকেটেড নোড ব্যাকএন্ড (যেখানে নিজস্ব কানেকশন লিমিট কন্ট্রোল করা আছে)** | 👉 **Normal অথবা Pooled** (যেকোনোটি চলতে পারে, তবে Pooled বেশি নিরাপদ) |
