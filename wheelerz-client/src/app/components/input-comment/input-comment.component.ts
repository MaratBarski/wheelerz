import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { Attachment } from 'src/app/models/story'
import { ImageService } from 'src/app/services/image.service'
import { FileImage } from 'src/app/models/fileImage'
import { FileImageComponent } from '../file-image/file-image.component'
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule } from '@angular/common/http'

@Component({
  selector: 'app-input-comment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    TranslatePipe,
    FileImageComponent,
    AngularEditorModule
  ],
  templateUrl: './input-comment.component.html',
  styleUrls: ['./input-comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputCommentComponent {
  @Input() form!: FormGroup
  @Input() controlName = 'comments'
  @Input() titlePlaceholder = 'title'
  @Input() commentPlaceholder = 'your_story'
  @Input() images?: Attachment[]
  @Input() files: FileImage[] = []
  @Input() isEditor = true
  @Input() editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '500px',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '4',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [
        'undo',
        'redo',
        //'bold',
        //'italic',
        //'underline',
        'strikeThrough',
        'subscript',
        'superscript',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'indent',
        'outdent',
        'insertUnorderedList',
        'insertOrderedList',
        'heading',
        'fontName'
      ],
      [
        'fontSize',
        'textColor',
        'backgroundColor',
        'customClasses',
        //'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode'
      ]
    ]
  };
  
  @Output() onImageUpdates = new EventEmitter<FileImage[]>()

  @ViewChild('file') file!: ElementRef<HTMLInputElement>
  @ViewChild('div') div!: ElementRef<HTMLDivElement>

  imageService = inject(ImageService)
  changeDetectorRef = inject(ChangeDetectorRef)

  openAttachment(): void {
    this.file.nativeElement.click()
  }

  deleteImage(i: any): void {
    this.files = this.files.filter(x => x !== i)
    this.onImageUpdates.emit(this.files)
  }

  async changeFile(event: any) {
    if (!event?.target?.files?.length) return

    for (let i = 0; i < event.target.files.length; i++) {
      const mimeType = event.target.files[i].type
      if (mimeType.match(/image\/*/) == null) continue

      const url = await this.imageService.getPreview(event.target.files[i])
      this.files = [...this.files, url]
    }
    this.file.nativeElement.value = ''
    this.changeDetectorRef.markForCheck()
    this.onImageUpdates.emit(this.files)
  }

  findNode(node: Node | null): { node: Node, index: number } | undefined {
    if (!node) return undefined
    for (let i = 0; i < this.div.nativeElement.childNodes.length; i++) {
      const elm = this.div.nativeElement.childNodes.item(i)
      if (elm.isSameNode(node) || elm.isSameNode(node.parentNode as any)) return { node: elm, index: i }
    }
    return undefined
  }

  updateDiv(): void {
    console.log(this.div.nativeElement.innerHTML)
    if (this.div.nativeElement.innerText.trim() === '') {
      this.div.nativeElement.innerHTML = ''
    }
  }

  setTag(tag: string): void {
    const selection = window.getSelection()
    if (!selection) return
    let anchorNode = this.findNode(selection.anchorNode)
    const focusNode = this.findNode(selection.focusNode)
    if (!anchorNode || !focusNode) return
    let startIndex = -1
    let endIndex = -1
    const range = [anchorNode, focusNode].sort((a, b) => a.index < b.index ? -1 : 1)
    if (anchorNode.node === focusNode.node) {
      startIndex = Math.min(selection.focusOffset, selection.anchorOffset)
      endIndex = Math.max(selection.focusOffset, selection.anchorOffset);
    }

    let i1 = 0
    let i2 = 0

    let startFound = false
    let endFound = false
    for (let i = 0; i < this.div.nativeElement.childNodes.length; i++) {
      const elm = this.div.nativeElement.childNodes.item(i)
      if (startFound && endFound) break
      if (elm.isSameNode(range[0].node)) {
        i1 += (startIndex !== -1 ? startIndex : selection.focusOffset)
        startFound = true
      } else if (!startFound) { i1 += elm.textContent?.length || 0 }

      if (elm.isSameNode(range[1].node)) {
        i2 += (endIndex !== -1 ? endIndex : selection.anchorOffset)
        endFound = true
      } else if (!endFound) { i2 += elm.textContent?.length || 0 }
    }

    const html = this.div.nativeElement.innerHTML || ''
    let newText = ''

    let j = 0
    for (let i = 0; i < html.length; i++) {
      if (html.charAt(i) === '<') {
        while (html.charAt(i) !== '>') {
          newText += html.charAt(i);
          i++
        }
        newText += html.charAt(i);
        continue
      }
      j++
      if (j === i1 + 1) newText += `<${tag}>`
      if (j === i2 + 1) newText += `</${tag}>`
      newText += html.charAt(i)
    }
    //this.createHtmlList(newText)
    //console.log(this.fixTags(j + i1, j + i2, newText))
    this.div.nativeElement.innerHTML = newText
    //console.log(newText)
  }

  createHtmlList(text: string): void {
    let i = 0
    let str = ''
    const ar = []
    for (i = 0; i < text.length; i++) {
      let ch = text.charAt(i)
      if (ch === '<') {
        str = '<'
        while (ch !== '>') {
          i++
          ch = text.charAt(i)
          str += ch
        }
      } else {
        str += ch
        while (ch !== '<' && i < text.length) {
          i++
          ch = text.charAt(i)
          if (ch !== '<') str += ch
        }
        i--
      }
      ar.push(str)
      str = ''
    }
    console.log(ar)
  }

  fixTags(i1: number, i2: number, text: string): string {
    let res = ''
    return res
  }
}
