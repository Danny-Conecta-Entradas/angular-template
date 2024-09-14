class Console {

  log(message?: any, ...optionalParams: any[]) {
    window.console.log(message, ...optionalParams)
  }

  group(label: string | null, callback: () => void) {
    window.console.group(label)
    callback()
    window.console.groupEnd()
  }

  groupCollapsed(label: string | null, callback: () => void) {
    window.console.groupCollapsed(label)
    callback()
    window.console.groupEnd()
  }

  table(tabularData: any, properties?: readonly string[]) {
    //@ts-ignore
    window.console.table(tabularData, properties)
  }

  dir(item?: any, options?: any) {
    window.console.dir(item, options)
  }

  dirxml(...data: any[]) {
    window.console.dirxml(...data)
  }

  warn(message?: any, ...optionalParams: any[]) {
    window.console.warn(message, ...optionalParams)
  }

  error(message?: any, ...optionalParams: any[]) {
    window.console.error(message, ...optionalParams)
  }

  debug(message?: any, ...optionalParams: any[]) {
    window.console.error(message, ...optionalParams)
  }

  assert(condition?: boolean, ...data: any[]) {
    window.console.assert(condition, ...data)
  }

  createTime(label: string) {
    window.console.time(label)

    return {
      log(...data: any[]) {
        window.console.timeLog(label, ...data)
      },

      end() {
        window.console.timeEnd(label)
      },
    }
  }

  clear() {
    window.console.clear()
  }

  get memory() {
    //@ts-ignore
    return window.console.memory
  }

  profile(label?: string) {
    //@ts-ignore
    window.console.profile(label)
  }

  profileEnd(label?: string) {
    // @ts-ignore
    window.console.profileEnd(label)
  }

  trace(message?: any, ...optionalParams: any[]) {
    window.console.trace(message, ...optionalParams)
  }

  count(label?: string) {
    window.console.count(label)
  }

  countReset(label?: string) {
    window.console.countReset(label)
  }

  timeStamp(label?: string) {
    window.console.timeStamp(label)
  }

}

const console = new Console()

export default console
