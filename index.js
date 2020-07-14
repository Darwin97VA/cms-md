const express = require('express')
const app = express()
const PORT = process.env.PORT || 3033
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const toHTML = require('./markdown-to-html-converter')
const AppReact = require('./frontend/src/App')
app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: true }))

app.post('/api/blog', (req, res) => {
   
})

app.get('/api/blog/:urlTitle', (req, res) => {
   try {
      const { urlTitle } = req.params
      const filePath = path.resolve(__dirname, 'pages', urlTitle+'.md')
      const content = fs.readFileSync(filePath, 'utf8')
      const html = toHTML(content)
      res.send(html)
   } catch(error) {
      res.status(400).send('El post solicitado no existe')
   }
})

app.get('^/$', (req, res) => {
   fs.readFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'), 'utf-8', (err, data) => {
      if(err) res.sendStatus(500).send('Ocurrió un error.')
      else {
         res.send(data.replace('<div id="root"></div>', `<div id="root">${}</div>`))
      }
   })

})

app.listen(PORT, () => console.log('Running in ', PORT, ' port.'))
