import Link from 'next/link'

const Footer = () => (
  <footer className="border-t border-[rgba(0,255,65,0.08)] mt-20">
    <div className="max-w-4xl mx-auto px-6 py-8
      flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse" />
        <span className="font-mono text-xs text-[#2e5c38] tracking-widest">
          SYS://BLOG — {new Date().getFullYear()}
        </span>
      </div>
      <div className="flex items-center gap-6">
        <Link href="/blog"
          className="font-mono text-[10px] text-[#2e5c38] hover:text-[#00ff41]
            tracking-widest uppercase transition-colors">
          Blog
        </Link>
        <Link href="/about"
          className="font-mono text-[10px] text-[#2e5c38] hover:text-[#00ff41]
            tracking-widest uppercase transition-colors">
          About
        </Link>
      </div>
      <span className="font-mono text-[10px] text-[#2e5c38] tracking-widest">
        ALL SYSTEMS OPERATIONAL ■
      </span>
    </div>
  </footer>
)

export default Footer