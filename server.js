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