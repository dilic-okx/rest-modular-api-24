import { Curl, CurlOption, curly } from 'node-libcurl'

interface ScrapperOptionsInterface {
  [key: string]: CurlOption
}

export default class Scraper {
  private curl: any
  private url: any
  private data: any
  constructor(url: string, options?: ScrapperOptionsInterface) {
    this.curl = new Curl()
    this.url = url
    this.curl.setOpt(Curl.option.URL, url)
    /*if (options && Object.keys(options).length > 0) {
      for (const key of Object.keys(options)) {
        this.curl.setOpt(Curl.option[key], options[key])
      }
    }*/
    this.curl.on('error', this.curl.close.bind(this.curl))
    this.curl.on('end', (statusCode: string, data: any, headers: any) => {
      console.log('-- scrapper time:', this.curl.getInfo('TOTAL_TIME'))
      console.log('-- scrapper status:', statusCode)
      console.log('-- scrapper headers:', headers)
      console.log('-- scrapper data', data)
      this.data = data
      this.curl.close()
    })
  }
  perform() {
    this.curl.perform()
  }
  async performAsync() {
    return curly.get(this.url, {
      httpHeader: [
        'Content-Type: application/json',
        'Accept: application/json'
      ],
      connectTimeout: 9
    })
  }
}
