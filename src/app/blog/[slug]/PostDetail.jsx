'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Eye, Clock, Calendar, ArrowLeft, Heart } from 'lucide-react'
import { formatDate, timeAgo } from '@/lib/utils'
import api from '@/lib/api'
import toast from 'react-hot-toast'

// ── Reading Progress Bar
const ReadingProgress = () => {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const fn = () => {
      const el  = document.documentElement
      const top = el.scrollTop || document.body.scrollTop
      const h   = el.scrollHeight - el.clientHeight
      setProgress(h > 0 ? (top / h) * 100 : 0)
    }
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <div className="fixed top-14 left-0 right-0 z-40 h-px bg-[rgba(0,255,65,0.08)]">
      <div className="h-full bg-[#00ff41] transition-all duration-100"
        style={{
          width: `${progress}%`,
          boxShadow: '0 0 8px rgba(0,255,65,0.6)',
        }} />
    </div>
  )
}

// ── Comment Form
const CommentForm = ({ postId, onSuccess }) => {
  const [form, setForm]     = useState({ name: '', email: '', content: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.content) {
      toast.error('All fields required')
      return
    }
    setLoading(true)
    try {
      await api.post(`/comments/${postId}`, form)
      toast.success('Comment submitted! Waiting for approval.')
      setForm({ name: '', email: '', content: '' })
      onSuccess?.()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit comment')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = `
    w-full bg-[#020b04] border border-[rgba(0,255,65,0.12)]
    text-[#b8d4b0] font-['Share_Tech_Mono'] text-xs
    px-3 py-2.5 outline-none
    focus:border-[rgba(0,255,65,0.35)]
    placeholder:text-[#2e5c38] transition-colors
  `

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-['Share_Tech_Mono'] text-[9px] tracking-widest
            text-[#00ff41] uppercase block mb-1.5">Name</label>
          <input value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            placeholder="Your name"
            className={inputCls}
            style={{ clipPath: 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)' }} />
        </div>
        <div>
          <label className="font-['Share_Tech_Mono'] text-[9px] tracking-widest
            text-[#00ff41] uppercase block mb-1.5">Email</label>
          <input value={form.email} type="email"
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            placeholder="your@email.com"
            className={inputCls}
            style={{ clipPath: 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)' }} />
        </div>
      </div>
      <div>
        <label className="font-['Share_Tech_Mono'] text-[9px] tracking-widest
          text-[#00ff41] uppercase block mb-1.5">Comment</label>
        <textarea value={form.content} rows={4}
          onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
          placeholder="Write your comment..."
          className={`${inputCls} resize-none`}
          style={{ clipPath: 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)' }} />
      </div>
      <button type="submit" disabled={loading}
        className="font-['Share_Tech_Mono'] text-[10px] tracking-widest uppercase
          px-6 py-2.5 border border-[rgba(0,255,65,0.25)]
          text-[#00ff41] bg-[rgba(0,255,65,0.04)]
          hover:bg-[#00ff41] hover:text-[#020b04]
          disabled:opacity-50 transition-all duration-300"
        style={{ clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)' }}>
        {loading ? 'SUBMITTING...' : 'SUBMIT COMMENT →'}
      </button>
    </form>
  )
}

// ── Single Comment
const CommentItem = ({ comment, postId }) => {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(comment.likes || 0)

  const handleLike = async () => {
    if (liked) return
    try {
      await api.post(`/comments/${comment._id}/like`)
      setLikes(l => l + 1)
      setLiked(true)
    } catch {}
  }

  return (
    <div className="border-b border-[rgba(0,255,65,0.06)] py-5">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-8 h-8 border border-[rgba(0,255,65,0.15)]
          bg-[rgba(0,255,65,0.05)] flex items-center justify-center flex-shrink-0">
          <span className="font-['Share_Tech_Mono'] text-[10px] text-[#00ff41]">
            {comment.author.name[0].toUpperCase()}
          </span>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-['Share_Tech_Mono'] text-xs text-[#b8d4b0] font-bold">
              {comment.author.name}
            </span>
            <span className="font-['Share_Tech_Mono'] text-[9px] text-[#2e5c38]">
              {timeAgo(comment.createdAt)}
            </span>
          </div>
          <p className="font-['Rajdhani'] text-sm text-[#b8d4b0] leading-relaxed mb-3">
            {comment.content}
          </p>
          <button onClick={handleLike}
            className={`flex items-center gap-1.5 font-['Share_Tech_Mono'] text-[9px]
              tracking-widest transition-colors
              ${liked ? 'text-[#ff5f56]' : 'text-[#2e5c38] hover:text-[#ff5f56]'}`}>
            <Heart size={10} fill={liked ? '#ff5f56' : 'none'} />
            {likes}
          </button>
        </div>
      </div>

      {/* Replies */}
      {comment.replies?.length > 0 && (
        <div className="ml-11 mt-4 space-y-4 border-l border-[rgba(0,255,65,0.06)] pl-4">
          {comment.replies.map(reply => (
            <div key={reply._id}>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-['Share_Tech_Mono'] text-[10px] text-[#a8ff3e]">
                  {reply.author.name}
                </span>
                <span className="font-['Share_Tech_Mono'] text-[9px] text-[#2e5c38]">
                  {timeAgo(reply.createdAt)}
                </span>
              </div>
              <p className="font-['Rajdhani'] text-sm text-[#b8d4b0] leading-relaxed">
                {reply.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Component
const PostDetail = ({ post }) => {
  const [comments, setComments] = useState([])
  const [likes, setLikes]       = useState(post.stats?.likes || 0)
  const [liked, setLiked]       = useState(false)

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${post._id}`)
      setComments(res.data.data || [])
    } catch {}
  }

  useEffect(() => { fetchComments() }, [post._id])

  const handleLike = async () => {
    if (liked) return
    try {
      await api.post(`/posts/${post._id}/like`)
      setLikes(l => l + 1)
      setLiked(true)
      toast.success('Liked!')
    } catch {}
  }

  return (
    <>
      <ReadingProgress />

      <article className="max-w-4xl mx-auto px-6 py-12">

        {/* Back */}
        <Link href="/blog"
          className="inline-flex items-center gap-2 font-['Share_Tech_Mono'] text-[10px]
            tracking-widest text-[#2e5c38] hover:text-[#00ff41]
            transition-colors mb-10 uppercase">
          <ArrowLeft size={11} /> Back to blog
        </Link>

        {/* Header */}
        <header className="mb-10 pb-10 border-b border-[rgba(0,255,65,0.08)]">
          {/* Category + Tags */}
          <div className="flex items-center gap-2 flex-wrap mb-5">
            {post.category && (
              <Link href={`/blog?cat=${post.category.slug}`}
                className="font-['Share_Tech_Mono'] text-[9px] tracking-[2px]
                  px-3 py-1 uppercase transition-all"
                style={{
                  color: post.category.color || '#00ff41',
                  border: `1px solid ${post.category.color || '#00ff41'}40`,
                  background: `${post.category.color || '#00ff41'}08`,
                  clipPath: 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)',
                }}>
                {post.category.name}
              </Link>
            )}
            {post.tags?.map(tag => (
              <Link key={tag._id} href={`/blog?tag=${tag.slug}`}
                className="font-['Share_Tech_Mono'] text-[9px] tracking-[1.5px]
                  px-3 py-1 border border-[rgba(0,255,65,0.1)]
                  text-[#2e5c38] uppercase hover:text-[#00ff41]
                  hover:border-[rgba(0,255,65,0.3)] transition-all"
                style={{ clipPath: 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)' }}>
                {tag.name}
              </Link>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-['Orbitron'] text-3xl md:text-4xl font-black
            text-[#b8d4b0] leading-tight tracking-wide mb-6"
            style={{ textShadow: '0 0 40px rgba(0,255,65,0.1)' }}>
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="font-['Rajdhani'] text-base text-[#2e5c38]
            leading-relaxed mb-6 max-w-2xl">
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-5 flex-wrap">
            {/* Author */}
            {post.author && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 border border-[rgba(0,255,65,0.2)]
                  bg-[rgba(0,255,65,0.05)] flex items-center justify-center">
                  <span className="font-['Share_Tech_Mono'] text-[10px] text-[#00ff41]">
                    {post.author.name[0]}
                  </span>
                </div>
                <span className="font-['Share_Tech_Mono'] text-[10px]
                  text-[#b8d4b0] tracking-wider">
                  {post.author.name}
                </span>
              </div>
            )}

            <div className="flex items-center gap-4 font-['Share_Tech_Mono']
              text-[10px] text-[#2e5c38]">
              <span className="flex items-center gap-1.5">
                <Calendar size={10} />
                {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={10} /> {post.stats?.readTime || 1} min read
              </span>
              <span className="flex items-center gap-1.5">
                <Eye size={10} /> {post.stats?.views || 0} views
              </span>
            </div>

            {/* Like button */}
            <button onClick={handleLike}
              className={`ml-auto flex items-center gap-2
                font-['Share_Tech_Mono'] text-[10px] tracking-widest uppercase
                px-4 py-2 border transition-all
                ${liked
                  ? 'border-[rgba(255,95,86,0.4)] text-[#ff5f56] bg-[rgba(255,95,86,0.08)]'
                  : 'border-[rgba(0,255,65,0.15)] text-[#2e5c38] hover:text-[#ff5f56] hover:border-[rgba(255,95,86,0.3)]'
                }`}>
              <Heart size={11} fill={liked ? '#ff5f56' : 'none'} />
              {likes} {likes === 1 ? 'like' : 'likes'}
            </button>
          </div>
        </header>

        {/* Content */}
        
<div
  className="post-content mb-16"
  dangerouslySetInnerHTML={{ __html: post.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }}
/>
        {/* Author bio */}
        {post.author?.bio && (
          <div className="border border-[rgba(0,255,65,0.1)] bg-[#041008] p-6 mb-16"
            style={{ clipPath: 'polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,0 100%)' }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 border border-[rgba(0,255,65,0.2)]
                bg-[rgba(0,255,65,0.05)] flex items-center justify-center flex-shrink-0">
                <span className="font-['Orbitron'] text-lg text-[#00ff41]">
                  {post.author.name[0]}
                </span>
              </div>
              <div>
                <div className="font-['Share_Tech_Mono'] text-[9px] text-[#2e5c38]
                  tracking-widest uppercase mb-1">Author</div>
                <div className="font-['Orbitron'] text-sm font-bold text-[#00ff41] mb-2">
                  {post.author.name}
                </div>
                <p className="font-['Rajdhani'] text-sm text-[#2e5c38] leading-relaxed">
                  {post.author.bio}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Comments */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="font-['Share_Tech_Mono'] text-[10px] text-[#00ff41]
              tracking-widest opacity-40">//</span>
            <span className="font-['Share_Tech_Mono'] text-xs tracking-widest
              uppercase text-[#b8d4b0]">
              Comments ({comments.length})
            </span>
            <div className="flex-1 h-px bg-gradient-to-r
              from-[rgba(0,255,65,0.15)] to-transparent" />
          </div>

          {/* Comment list */}
          {comments.length === 0 ? (
            <div className="font-['Share_Tech_Mono'] text-[10px] text-[#2e5c38]
              tracking-widest text-center py-8 mb-8">
              NO COMMENTS YET — BE THE FIRST
            </div>
          ) : (
            <div className="mb-10">
              {comments.map(c => (
                <CommentItem key={c._id} comment={c} postId={post._id} />
              ))}
            </div>
          )}

          {/* Comment form */}
          <div className="border border-[rgba(0,255,65,0.1)] bg-[#041008] p-6"
            style={{ clipPath: 'polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,0 100%)' }}>
            <div className="font-['Share_Tech_Mono'] text-[9px] tracking-widest
              text-[#00ff41] uppercase mb-5 flex items-center gap-2">
              <span className="opacity-40">//</span> Leave a comment
            </div>
            <CommentForm postId={post._id} onSuccess={fetchComments} />
          </div>
        </section>

      </article>
    </>
  )
}

export default PostDetail
