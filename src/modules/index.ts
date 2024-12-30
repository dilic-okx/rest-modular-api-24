import fs from 'fs'
import path from 'path'

const modules: any[] = fs.readdirSync(path.resolve(__dirname,'./'), { withFileTypes: true }).filter((itm: any) => itm.isDirectory()).map((itm: any) => itm.name)

export default modules
