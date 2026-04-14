export function Footer() {
  return (
    <footer className="brutal-border border-t-3 bg-secondary mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            built with raw code & caffeine
          </p>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} // no rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}
