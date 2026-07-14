import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { MarkdownContent } from '@/components/MarkdownContent'
import setupData from '@/lib/setup-data.json'
import { fetchDotfileContent } from '@/lib/github'
import Link from 'next/link'
import { 
  Laptop, 
  Monitor, 
  Keyboard, 
  Mouse, 
  Headphones, 
  Cpu, 
  Terminal, 
  Code2, 
  Settings,
  ExternalLink,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const metadata = {
  title: 'Setup | George Ongoro',
  description: 'A detailed look at my workstation, hardware configuration, local developer tools, and dotfiles.',
}

interface PageProps {
  searchParams: Promise<{ file?: string }>
}

export default async function SetupPage({ searchParams }: PageProps) {
  const params = await searchParams
  const files = setupData.github.files
  const activeFileName = params.file || files[0].name
  
  // Find currently active file config
  const activeFile = files.find(f => f.name === activeFileName) || files[0]
  
  // Fetch content for the active dotfile
  let codeContent = ''
  try {
    codeContent = await fetchDotfileContent(activeFile.name)
  } catch (err) {
    codeContent = `# Error fetching dotfile content.\n# Try reloading the page.`
  }

  // Format code content into markdown so MarkdownContent renders it with beautiful styles & syntax highlighting
  const markdownCodeBlock = `\`\`\`bash\n${codeContent}\n\`\`\``

  // Map category strings to Lucide icons
  const getHardwareIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'computer':
        return <Laptop className="h-4 w-4 text-accent" />
      case 'display':
        return <Monitor className="h-4 w-4 text-accent" />
      case 'keyboard':
        return <Keyboard className="h-4 w-4 text-accent" />
      case 'mouse':
        return <Mouse className="h-4 w-4 text-accent" />
      case 'audio':
        return <Headphones className="h-4 w-4 text-accent" />
      default:
        return <Cpu className="h-4 w-4 text-accent" />
    }
  }

  const getSoftwareIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'os':
        return <Settings className="h-4 w-4 text-accent" />
      case 'editor':
        return <Code2 className="h-4 w-4 text-accent" />
      case 'terminal':
        return <Terminal className="h-4 w-4 text-accent" />
      default:
        return <Cpu className="h-4 w-4 text-accent" />
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative reading-page-bg">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 md:py-24 w-full">
        {/* Header section */}
        <header className="mb-16 text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase">
            Setup <span className="text-accent italic">&</span> Stack
          </h1>
          <p className="text-sm md:text-base text-muted-foreground font-medium uppercase tracking-wider">
            A comprehensive log of my workstation gear, active developer ecosystem, and shell configurations.
          </p>
        </header>

        {/* Dynamic layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Columns - Hardware & Software */}
          <div className="lg:col-span-5 space-y-12">
            
            {/* Hardware Section */}
            <section className="space-y-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground border-b border-foreground/5 pb-2">
                Workstation Hardware
              </h2>
              
              <div className="space-y-4">
                {setupData.hardware.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-5 border border-foreground/5 bg-background hover:-translate-y-0.5 transition-all duration-350 rounded-2xl shadow-sm flex gap-4"
                  >
                    <div className="h-9 w-9 rounded-xl bg-foreground/5 flex items-center justify-center shrink-0">
                      {getHardwareIcon(item.category)}
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase bg-foreground/5 px-2 py-0.5 rounded text-muted-foreground tracking-wider">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-tight">{item.name}</h3>
                      <p className="text-[11px] font-bold text-muted-foreground/60 leading-relaxed">
                        {item.description}
                      </p>
                      {item.link && item.link !== '#' && (
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-accent hover:underline mt-1"
                        >
                          View Gear <ExternalLink size={8} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Software Section */}
            <section className="space-y-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground border-b border-foreground/5 pb-2">
                Development Environment
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {setupData.software.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-5 border border-foreground/5 bg-background rounded-2xl shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase bg-foreground/5 px-2 py-0.5 rounded text-muted-foreground tracking-wider">
                        {item.category}
                      </span>
                      {getSoftwareIcon(item.category)}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xs font-black uppercase tracking-tight">{item.name}</h3>
                      <p className="text-[10px] font-bold text-muted-foreground/50 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Columns - Interactive Dotfiles Shell */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground border-b border-foreground/5 pb-2">
              Dotfiles & Configurations
            </h2>

            {/* Terminal Window Mockup */}
            <div className="border border-foreground/10 bg-[#0d1117]/95 rounded-[24px] shadow-lg overflow-hidden flex flex-col min-h-[500px]">
              
              {/* Terminal Titlebar */}
              <div className="bg-[#161b22] px-5 py-3 border-b border-[#30363d] flex items-center justify-between select-none">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="text-[9px] font-black uppercase text-[#8b949e] tracking-widest font-mono flex items-center gap-1">
                  <Terminal size={10} />
                  geohack@workspace: ~/{setupData.github.repo}/{activeFile.path}
                </div>
                <div className="w-12" /> {/* spacer */}
              </div>

              {/* Terminal Tabs (Select Configuration) */}
              <div className="bg-[#0d1117] border-b border-[#30363d] px-4 flex flex-wrap gap-1 py-2">
                {files.map((file) => {
                  const isActive = file.name === activeFileName
                  return (
                    <Link
                      key={file.name}
                      href={`/setup?file=${file.name}`}
                      scroll={false}
                      className={cn(
                        "px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg transition-colors font-mono cursor-pointer",
                        isActive
                          ? "bg-[#21262d] text-[#c9d1d9] border border-[#30363d]"
                          : "text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#161b22]/50"
                      )}
                    >
                      {file.name}
                    </Link>
                  )
                })}
              </div>

              {/* Tab metadata description */}
              <div className="bg-[#161b22]/40 px-6 py-3 border-b border-[#30363d] text-[10px] text-[#8b949e] italic font-mono flex items-center gap-2">
                <ChevronRight size={10} className="text-accent" />
                {activeFile.description}
              </div>

              {/* Code Highlight Container */}
              <div className="p-6 overflow-x-auto flex-1 font-mono text-sm leading-relaxed">
                <MarkdownContent content={markdownCodeBlock} />
              </div>
            </div>

            {/* GitHub Remote Info */}
            <div className="flex items-center justify-between p-4 border border-foreground/5 bg-background rounded-2xl text-[10px] font-bold text-muted-foreground/60">
              <span className="flex items-center gap-1">
                Synced dynamically from
                <a 
                  href={`https://github.com/${setupData.github.username}/${setupData.github.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground font-black hover:underline inline-flex items-center gap-0.5"
                >
                  {setupData.github.username}/{setupData.github.repo} <ExternalLink size={8} />
                </a>
              </span>
              <span>Updated on push</span>
            </div>

          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  )
}
