'use client'

import React, { useState } from 'react'
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  Heading4,
  Code,
  FileCode,
  Quote,
  List,
  ListOrdered,
  CheckSquare,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Minus,
  Sparkles,
  BarChart2,
  Video,
  Info,
  Lightbulb,
  AlertTriangle,
  FileText,
  DollarSign,
  Plus,
  Trash2,
  X,
  Check,
} from 'lucide-react'
import { slugify } from '@/lib/utils'

interface EditorToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  content: string
  onChange: (value: string) => void
}

type CalloutType = 'note' | 'tip' | 'warning' | 'info' | 'sponsor'

export function EditorToolbar({ textareaRef, content, onChange }: EditorToolbarProps) {
  // Modal states
  const [showPollModal, setShowPollModal] = useState(false)
  const [showCalloutModal, setShowCalloutModal] = useState(false)
  const [showYouTubeModal, setShowYouTubeModal] = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [showCodeBlockModal, setShowCodeBlockModal] = useState(false)

  // Poll Builder state
  const [pollQuestion, setPollQuestion] = useState('')
  const [pollSlug, setPollSlug] = useState('')
  const [pollOptions, setPollOptions] = useState([
    { id: '', text: '' },
    { id: '', text: '' },
    { id: '', text: '' },
  ])
  const [autoSlug, setAutoSlug] = useState(true)

  // Callout state
  const [calloutType, setCalloutType] = useState<CalloutType>('tip')
  const [calloutTitle, setCalloutTitle] = useState('')
  const [calloutBody, setCalloutBody] = useState('')

  // YouTube state
  const [youtubeUrl, setYoutubeUrl] = useState('')

  // Link state
  const [linkText, setLinkText] = useState('')
  const [linkUrl, setLinkUrl] = useState('')

  // Code Block state
  const [codeLang, setCodeLang] = useState('typescript')

  // Helper: insert text at current selection in textarea
  const insertText = (
    before: string,
    after: string = '',
    defaultSelection: string = '',
    cursorOffsetInside?: number
  ) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = content.substring(start, end)
    const textToInsert = selected || defaultSelection

    const newContent =
      content.substring(0, start) + before + textToInsert + after + content.substring(end)

    onChange(newContent)

    // Set cursor back properly on next frame
    setTimeout(() => {
      textarea.focus()
      if (cursorOffsetInside !== undefined) {
        textarea.setSelectionRange(
          start + before.length + cursorOffsetInside,
          start + before.length + cursorOffsetInside
        )
      } else if (selected) {
        textarea.setSelectionRange(start + before.length, start + before.length + textToInsert.length)
      } else {
        const newCursor = start + before.length + textToInsert.length
        textarea.setSelectionRange(newCursor, newCursor)
      }
    }, 0)
  }

  // --- Handlers for formatting tools ---
  const handleBold = () => insertText('**', '**', 'bold text')
  const handleItalic = () => insertText('*', '*', 'italic text')
  const handleStrikethrough = () => insertText('~~', '~~', 'strikethrough text')
  const handleInlineCode = () => insertText('`', '`', 'code')
  const handleH2 = () => insertText('\n## ', '\n', 'Heading 2')
  const handleH3 = () => insertText('\n### ', '\n', 'Heading 3')
  const handleH4 = () => insertText('\n#### ', '\n', 'Heading 4')
  const handleQuote = () => insertText('\n> ', '\n', 'Quote')
  const handleBulletList = () => insertText('\n- ', '\n', 'List item')
  const handleNumberList = () => insertText('\n1. ', '\n', 'First item')
  const handleTaskList = () => insertText('\n- [ ] ', '\n', 'Task item')
  const handleDivider = () => insertText('\n\n---\n\n')
  const handleHighlight = () => insertText('!!', '!!', 'highlighted definition')
  const handleReference = () => insertText('[', ']', '1')

  const handleTable = () => {
    const tableTemplate = `\n| Header 1 | Header 2 | Header 3 |\n| :--- | :--- | :--- |\n| Cell 1 | Cell 2 | Cell 3 |\n| Cell 4 | Cell 5 | Cell 6 |\n\n`
    insertText(tableTemplate)
  }

  // Open Link Modal with pre-filled selection if any
  const openLinkModal = () => {
    const textarea = textareaRef.current
    if (textarea) {
      const selected = content.substring(textarea.selectionStart, textarea.selectionEnd)
      setLinkText(selected || '')
    }
    setLinkUrl('')
    setShowLinkModal(true)
  }

  const handleInsertLink = (e: React.FormEvent) => {
    e.preventDefault()
    if (!linkUrl) return
    const text = linkText.trim() || 'Link'
    insertText(`[${text}](${linkUrl.trim()})`)
    setShowLinkModal(false)
  }

  // Open Code Block Modal
  const handleInsertCodeBlock = () => {
    const template = `\n\`\`\`${codeLang}\n// Write ${codeLang} code here\n\`\`\`\n`
    insertText(template)
    setShowCodeBlockModal(false)
  }

  // Poll Builder Handlers
  const openPollModal = () => {
    setPollQuestion('')
    setPollSlug('')
    setAutoSlug(true)
    setPollOptions([
      { id: '', text: '' },
      { id: '', text: '' },
      { id: '', text: '' },
    ])
    setShowPollModal(true)
  }

  const handlePollQuestionChange = (q: string) => {
    setPollQuestion(q)
    if (autoSlug) {
      setPollSlug(slugify(q))
    }
  }

  const updatePollOption = (idx: number, field: 'text' | 'id', val: string) => {
    setPollOptions((prev) => {
      const updated = [...prev]
      updated[idx] = { ...updated[idx], [field]: val }
      if (field === 'text' && (!updated[idx].id || updated[idx].id === slugify(updated[idx].text))) {
        updated[idx].id = slugify(val)
      }
      return updated
    })
  }

  const addPollOption = () => {
    setPollOptions((prev) => [...prev, { id: '', text: '' }])
  }

  const removePollOption = (idx: number) => {
    if (pollOptions.length <= 2) return
    setPollOptions((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleInsertPoll = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pollQuestion.trim()) return

    const validOptions = pollOptions.filter((opt) => opt.text.trim())
    if (validOptions.length < 2) return

    const cleanSlug = pollSlug.trim() ? slugify(pollSlug) : slugify(pollQuestion) || `poll-${Date.now()}`
    const optionLines = validOptions
      .map((opt) => {
        const optId = opt.id.trim() ? slugify(opt.id) : slugify(opt.text)
        return `- ${optId}: ${opt.text.trim()}`
      })
      .join('\n')

    const pollMarkdown = `\n\n:::poll:${cleanSlug} "${pollQuestion.trim()}"\n${optionLines}\n:::\n\n`
    insertText(pollMarkdown)
    setShowPollModal(false)
  }

  // Callout Builder Handlers
  const openCalloutModal = () => {
    const textarea = textareaRef.current
    if (textarea) {
      const selected = content.substring(textarea.selectionStart, textarea.selectionEnd)
      setCalloutBody(selected || '')
    } else {
      setCalloutBody('')
    }
    setCalloutTitle('')
    setShowCalloutModal(true)
  }

  const handleInsertCallout = (e: React.FormEvent) => {
    e.preventDefault()
    const titlePart = calloutTitle.trim() ? ` ${calloutTitle.trim()}` : ''
    const bodyPart = calloutBody.trim() || 'Your callout content goes here...'
    const calloutMarkdown = `\n\n:::${calloutType}${titlePart}\n${bodyPart}\n:::\n\n`
    insertText(calloutMarkdown)
    setShowCalloutModal(false)
  }

  // YouTube Inserter Handlers
  const handleInsertYouTube = (e: React.FormEvent) => {
    e.preventDefault()
    if (!youtubeUrl.trim()) return
    insertText(`\n\n${youtubeUrl.trim()}\n\n`)
    setShowYouTubeModal(false)
    setYoutubeUrl('')
  }

  return (
    <div className="border border-foreground/10 rounded-2xl bg-card/60 backdrop-blur-md p-2 space-y-2 mb-3 shadow-2xs">
      {/* Top Row: Special Component Inserters */}
      <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-foreground/5">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60 px-2 flex items-center gap-1 shrink-0">
          Components:
        </span>

        {/* 1. Poll Builder Button */}
        <button
          type="button"
          onClick={openPollModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 hover:bg-accent hover:text-accent-foreground text-accent font-mono text-xs font-bold transition-all cursor-pointer shadow-2xs border border-accent/20"
          title="Insert Interactive Poll Widget"
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>+ Poll</span>
        </button>

        {/* 2. Callout / Side-note Button */}
        <button
          type="button"
          onClick={openCalloutModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground font-mono text-xs font-bold transition-all cursor-pointer border border-foreground/10"
          title="Insert Callout Box (Note, Tip, Warning, etc.)"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>+ Callout</span>
        </button>

        {/* 3. YouTube Embed Button */}
        <button
          type="button"
          onClick={() => setShowYouTubeModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground font-mono text-xs font-bold transition-all cursor-pointer border border-foreground/10"
          title="Insert YouTube Video Facade Card"
        >
          <Video className="w-3.5 h-3.5 text-red-500" />
          <span>+ YouTube</span>
        </button>

        {/* 4. Definition Highlight */}
        <button
          type="button"
          onClick={handleHighlight}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground font-mono text-xs font-bold transition-all cursor-pointer border border-foreground/10"
          title="Highlight definition syntax (!!text!!)"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
          <span>Highlight</span>
        </button>

        {/* 5. Reference Badge */}
        <button
          type="button"
          onClick={handleReference}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground font-mono text-xs font-bold transition-all cursor-pointer border border-foreground/10"
          title="Insert reference citation tag ([1])"
        >
          <span>[Ref]</span>
        </button>
      </div>

      {/* Bottom Row: Standard Markdown Text Formatting Tools */}
      <div className="flex flex-wrap items-center gap-1">
        {/* Headings */}
        <div className="flex items-center border-r border-foreground/10 pr-1.5 mr-1 gap-0.5">
          <button
            type="button"
            onClick={handleH2}
            className="p-1.5 rounded hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
            title="Heading 2 (## )"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleH3}
            className="p-1.5 rounded hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
            title="Heading 3 (### )"
          >
            <Heading3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleH4}
            className="p-1.5 rounded hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
            title="Heading 4 (#### )"
          >
            <Heading4 className="w-4 h-4" />
          </button>
        </div>

        {/* Inline styles */}
        <div className="flex items-center border-r border-foreground/10 pr-1.5 mr-1 gap-0.5">
          <button
            type="button"
            onClick={handleBold}
            className="p-1.5 rounded hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
            title="Bold (**text**)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleItalic}
            className="p-1.5 rounded hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
            title="Italic (*text*)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleStrikethrough}
            className="p-1.5 rounded hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
            title="Strikethrough (~~text~~)"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleInlineCode}
            className="p-1.5 rounded hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
            title="Inline Code (`code`)"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        {/* Code Block & Quote */}
        <div className="flex items-center border-r border-foreground/10 pr-1.5 mr-1 gap-0.5">
          <button
            type="button"
            onClick={() => setShowCodeBlockModal(true)}
            className="p-1.5 rounded hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
            title="Code Block with syntax highlighting"
          >
            <FileCode className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleQuote}
            className="p-1.5 rounded hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
            title="Blockquote (> )"
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center border-r border-foreground/10 pr-1.5 mr-1 gap-0.5">
          <button
            type="button"
            onClick={handleBulletList}
            className="p-1.5 rounded hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
            title="Bullet List (- )"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNumberList}
            className="p-1.5 rounded hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
            title="Numbered List (1. )"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleTaskList}
            className="p-1.5 rounded hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
            title="Task List (- [ ] )"
          >
            <CheckSquare className="w-4 h-4" />
          </button>
        </div>

        {/* Link, Table, Divider */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={openLinkModal}
            className="p-1.5 rounded hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
            title="Insert Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleTable}
            className="p-1.5 rounded hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
            title="Insert Table"
          >
            <TableIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleDivider}
            className="p-1.5 rounded hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
            title="Divider (---)"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 1. POLL BUILDER MODAL */}
      {/* ============================================================ */}
      {showPollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-200">
          <div className="bg-background border border-foreground/20 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-foreground/10 pb-4">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-accent" />
                <h3 className="font-sans font-black text-base uppercase tracking-wider">
                  Create Interactive Poll
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPollModal(false)}
                className="p-1 rounded-full hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInsertPoll} className="space-y-4">
              {/* Question */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                  Poll Question *
                </label>
                <input
                  type="text"
                  value={pollQuestion}
                  onChange={(e) => handlePollQuestionChange(e.target.value)}
                  placeholder="e.g. Which JavaScript runtime do you use most in production?"
                  required
                  className="w-full bg-background border border-foreground/15 rounded-xl px-3.5 py-2 text-sm font-medium focus:outline-none focus:border-accent"
                />
              </div>

              {/* Poll Slug */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                    Poll Slug (Unique ID) *
                  </label>
                  <label className="text-[10px] font-mono text-muted-foreground flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoSlug}
                      onChange={(e) => setAutoSlug(e.target.checked)}
                      className="rounded border-foreground/20 text-accent focus:ring-accent"
                    />
                    <span>Auto-sync with question</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={pollSlug}
                  onChange={(e) => {
                    setAutoSlug(false)
                    setPollSlug(e.target.value)
                  }}
                  placeholder="e.g. runtime-preference"
                  required
                  className="w-full bg-background border border-foreground/15 rounded-xl px-3.5 py-2 font-mono text-xs focus:outline-none focus:border-accent"
                />
              </div>

              {/* Options */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                    Poll Options (Min. 2) *
                  </label>
                  <button
                    type="button"
                    onClick={addPollOption}
                    className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-accent hover:underline uppercase"
                  >
                    <Plus className="w-3 h-3" /> Add Option
                  </button>
                </div>

                <div className="space-y-2.5">
                  {pollOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-muted-foreground/60 w-4 text-right">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => updatePollOption(idx, 'text', e.target.value)}
                        placeholder={`Option ${idx + 1} (e.g. Node.js)`}
                        className="flex-1 bg-background border border-foreground/15 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-accent"
                      />
                      <input
                        type="text"
                        value={opt.id}
                        onChange={(e) => updatePollOption(idx, 'id', e.target.value)}
                        placeholder="slug"
                        className="w-24 bg-background border border-foreground/15 rounded-xl px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground focus:outline-none focus:border-accent"
                        title="Option slug identifier"
                      />
                      {pollOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removePollOption(idx)}
                          className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                          title="Remove option"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-foreground/10">
                <button
                  type="button"
                  onClick={() => setShowPollModal(false)}
                  className="px-4 py-2 rounded-xl border border-foreground/10 text-xs font-bold hover:bg-foreground/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!pollQuestion.trim() || pollOptions.filter((o) => o.text.trim()).length < 2}
                  className="px-4 py-2 rounded-xl bg-accent text-accent-foreground text-xs font-bold font-mono uppercase tracking-wider hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer"
                >
                  Insert Poll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. CALLOUT BUILDER MODAL */}
      {/* ============================================================ */}
      {showCalloutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-200">
          <div className="bg-background border border-foreground/20 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-foreground/10 pb-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="font-sans font-black text-base uppercase tracking-wider">
                  Insert Callout Box
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCalloutModal(false)}
                className="p-1 rounded-full hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInsertCallout} className="space-y-4">
              {/* Type Picker */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                  Callout Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'tip', label: '💡 Tip' },
                      { id: 'note', label: '📝 Note' },
                      { id: 'warning', label: '⚠️ Warning' },
                      { id: 'info', label: 'ℹ️ Info' },
                      { id: 'sponsor', label: '🤝 Sponsor' },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCalloutType(item.id)}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all text-left ${
                        calloutType === item.id
                          ? 'border-accent bg-accent/15 text-accent font-black'
                          : 'border-foreground/10 hover:border-foreground/20'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  value={calloutTitle}
                  onChange={(e) => setCalloutTitle(e.target.value)}
                  placeholder="e.g. Pro-Tip, Important Note"
                  className="w-full bg-background border border-foreground/15 rounded-xl px-3.5 py-2 text-sm font-medium focus:outline-none focus:border-accent"
                />
              </div>

              {/* Body */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                  Content Body
                </label>
                <textarea
                  value={calloutBody}
                  onChange={(e) => setCalloutBody(e.target.value)}
                  placeholder="Write the message or explanation here..."
                  rows={4}
                  className="w-full bg-background border border-foreground/15 rounded-xl p-3 text-xs font-sans focus:outline-none focus:border-accent resize-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-foreground/10">
                <button
                  type="button"
                  onClick={() => setShowCalloutModal(false)}
                  className="px-4 py-2 rounded-xl border border-foreground/10 text-xs font-bold hover:bg-foreground/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-accent text-accent-foreground text-xs font-bold font-mono uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer"
                >
                  Insert Callout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. YOUTUBE EMBED MODAL */}
      {/* ============================================================ */}
      {showYouTubeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-200">
          <div className="bg-background border border-foreground/20 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-foreground/10 pb-4">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-red-500" />
                <h3 className="font-sans font-black text-base uppercase tracking-wider">
                  Insert YouTube Embed
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowYouTubeModal(false)}
                className="p-1 rounded-full hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInsertYouTube} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                  YouTube Video URL or ID
                </label>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                  className="w-full bg-background border border-foreground/15 rounded-xl px-3.5 py-2 text-sm font-medium focus:outline-none focus:border-accent"
                />
                <p className="text-[11px] text-muted-foreground">
                  Renders into an optimized facade player with cover art and 1-click playback.
                </p>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-foreground/10">
                <button
                  type="button"
                  onClick={() => setShowYouTubeModal(false)}
                  className="px-4 py-2 rounded-xl border border-foreground/10 text-xs font-bold hover:bg-foreground/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!youtubeUrl.trim()}
                  className="px-4 py-2 rounded-xl bg-accent text-accent-foreground text-xs font-bold font-mono uppercase tracking-wider hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer"
                >
                  Insert Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. LINK MODAL */}
      {/* ============================================================ */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-200">
          <div className="bg-background border border-foreground/20 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-foreground/10 pb-4">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-accent" />
                <h3 className="font-sans font-black text-base uppercase tracking-wider">
                  Insert Link
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="p-1 rounded-full hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInsertLink} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                  Link Text
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Text to display"
                  className="w-full bg-background border border-foreground/15 rounded-xl px-3.5 py-2 text-sm font-medium focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                  URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                  required
                  className="w-full bg-background border border-foreground/15 rounded-xl px-3.5 py-2 text-sm font-medium focus:outline-none focus:border-accent"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-foreground/10">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 rounded-xl border border-foreground/10 text-xs font-bold hover:bg-foreground/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!linkUrl.trim()}
                  className="px-4 py-2 rounded-xl bg-accent text-accent-foreground text-xs font-bold font-mono uppercase tracking-wider hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer"
                >
                  Insert Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. CODE BLOCK LANGUAGE MODAL */}
      {/* ============================================================ */}
      {showCodeBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-200">
          <div className="bg-background border border-foreground/20 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-foreground/10 pb-4">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-accent" />
                <h3 className="font-sans font-black text-base uppercase tracking-wider">
                  Code Block Language
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCodeBlockModal(false)}
                className="p-1 rounded-full hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {[
                  'typescript',
                  'javascript',
                  'tsx',
                  'bash',
                  'python',
                  'json',
                  'html',
                  'css',
                  'sql',
                  'rust',
                ].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      setCodeLang(lang)
                      const template = `\n\`\`\`${lang}\n// Write ${lang} code here\n\`\`\`\n`
                      insertText(template)
                      setShowCodeBlockModal(false)
                    }}
                    className={`p-2 rounded-xl border text-xs font-mono font-bold transition-all text-left ${
                      codeLang === lang
                        ? 'border-accent bg-accent/15 text-accent'
                        : 'border-foreground/10 hover:border-foreground/20'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
