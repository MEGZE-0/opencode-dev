export const KeyMod = {
  CtrlCmd: 1 << 11,
}

export const KeyCode = {
  KeyK: 37,
}

export const editor = {
  createModel(content: string) {
    return new TextModel(content)
  },
  create(container: HTMLElement, options: { model?: TextModel }) {
    return new TextEditor(container, options.model)
  },
}

class TextModel {
  constructor(private content: string) {}

  getValue() {
    return this.content
  }

  setValue(value: string) {
    this.content = value
  }

  getValueInRange() {
    return this.content
  }

  dispose() {}
}

class TextEditor {
  private textarea = document.createElement("textarea")
  private model?: TextModel
  private listener?: () => void

  constructor(container: HTMLElement, model?: TextModel) {
    this.textarea.className = "h-full w-full resize-none bg-background-base p-3 font-mono text-13-regular text-text-base outline-none"
    this.textarea.spellcheck = false
    this.textarea.value = model?.getValue() ?? ""
    this.model = model
    container.replaceChildren(this.textarea)
  }

  addCommand() {}

  onDidChangeModelContent(listener: () => void) {
    this.listener = listener
    this.textarea.addEventListener("input", this.handleInput)
    return { dispose: () => this.textarea.removeEventListener("input", this.handleInput) }
  }

  getValue() {
    return this.textarea.value
  }

  getSelection() {
    return undefined
  }

  setModel(model: TextModel) {
    this.model = model
    this.textarea.value = model.getValue()
  }

  dispose() {
    this.textarea.remove()
  }

  private handleInput = () => {
    this.model?.setValue(this.textarea.value)
    this.listener?.()
  }
}
