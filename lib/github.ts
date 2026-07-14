import setupData from '@/lib/setup-data.json'

export interface RepoFile {
  name: string
  path: string
  description: string
}

// Map common files to user-friendly descriptions
const fileDescriptions: { [key: string]: string } = {
  '.zshrc': 'Zsh shell startup configurations and aliases.',
  '.p10k.zsh': 'Powerlevel10k theme layout and style definitions.',
  'setup.sh': 'Shell scripting to automate package installations and config symlinks.',
  '.gitignore': 'Files and patterns to ignore in Git tracking.',
  'README.md': 'Repository summary, installation steps, and documentation.',
}

export async function fetchRepoFiles(): Promise<RepoFile[]> {
  const { username, repo } = setupData.github
  const branches = ['main', 'master']
  let treeItems: any[] = []
  let success = false
  let fetchError = ''

  // Attempt to fetch from GitHub git trees API
  for (const branch of branches) {
    const url = `https://api.github.com/repos/${username}/${repo}/git/trees/${branch}?recursive=1`
    try {
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'blahg-app',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      })

      if (res.ok) {
        const data = await res.json()
        if (data.tree && Array.isArray(data.tree)) {
          treeItems = data.tree
          success = true
          break
        }
      } else {
        fetchError = `Status ${res.status}`
      }
    } catch (err: any) {
      fetchError = err?.message || 'Network error'
    }
  }

  if (success && treeItems.length > 0) {
    const binaryExtensions = [
      '.png', '.jpg', '.jpeg', '.gif', '.ico', '.webp', 
      '.woff', '.woff2', '.ttf', '.otf', '.eot', 
      '.zip', '.gz', '.tar', '.tgz', '.pdf', '.exe', '.bin'
    ]

    return treeItems
      .filter((item) => {
        if (item.type !== 'blob') return false
        const pathLower = item.path.toLowerCase()
        // Exclude hidden folders like .git or .github configurations if any, and binary files
        if (pathLower.startsWith('.git/') || pathLower.startsWith('.github/')) return false
        return !binaryExtensions.some((ext) => pathLower.endsWith(ext))
      })
      .map((item) => {
        const parts = item.path.split('/')
        const name = parts[parts.length - 1]
        
        // Find or build description
        let description = 'Repository configuration file.'
        if (fileDescriptions[name]) {
          description = fileDescriptions[name]
        } else if (item.path.includes('.config/')) {
          description = `Configuration settings for ${parts[parts.length - 2] || 'terminal component'}.`
        }

        return {
          name: item.path, // Use path as name to display correctly in tab select
          path: item.path,
          description,
        }
      })
  }

  console.warn(`Failed to fetch repo files: ${fetchError}. Falling back to default list.`)

  // Fallback structure in case of API failure (rate limits / offline)
  return [
    {
      name: '.zshrc',
      path: '.zshrc',
      description: 'Zsh shell startup configurations and aliases.'
    },
    {
      name: '.p10k.zsh',
      path: '.p10k.zsh',
      description: 'Powerlevel10k theme layout and style definitions.'
    },
    {
      name: 'setup.sh',
      path: 'setup.sh',
      description: 'Shell scripting to automate package installations and config symlinks.'
    }
  ]
}

export async function fetchDotfileContent(path: string): Promise<string> {
  const { username, repo } = setupData.github
  const branches = ['main', 'master']
  let content = ''
  let success = false
  let fetchError = ''

  for (const branch of branches) {
    const url = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${path}`
    try {
      const res = await fetch(url, {
        next: { revalidate: 3600 }, // Cache for 1 hour
      })

      if (res.ok) {
        content = await res.text()
        success = true
        break
      } else {
        fetchError = `GitHub responded with status ${res.status}`
      }
    } catch (err: any) {
      fetchError = err?.message || 'Network error'
    }
  }

  if (success) {
    return content
  }

  return `# Error loading ${path} from GitHub (${fetchError})
# ----------------------------------------------------
# Double-check that:
# 1. The GitHub repository ${username}/${repo} is public.
# 2. The file exists at path '${path}' on the 'main' or 'master' branch.
#
# Here is a local fallback configuration placeholder:

alias gs="git status -sb"
alias gl="git log --oneline --graph --all"
alias gd="git diff"
alias gp="git push"
`
}

