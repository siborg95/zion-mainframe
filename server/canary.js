const express = require('express');
const app = express();
app.get('/', (_req,res)=>res.status(200).send('API online'));
app.get('/health', (_req,res)=>res.status(200).json({ ok:true }));
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', ()=>console.log('Canary listening on', PORT));
