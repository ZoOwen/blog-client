'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import toast from 'react-hot-toast'

const Sidebar = ({ totalPosts, categories, tags }) => {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [clock, setClock]     = useState('')
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

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await api.post('/subscribers', { email })
      toast.success('Subscribed! Check your email.')
      setEmail('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to subscribe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <aside className="space-y-8 sticky top-20">

      {/* Terminal */}
      <div>
        <div className="font-['Share_Tech_Mono'] text-[10px] tracking-[3px]
          text-[#00ff41] uppercase mb-4 pb-3
          border-b border-[rgba(0,255,65,0.08)]
          flex items-center gap-2">
          <span className="opacity-40">//</span> System
        </div>
        <div className="border border-[rgba(0,255,65,0.15)] bg-[#041008]"
          style={{ clipPath: 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%)' }}>
          <div className="flex items-center gap-1.5 px-3 py-2
            border-b border-[rgba(0,255,65,0.08)] bg-[rgba(0,255,65,0.03)]">
            {['#ff5f56','#ffbd2e','#27c93f'].map(c => (
              <div key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />
            ))}
            <span className="font-['Share_Tech_Mono'] text-[9px] text-[#2e5c38]
              ml-1 tracking-widest">blog.sys</span>
          </div>
          <div className="p-3 font-['Share_Tech_Mono'] text-[11px] leading-loose">
            <div className="flex gap-2">
              <span className="text-[#00ff41]">›</span>
              <span className="text-[#b8d4b0]">blog --stats</span>
            </div>
            <div className="pl-4 text-[#2e5c38]">
              total_posts: <span className="text-[#00ff41]">{totalPosts}</span>
            </div>
            <div className="pl-4 text-[#2e5c38]">
              categories: <span className="text-[#b8d4b0]">{categories.length}</span>
            </div>
            <div className="pl-4 text-[#2e5c38]">
              sys_time: <span className="text-[#ffd700]">{clock}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-[#00ff41]">›</span>
              <span className="text-[#b8d4b0]">&nbsp;
                <span className="inline-block w-1.5 h-3 bg-[#00ff41] opacity-90
                  shadow-[0_0_6px_#00ff41] animate-pulse align-middle" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <div className="font-['Share_Tech_Mono'] text-[10px] tracking-[3px]
            text-[#00ff41] uppercase mb-4 pb-3
            border-b border-[rgba(0,255,65,0.08)]
            flex items-center gap-2">
            <span className="opacity-40">//</span> Categories
          </div>
          <div className="space-y-0">
            {categories.map(cat => (
              <Link key={cat._id} href={`/blog?cat=${cat.slug}`}
                className="flex items-center justify-between py-3
                  border-b border-[rgba(0,255,65,0.06)]
                  group hover:bg-[rgba(0,255,65,0.02)]
                  transition-colors px-1">
                <span className="font-['Rajdhani'] text-sm font-medium
                  text-[#b8d4b0] group-hover:text-[#00ff41] transition-colors">
                  {cat.name}
                </span>
                <span className="font-['Share_Tech_Mono'] text-[9px] tracking-widest
                  text-[#2e5c38] px-2 py-0.5 border border-[rgba(0,255,65,0.08)]
                  group-hover:border-[rgba(0,255,65,0.2)]
                  group-hover:text-[#00ff41] transition-all">
                  {String(cat.postCount || 0).padStart(2, '0')}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div>
          <div className="font-['Share_Tech_Mono'] text-[10px] tracking-[3px]
            text-[#00ff41] uppercase mb-4 pb-3
            border-b border-[rgba(0,255,65,0.08)]
            flex items-center gap-2">
            <span className="opacity-40">//</span> Tags
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <Link key={tag._id} href={`/blog?tag=${tag.slug}`}
                className="font-['Share_Tech_Mono'] text-[9px] tracking-[1.5px]
                  px-3 py-1.5 border border-[rgba(0,255,65,0.08)]
                  text-[#2e5c38] uppercase
                  hover:border-[rgba(0,255,65,0.3)] hover:text-[#00ff41]
                  transition-all"
                style={{ clipPath: 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)' }}>
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter */}
      <div>
        <div className="font-['Share_Tech_Mono'] text-[10px] tracking-[3px]
          text-[#00ff41] uppercase mb-4 pb-3
          border-b border-[rgba(0,255,65,0.08)]
          flex items-center gap-2">
          <span className="opacity-40">//</span> Newsletter
        </div>
        <p className="font-['Rajdhani'] text-sm font-light text-[#2e5c38]
          leading-relaxed mb-4">
          Post baru langsung ke inbox lo. No spam.
        </p>
        <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="bg-[#041008] border border-[rgba(0,255,65,0.12)]
              text-[#b8d4b0] font-['Share_Tech_Mono'] text-xs
              px-3 py-2.5 outline-none
              focus:border-[rgba(0,255,65,0.3)]
              placeholder:text-[#2e5c38] transition-colors"
            style={{ clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)' }}
          />
          <button type="submit" disabled={loading}
            className="font-['Share_Tech_Mono'] text-[10px] tracking-[2px] uppercase
              py-2.5 border border-[rgba(0,255,65,0.2)]
              text-[#00ff41] bg-[rgba(0,255,65,0.04)]
              hover:bg-[#00ff41] hover:text-[#020b04]
              disabled:opacity-50 transition-all duration-300 relative overflow-hidden"
            style={{ clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)' }}>
            {loading ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
          </button>
        </form>
      </div>

    </aside>
  )
}

export default Sidebar