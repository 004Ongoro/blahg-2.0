import setupData from '@/lib/setup-data.json'

export async function fetchDotfileContent(fileKey: string): Promise<string> {
  const fileConfig = setupData.github.files.find((f) => f.name === fileKey || f.path === fileKey)

  if (!fileConfig) {
    throw new Error('File not found in configuration')
  }

  const { username, repo } = setupData.github
  const path = fileConfig.path

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

  // Return fallback placeholder
  return `# Error loading ${fileKey} from GitHub (${fetchError})
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
alias vi="nvim"
alias vim="nvim"

# Next.js & Node settings
export NODE_ENV="development"
`
}
