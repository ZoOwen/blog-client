'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'

const Navbar = () => {
  const [scrolled, setScrolled]     = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchVal, setSearchVal]   = useState('')
  const [clock, setClock]           = useState('')
  const router = useRouter()

  useEffect(() => {
    const tick = () => {
      const t = new Date()
      const p = n => String(n).padStart(2, '0')
      setClock(`${p(t.getHours())}:${p(t.getMinutes())}:${p(t.getSeconds())}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchVal.trim()) {
      router.push(`/blog?search=${encodeURIComponent(searchVal.trim())}`)
      setSearchOpen(false)
      setSearchVal('')
    }
  }

  return (
    <>
      <nav className={`
        fixed top-0 left-0 right-0 z-50 h-14
        flex items-center justify-between px-10
        transition-all duration-300
        border-b border-[rgba(0,255,65,0.08)]
        ${scrolled
          ? 'bg-[rgba(2,11,4,0.96)] backdrop-blur-md'
          : 'bg-[rgba(2,11,4,0.75)] backdrop-blur-sm'
        }
      `}>

        {/* Logo */}
        <Link href="/blog" className="flex items-center gap-2 group">
          <span className="w-2 h-2 rounded-full bg-[#00ff41]
            shadow-[0_0_10px_#00ff41,0_0_20px_#00ff41] animate-pulse" />
          <span className="font-['Orbitron'] text-sm font-bold text-[#00ff41]
            tracking-[3px] uppercase transition-all
            group-hover:[text-shadow:0_0_12px_rgba(0,255,65,0.6)]">
            SYS://BLOG
          </span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-4">
          <button onClick={() => setSearchOpen(!searchOpen)}
            className="text-[#2e5c38] hover:text-[#00ff41] transition-colors">
            {searchOpen ? <X size={15} /> : <Search size={15} />}
          </button>
          <span className="font-['Share_Tech_Mono'] text-[10px] text-[#2e5c38] tracking-[2px]">
            {clock}
          </span>
        </div>
      </nav>

      {/* Search dropdown */}
      {searchOpen && (
        <div className="fixed top-14 left-0 right-0 z-40
          bg-[#041008] border-b border-[rgba(0,255,65,0.1)]
          px-10 py-4">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-3">
            <input
              autoFocus
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Search posts..."
              className="flex-1 bg-[#020b04] border border-[rgba(0,255,65,0.15)]
                text-[#b8d4b0] font-['Share_Tech_Mono'] text-sm
                px-4 py-2 outline-none
                focus:border-[rgba(0,255,65,0.4)]
                placeholder:text-[#2e5c38] transition-colors"
              style={{ clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)' }}
            />
            <button type="submit"
              className="font-['Share_Tech_Mono'] text-[11px] tracking-[2px] uppercase
                px-5 py-2 border border-[rgba(0,255,65,0.3)]
                text-[#00ff41] bg-[rgba(0,255,65,0.05)]
                hover:bg-[#00ff41] hover:text-[#020b04] transition-all"
              style={{ clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)' }}>
              Search
            </button>
          </form>
        </div>
      )}
    </>
  )
}

export default Navbar