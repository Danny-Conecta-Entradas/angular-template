type RequestFileOptions = {

  /**
   * Default value `'*​/*'`
   */
  accept?: string | null

  /**
   * Default value `false`
   */
  multiple?: boolean | null

}


export function requestFile<T extends RequestFileOptions>(options?: T): Promise<T['multiple'] extends true ? FileList : File> {
  // @ts-ignore
  if (!navigator.userActivation.isActive) {
    return Promise.reject(new Error(`Opening file picker requires user interaction.`))
  }

  // @ts-ignore
  options ??= {}

  // @ts-ignore
  options.accept ??= '*/*'
  // @ts-ignore
  options.multiple ??= false


  const input = Object.assign(document.createElement('input'), {
    type: 'file',
    accept: options!.accept,
    multiple: options!.multiple,
  })

  input.showPicker()

  return new Promise((resolve, reject) => {
    input.addEventListener('change', event => {
      // @ts-ignore
      resolve(options!.multiple ? input.files! : input.files![0]!)
    })

    input.addEventListener('cancel', event => {
      reject(new Error(`File selection was canceled.`))
    })
  })
}


export function createFileList(fileOrFiles?: File | File[]) {
  if (fileOrFiles instanceof File) {
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(fileOrFiles)

    return dataTransfer.files
  }

  const dataTransfer = new DataTransfer()

  for (const file of fileOrFiles ?? []) {
    dataTransfer.items.add(file)
  }

  return dataTransfer.files
}


export function downloadFile(options: {file: Blob | File, name?: string}) {
  const urlFile = URL.createObjectURL(options.file)

  const anchor = Object.assign(document.createElement('a'), {
    href: urlFile,
    download: (
      (
        options.name
        // @ts-ignore
        ?? options.file.name
      )
      || `file.${options.file.type.split('/')[1] ?? 'unknown'}`
    ),
  })

  document.head.append(anchor)

  anchor.click()

  anchor.remove()

  window.setTimeout(() => {
    URL.revokeObjectURL(urlFile)
  }, 1000)
}
