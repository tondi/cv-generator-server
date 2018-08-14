import * as express from 'express'
import index = require("./index")
const puppeteer = require('puppeteer');
const path = require('path');

class App {
  public express

  constructor() {
    this.express = express()
    this.mountRoutes()

  }

  private mountRoutes(): void {

    this.express.use('/', express.static(path.join(__dirname, '/test')))


    const router = express.Router()
    router.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '/test/index.html'));
    })
    router.get('/download', async (req, res) => {

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('http://localhost:4200/cv-generator');
      await page.pdf(
        {
          path: 'example1.pdf',
          format: 'A4',
          landscape: true,
          printBackground: true,
          margin: { left: '0', top: '0', right: '0', bottom: '0' }
        });
      console.log('pdf exported');
      await browser.close();

      var file = __dirname + '/example1.pdf';
      res.download(file); // Set disposition and send it.
    });
    this.express.use('/', router)
  }
}

export default new App().express
