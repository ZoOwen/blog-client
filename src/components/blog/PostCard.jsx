import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Eye, Clock } from 'lucide-react'

export const FeaturedCard = ({ post }) => (
  <Link href={`/blog/${post.slug}`}
    className="block p-10 border-b border-[rgba(0,255,65,0.08)]
      relative overflow-hidden group
      hover:bg-[#041008] transition-all duration-300">

    {/* Top gradient line */}
    <div className="absolute top-0 left-0 right-0 h-px
      bg-gradient-to-r from-[#00ff41] via-[#a8ff3e] to-transparent" />

    <div className="flex items-center gap-3 mb-5">
      <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41]
        shadow-[0_0_8px_#00ff41] animate-pulse" />
      <span className="font-['Share_Tech_Mono'] text-[9px] tracking-[3px]
        text-[#00ff41] uppercase">Latest Post</span>
    </div>

    <h2 className="font-['Orbitron'] text-2xl md:text-3xl font-bold
      text-[#b8d4b0] leading-tight mb-4 tracking-wide
      group-hover:text-[#00ff41] transition-colors duration-300">
      {post.title}
    </h2>

    <p className="text-[#2e5c38] text-sm font-light leading-relaxed
      max-w-2xl mb-6">
      {post.excerpt}
    </p>

    <div className="flex items-center gap-4 flex-wrap">
      {/* Tags */}
      <div className="flex gap-2 flex-wrap">
        {post.tags?.slice(0, 3).map(tag => (
          <span key={tag._id}
            className="font-['Share_Tech_Mono'] text-[9px] tracking-[1.5px]
              px-3 py-1 border border-[rgba(0,255,65,0.08)]
              text-[#2e5c38] uppercase
              group-hover:border-[rgba(0,255,65,0.2)]
              group-hover:text-[#00ff41] transition-all"
            style={{ clipPath: 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)' }}>
            {tag.name}
          </span>
        ))}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 ml-auto">
        <span className="font-['Share_Tech_Mono'] text-[10px] text-[#2e5c38]
          flex items-center gap-1.5">
          <Eye size={10} /> {post.stats?.views || 0}
        </span>
        <span className="font-['Share_Tech_Mono'] text-[10px] text-[#2e5c38]
          flex items-center gap-1.5">
          <Clock size={10} /> {post.stats?.readTime || 1} min
        </span>
        <span className="font-['Share_Tech_Mono'] text-[10px] text-[#2e5c38]">
          {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
        </span>
      </div>
    </div>

    <div className="mt-5 font-['Share_Tech_Mono'] text-[10px] tracking-[2px]
      text-[#00ff41] uppercase flex items-center gap-2
      group-hover:[text-shadow:0_0_8px_rgba(0,255,65,0.5)] transition-all">
      Read post <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
    </div>
  </Link>
)

export const PostCard = ({ post, index }) => (
  <Link href={`/blog/${post.slug}`}
    className="grid grid-cols-[56px_1fr] border-b border-[rgba(0,255,65,0.06)]
      relative overflow-hidden group
      hover:bg-[#041008] transition-colors duration-200">

    {/* Left bar on hover */}
    <div className="absolute top-0 left-0 bottom-0 w-0.5 bg-[#00ff41]
      scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300" />

    {/* Number */}
    <div className="font-['Share_Tech_Mono'] text-[10px] tracking-[2px]
      text-[#2e5c38] pt-7 pl-6">
      {String(index).padStart(3, '0')}
    </div>

    {/* Content */}
    <div className="py-6 pr-8">
      <div className="flex gap-2 mb-3 flex-wrap">
        {post.tags?.slice(0, 2).map(tag => (
          <span key={tag._id}
            className="font-['Share_Tech_Mono'] text-[9px] tracking-[1.5px]
              px-2.5 py-0.5 border border-[rgba(0,255,65,0.08)]
              text-[#2e5c38] uppercase"
            style={{ clipPath: 'polygon(0 0,calc(100% - 5px) 0,100% 5px,100% 100%,0 100%)' }}>
            {tag.name}
          </span>
        ))}
        {post.category && (
          <span className="font-['Share_Tech_Mono'] text-[9px] tracking-[1.5px]
            px-2.5 py-0.5 border border-[rgba(0,255,65,0.06)]
            text-[#2e5c38] uppercase"
            style={{ color: post.category.color || '#2e5c38' }}>
            {post.category.name}
          </span>
        )}
      </div>

      <h3 className="font-['Orbitron'] text-sm font-semibold tracking-wide
        text-[#b8d4b0] mb-2 leading-snug
        group-hover:text-[#00ff41] transition-colors">
        {post.title}
      </h3>

      <p className="font-['Rajdhani'] text-xs text-[#2e5c38] leading-relaxed
        mb-3 line-clamp-2">
        {post.excerpt}
      </p>

      <div className="font-['Share_Tech_Mono'] text-[9px] text-[#2e5c38]
        flex items-center gap-3">
        <span>{post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}</span>
        <span>·</span>
        <span>{post.stats?.readTime || 1} min read</span>
        <span>·</span>
        <span className="flex items-center gap-1"><Eye size={9} /> {post.stats?.views || 0}</span>
      </div>
    </div>
  </Link>
)