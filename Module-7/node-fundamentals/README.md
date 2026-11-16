# 🚀 Node.js Core Fundamentals & Deep Architecture Guide

Node.js-এর গভীরে ঢুকে এর আর্কিটেকচার, মেমোরি মডেল, ইভেন্ট লুপ এবং ইন্টারনাল ওয়ার্কিং প্রিন্সিপাল আয়ত্ত করার জন্য এটি একটি পূর্ণাঙ্গ ইন্টারভিউ-রেডি হ্যান্ডবুক।

এখানে প্রতিটি টপিক পৃথক ফোল্ডারে বিস্তারিতভাবে বাংলা ভাষায়, ডায়াগ্রাম (Mermaid) এবং রিয়েল-ওয়ার্ল্ড কোড সহ ব্যাখ্যা করা হয়েছে।

---

## 📚 বিষয়বস্তুর তালিকা (Table of Contents)

### ১. পর্ব ১: সূচনা এবং সার্ভার জগতে বিপ্লব
- 📄 [১. Tracing Where Everything Began](./01-history-and-revolution/01-tracing-where-everything-began.md)
  - *২০০৯ সালের আগের সার্ভার জগত, The C10K Problem, রায়ান ডাল ও Flickr সমস্যা, Google V8 ইঞ্জিনের প্রভাব এবং Node.js-এর জন্ম।*
- 📄 [২. How Node.js Revolutionized the Server Landscape](./01-history-and-revolution/02-how-nodejs-revolutionized-the-server-landscape.md)
  - *Apache বনাম Node.js আর্কিটেকচার, Blocking বনাম Non-blocking I/O, ফুলস্ট্যাক জাভাস্ক্রিপ্ট রূপান্তর, Netflix ও PayPal কেস স্টাডি।*

---

### ২. পর্ব ২: আর্কিটেকচার ও থ্রেডিং মেকানিজম
- 📄 [৩. Event Driven Architecture of Node.js](./02-architecture-and-threading/03-event-driven-architecture.md)
  - *Observer Design Pattern, `EventEmitter` ক্লাস, `on`, `emit`, `once`, `sync` বনাম `async` মিথ, স্পেশাল `'error'` ইভেন্ট ও মেমোরি লিক প্রতিরোধ।*
- 📄 [৪. Single-Threaded Node.js vs Multithreaded Servers](./02-architecture-and-threading/04-single-threaded-vs-multithreaded-servers.md)
  - *Node.js কি আসলেই সিঙ্গেল থ্রেডেড? Libuv Thread Pool ও `UV_THREADPOOL_SIZE`, কার্নেল লেভেল অ্যাসিঙ্ক্রোনি, এবং `worker_threads` / `cluster` স্কেলিং।*

---

### ৩. পর্ব ৩: ইভেন্ট লুপের পুঙ্খানুপুঙ্খ ব্যবচ্ছেদ
- 📄 [৫. How Event Loop Works](./03-event-loop/05-how-event-loop-works.md)
  - *ইভেন্ট লুপের ৬টি ফেজ (Timers, Pending, Idle/Prepare, Poll, Check, Close), Microtask Queue (`nextTick` বনাম `Promise`), `setTimeout(0)` বনাম `setImmediate()` এবং জটিল ইন্টারভিউ পাজল সল্যুশন।*

---

### ৪. পর্ব ৪: স্ট্রিমিং ও মডিউল সিস্টেম
- 📄 [৬. Streams, Buffers & Modular Systems Deep Dive](./04-streams-and-buffers/06-streams-buffers-and-modular-systems.md)
  - *বাফার কী এবং কেন V8 হিপের বাইরে থাকে, `alloc` বনাম `allocUnsafe` সিকিউরিটি রিস্ক, ৪ ধরণের স্ট্রিম, Backpressure হ্যান্ডলিং (`pipeline`), CommonJS বনাম ESM, এবং Module Caching।*

---

### ৫. পর্ব ৫: ইন্টারনাল র‍্যাপার ও স্কোপ আইসোলেশন
- 📄 [৭. Harnessing IIFE as the Ultimate Module Wrapper](./05-internals-and-iife/07-harnessing-iife-as-the-ultimate-module-wrapper.md)
  - *ব্রাউজার গ্লোবাল পলিউশন বনাম Node.js স্কোপ, The Hidden Module Wrapper Function `(function(exports, require, module, __filename, __dirname))`, এবং `exports` বনাম `module.exports`-এর মাস্টার ইন্টারভিউ ট্র্যাপ।*

---

## 🎯 কুইক রিভিশন চিটশিট (Interview Quick Cheatsheet)

1. **Node.js কি সিঙ্গেল থ্রেডেড?**
   - আপনার জাভাস্ক্রিপ্ট কোড চলে একটি মাত্র থ্রেডে (Main Thread), কিন্তু ব্যাকগ্রাউন্ড I/O, ক্রিপ্টো এবং ফাইল অপারেশনের জন্য Libuv মাল্টিপল থ্রেড (Thread Pool) এবং ওএস কার্নেল ব্যবহার করে।
2. **`process.nextTick()` এর প্রাধান্য:**
   - এটি যে কোনো ইভেন্ট লুপ ফেজের চেয়ে আগে চলে। এমনকি `Promise.then()`-এর চেয়েও এর অগ্রাধিকার বেশি।
3. **`setImmediate()` বনাম `setTimeout(fn, 0)`:**
   - I/O কলব্যাকের ভেতর `setImmediate()` সর্বদা `setTimeout()` এর আগে চলে (কারণ Poll ফেজের পরেই Check ফেজ আসে)।
4. **`module.exports` বনাম `exports`:**
   - `exports` শুধুমাত্র `module.exports`-এর একটি রেফারেন্স। নতুন ভ্যালু বা ফাংশন সরাসরি অ্যাসাইন করতে চাইলে সবসময় `module.exports = ...` লিখতে হবে।
5. **বিগ ফাইল অপারেশনে কেন স্ট্রিম জরুরি?**
   - স্ট্রিম মেমোরিতে পুরো ফাইল লোড না করে ছোট ছোট চাঙ্কে (Chunk) ডাটা পাস করে, ফলে মেমোরি ওওএম (Out of Memory) ক্র্যাশ হয় না।
