'use client'

import { useEffect } from 'react'

export function CodeExecutor() {
  useEffect(() => {
    // @ts-ignore
    window.runCode = async (button: HTMLButtonElement) => {
      const wrapper = button.closest('.code-block-wrapper')
      if (!wrapper) return

      const codeElement = wrapper.querySelector('code')
      if (!codeElement) return

      const code = codeElement.textContent || ''
      const langClass = Array.from(codeElement.classList).find(c => c.startsWith('language-'))
      const lang = langClass ? langClass.replace('language-', '') : ''

      let outputWrapper = wrapper.nextElementSibling as HTMLDivElement
      if (!outputWrapper || !outputWrapper.classList.contains('code-output-wrapper')) {
        outputWrapper = document.createElement('div')
        outputWrapper.className = 'code-output-wrapper'
        outputWrapper.innerHTML = `
          <div class="code-output-header">
            <span>Execution Result</span>
            <div class="flex items-center">
              <button class="code-output-btn clear-btn">Clear</button>
              <button class="code-output-btn close-btn">Close</button>
            </div>
          </div>
          <div class="code-output"></div>
        `
        wrapper.after(outputWrapper)

        // Add event listeners for clear and close
        outputWrapper.querySelector('.clear-btn')?.addEventListener('click', () => {
          const output = outputWrapper.querySelector('.code-output')
          if (output) output.textContent = ''
        })
        outputWrapper.querySelector('.close-btn')?.addEventListener('click', () => {
          outputWrapper.remove()
        })
      }

      const outputArea = outputWrapper.querySelector('.code-output') as HTMLDivElement
      outputArea.innerHTML = '<span class="animate-pulse">Running...</span>'
      button.disabled = true
      
      try {
        const result = await executeCode(lang, code, outputArea)
        if (result !== undefined) {
          const existingText = outputArea.textContent === 'Running...' ? '' : outputArea.textContent
          const newText = typeof result === 'string' ? result : JSON.stringify(result, null, 2)
          outputArea.textContent = existingText ? existingText + '\n' + newText : newText
        }
      } catch (err: any) {
        outputArea.innerHTML = `<span class="text-red-500 font-bold">Error:</span>\n${err.message}`
      } finally {
        button.disabled = false
      }
    }
  }, [])

  return null
}

async function executeCode(lang: string, code: string, outputArea: HTMLElement): Promise<any> {
  const normalizedLang = lang.toLowerCase()

  if (normalizedLang === 'js' || normalizedLang === 'javascript') {
    return executeJS(code, outputArea)
  }

  if (normalizedLang === 'ts' || normalizedLang === 'typescript') {
    return executeTS(code, outputArea)
  }

  if (normalizedLang === 'python' || normalizedLang === 'py') {
    return executePython(code, outputArea)
  }

  if (normalizedLang === 'react' || normalizedLang === 'jsx' || normalizedLang === 'tsx') {
    return executeReact(code, outputArea)
  }

  if (normalizedLang === 'cpp' || normalizedLang === 'c++') {
    return executeCPP(code, outputArea)
  }

  if (normalizedLang === 'go') {
    return executeGo(code, outputArea)
  }

  if (normalizedLang === 'java') {
    return executeJava(code, outputArea)
  }

  throw new Error(`Language "${lang}" is not supported for execution yet.`)
}

async function executeJS(code: string, outputArea: HTMLElement) {
  const logs: string[] = []
  const originalLog = console.log
  const originalError = console.error

  console.log = (...args) => {
    logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '))
    outputArea.textContent = logs.join('\n')
  }
  console.error = (...args) => {
    logs.push('❌ ' + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '))
    outputArea.textContent = logs.join('\n')
  }

  try {
    const result = await new Function(`return (async () => { ${code} })()`)()
    return result
  } finally {
    // We delay restoring console slightly to catch any trailing logs
    setTimeout(() => {
      console.log = originalLog
      console.error = originalError
    }, 100)
  }
}

async function executeTS(code: string, outputArea: HTMLElement) {
  const { transform } = await import('sucrase')
  const compiled = transform(code, {
    transforms: ['typescript', 'imports'],
  }).code
  return executeJS(compiled, outputArea)
}

async function executeReact(code: string, outputArea: HTMLElement) {
  outputArea.innerHTML = '<div id="react-mount" class="p-4 bg-white border-2 border-black mb-4"></div><div class="react-logs"></div>'
  const mountPoint = outputArea.querySelector('#react-mount') as HTMLElement
  const logArea = outputArea.querySelector('.react-logs') as HTMLElement

  const logs: string[] = []
  const customConsole = {
    log: (...args: any[]) => {
      logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '))
      logArea.textContent = logs.join('\n')
    },
    error: (...args: any[]) => {
      logs.push('❌ ' + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '))
      logArea.textContent = logs.join('\n')
    }
  }

  const { transform } = await import('sucrase')
  const compiled = transform(code, {
    transforms: ['typescript', 'jsx', 'imports'],
    jsxRuntime: 'classic'
  }).code

  const React = await import('react')
  const ReactDOM = await import('react-dom/client')

  const func = new Function('React', 'ReactDOM', 'mountPoint', 'console', `
    try {
      ${compiled}
      if (typeof App !== 'undefined') {
        const root = ReactDOM.createRoot(mountPoint);
        root.render(React.createElement(App));
      } else {
        console.error("No 'App' component found. Please define 'function App() { ... }'");
      }
    } catch (err) {
      console.error(err);
    }
  `)

  func(React, ReactDOM, mountPoint, customConsole)
}

let pyodide: any = null
async function executePython(code: string, outputArea: HTMLElement) {
  if (!pyodide) {
    outputArea.textContent = 'Loading Pyodide (Python WASM)...'
    // @ts-ignore
    if (!window.loadPyodide) {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js'
      document.head.appendChild(script)
      await new Promise(resolve => script.onload = resolve)
    }
    // @ts-ignore
    pyodide = await window.loadPyodide()
  }

  const logs: string[] = []
  pyodide.setStdout({
    batched: (str: string) => {
      logs.push(str)
      outputArea.textContent = logs.join('\n')
    }
  })

  try {
    return await pyodide.runPythonAsync(code)
  } catch (err: any) {
    throw new Error(err.message)
  }
}

async function executeCPP(code: string, outputArea: HTMLElement) {
  outputArea.innerHTML = '<span class="text-yellow-500">C++ execution via WASM requires a heavy compiler (~15MB). We recommend using an online sandbox for C++ currently.</span>'
  throw new Error("WASM-based C++ execution is under development.")
}

async function executeGo(code: string, outputArea: HTMLElement) {
  throw new Error("Go execution via WASM requires a ~10MB compiler. Integration coming soon.")
}

async function executeJava(code: string, outputArea: HTMLElement) {
  throw new Error("Java execution via WASM is currently disabled (>20MB runtime).")
}
