import { CommonModule } from '@angular/common'
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core'
import { NG_VALUE_ACCESSOR } from '@angular/forms'

import { MatIconModule } from '@angular/material/icon'
import { MatRippleModule } from '@angular/material/core'

import { createFileList } from 'src/utils/dom.utils'



@Component({
  standalone: true,

  selector: 'file-picker',
  templateUrl: './file-picker.component.html',
  styleUrls: ['./file-picker.component.css'],

  imports: [
    CommonModule,

    MatIconModule,
    MatRippleModule,
  ],

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FilePickerComponent,
      multi: true,
    }
  ],
})
export class FilePickerComponent implements AfterViewInit {

  readonly hostElementRef = inject(ElementRef) as ElementRef<HTMLElement>

  get hostElement() {
    return this.hostElementRef.nativeElement
  }

  @ViewChild('input_file')
  readonly inputFileRef: ElementRef<HTMLInputElement | null> | undefined

  get inputFile() {
    // debugger
    return this.inputFileRef?.nativeElement ?? null
  }

  @Input()
  defaultValue: File | File[] | null = null

  @Input()
  multiple: HTMLInputElement['multiple'] = false

  @Input()
  accept: HTMLInputElement['accept'] = '*/*'

  @Input()
  name: HTMLInputElement['name'] | null = null

  @Input()
  noFileSelectedMessage: string | null = null

  @Input()
  disabled: boolean = false


  ngAfterViewInit() {
    window.setTimeout(() => this.init(), 0)
  }

  init() {
    this.setDisabledState(this.#initialDisabledState)

    this.#onChange(this.defaultValue)

    const labelText = this.hostElement.querySelector('.label-text') as HTMLElement

    if (labelText) {
      labelText.textContent = labelText.textContent!.trim()
    }
  }

  get value() {
    if (this.inputFile == null) {
      return null
    }

    if (this.inputFile.files == null) {
      return null
    }

    if (this.inputFile.files.length === 0) {
      return null
    }

    return this.multiple ? Array.from(this.inputFile.files) : this.inputFile.files[0]!
  }

  @Output()
  readonly change = new EventEmitter<null | File | File[]>()

  @Output()
  readonly cancel = new EventEmitter<void>()

  onInputFileChange() {
    this.#onChange(this.value)
    this.change.emit(this.value)
  }

  onInputFileCancel() {
    this.cancel.emit()
  }

  isFile(value: unknown): value is File {
    return value instanceof File
  }

  // ControlValueAccessor

  writeValue(value: File | File[] | null) {
    if (this.inputFile == null) {
      return
    }

    if (value == null) {
      this.inputFile.files = createFileList()
      return
    }

    this.inputFile.files = createFileList(value)
  }

  #onChange: any = () => {}

  registerOnChange(fn: any) {
    this.#onChange = fn
  }

  #onTouched: any = () => {}

  registerOnTouched(fn: any) {
    this.#onTouched = fn
  }

  #initialDisabledState!: boolean

  setDisabledState(isDisabled: boolean) {
    if (this.inputFile == null) {
      this.#initialDisabledState = isDisabled
      return
    }

    this.inputFile.disabled = isDisabled
  }

}
