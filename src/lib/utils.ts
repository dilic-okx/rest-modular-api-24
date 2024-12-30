export default class Utils {
  public static log = (str: string, color?: string): void => {
    if (!color) {
      console.log(str)
      return
    }
    console.log('\x1b[' + color + 'm' + str + '\x1b[0m')
  }

  public static cliPalette = (): void => {
    for (let i = 30; i < 98; i++) {
      if (i > 49 && i < 89) continue
      Utils.log(i + '', i + '')
    }
  }

  public static clr = (str: string, color?: string): string =>
    '\x1b[' + color + 'm' + str + '\x1b[0m'
}
