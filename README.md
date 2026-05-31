# Middleware demo: Simple Express counter

This small Node.js/Express project demonstrates using middleware to count requests per URL and persist the counts in `counter.json`.

## What it does
- Middleware: increments a counter for every incoming request URL and writes the updated counters to `counter.json`.
- Routes: serves a few simple GET routes (`/`, `/home`, `/about`, `/backchodi`) and a 404 handler for others.

## Prerequisites
- Node.js (v14+ recommended)
- npm

## Install
1. Install dependencies:

```bash
npm install
```

## Run

Start the app with:

```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server listens on `PORT` environment variable or defaults to `3500`.

## Files
- [server.js](server.js) — main Express app and middleware
- [counter.json](counter.json) — persistent JSON object storing counts per URL
- [package.json](package.json) — project metadata and scripts

## Endpoints
- `/`, `/home` — home page (returns plain text)
- `/about` — about section (returns plain text)
- `/backchodi` — playful test route (returns plain text)
- Any other path — returns 404 with a short message

## How the middleware works

On each request the middleware:

1. Reads the in-memory `counters` object (loaded at startup from `counter.json`).
2. Increments the counter for `req.url.toLowerCase()`.
3. Writes the updated `counters` back to `counter.json`.

This keeps a simple persistent hit-counter per path.

## Example requests

```bash
curl http://localhost:3500/
curl http://localhost:3500/about
curl http://localhost:3500/backchodi
curl http://localhost:3500/unknown
```

## `server.js` (for reference)

```js
const express= require('express');
const path = require('path');
const { stringify } = require('querystring');
const fsPromises=require('fs').promises;
const PORT=process.env.PORT||3500;
const app=express();

async function counter()
{
   const data=await fsPromises.readFile(path.join(__dirname,'counter.json'),'utf-8');
    const count= JSON.parse(data)
    console.log(data);
    return count;
}

async function main(app)
{
    const counters= await counter();
    app.use(async(req,res,next)=>
    {
        const url =req.url.toLowerCase();
        counters[url.toLowerCase()]=(counters[url.toLowerCase()]||0)+1;
        await fsPromises.writeFile(path.join(__dirname,'counter.json'),JSON.stringify(counters,null,2));
        next()
    });
    
    app.get(['/','/Home','/home'],(req,res)=>
    {
        res.send("Welcome to the home page");
    })
    app.get(['/about','/About','/About.html'],(req,res)=>
    {
        res.send("Welcome to the about section")
    })
    app.get(['/backchodi','/Backchodi'],(req,res)=>
    {
        res.send("Aao Kuch Backchodi karte hai");
    })
    app.use((req,res)=>
    {
        res.status(404).send("Nothing here checkout proper urls.");
    })
    app.listen(PORT,()=>
    {
        console.log("Connection Sucessful");
    })

}
main(app);
```

## Notes & improvements
- The middleware writes `counter.json` on every request — for high traffic consider batching writes or using a proper datastore.
- Consider adding error handling around file reads/writes and a lock if multiple processes may write concurrently.

If you want, I can add a small endpoint to view the current counts (e.g., `/stats`).
