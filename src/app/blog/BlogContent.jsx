'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { FeaturedCard, PostCard } from '@/components/blog/PostCard'
import Sidebar from '@/components/blog/Sidebar'
import api from '@/lib/api'

export default function BlogContent() {
  const searchParams = useSearchParams()
  const search       = searchParams.get('search') || ''
  const cat          = searchParams.get('cat') || ''
  const tag          = searchParams.get('tag') || ''

  const [posts, setPosts]           = useState([])
  const [featured, setFeatured]     = useState(null)
  const [categories, setCategories] = useState([])
  const [tags, setTags]             = useState([])
  const [total, setTotal]           = useState(0)
  const [loading, setLoading]       = useState(true)
  const [page, setPage]             = useState(1)
  const [hasMore, setHasMore]       = useState(false)
  const limit = 8

  // Fetch categories & tags sekali
  useEffect(() => {
    Promise.all([
      api.get('/categories'),
      api.get('/tags'),
    ]).then(([catRes, tagRes]) => {
      setCategories(catRes.data.data.categories || [])
      setTags(tagRes.data.data.tags || [])
    }).catch(() => {})
  }, [])

  // Fetch posts
  useEffect(() => {
    setLoading(true)
    setPage(1)

    const params = { page: 1, limit, status: 'published' }
    if (search) params.search   = search
    if (cat)    params.category = categories.find(c => c.slug === cat)?._id || ''
    if (tag)    params.tag      = tags.find(t => t.slug === tag)?._id || ''

    api.get('/posts', { params })
      .then(res => {
        const data = res.data
        setPosts(data.data || [])
        setTotal(data.pagination?.total || 0)
        setHasMore(data.pagination?.hasNextPage || false)
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [search, cat, tag, categories, tags])

  // Fetch featured
  useEffect(() => {
    if (!search && !cat && !tag) {
      api.get('/posts/featured')
        .then(res => setFeatured(res.data.data.post))
        .catch(() => setFeatured(null))
    } else {
      setFeatured(null)
    }
  }, [search, cat, tag])

  const loadMore = async () => {
    const nextPage = page + 1
    const params   = { page: nextPage, limit, status: 'published' }
    if (search) params.search   = search
    if (cat)    params.category = categories.find(c => c.slug === cat)?._id || ''
    if (tag)    params.tag      = tags.find(t => t.slug === tag)?._id || ''

    const res = await api.get('/posts', { params })
    setPosts(prev => [...prev, ...(res.data.data || [])])
    setHasMore(res.data.pagination?.hasNextPage || false)
    setPage(nextPage)
  }

  // Filter posts — kalau ada featured, exclude dari list
  const listPosts = featured
    ? posts.filter(p => p._id !== featured._id)
    : posts

  return (
    <div className="min-h-screen">

      {/* Page Header */}
      <div className="px-10 pt-16 pb-10 border-b border-[rgba(0,255,65,0.08)] relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2
          font-['Orbitron'] font-black text-[clamp(80px,14vw,200px)]
          text-transparent [-webkit-text-stroke:1px_rgba(0,255,65,0.04)]
          pointer-events-none select-none tracking-widest">
          BLOG
        </div>
        <div className="font-['Share_Tech_Mono'] text-[10px] text-[#2e5c38]
          tracking-widest mb-3 flex items-center gap-2">
          <span className="text-[#00ff41]">~</span>/
          <span className="text-[#00ff41]">blog</span>
          {cat && <><span>/</span><span className="text-[#a8ff3e]">{cat}</span></>}
          {search && <><span>/</span><span className="text-[#ffd700]">search:{search}</span></>}
        </div>
        <h1 className="font-['Orbitron'] text-4xl md:text-5xl font-black
          text-[#b8d4b0] tracking-wide leading-none mb-3">
          DEV<span className="text-[#00ff41]" style={{ textShadow: '0 0 20px rgba(0,255,65,0.4)' }}>.</span>BLOG
        </h1>
        <div className="font-['Share_Tech_Mono'] text-xs text-[#2e5c38]
          tracking-widest uppercase flex items-center gap-3">
          <span className="w-8 h-px bg-[#2e5c38]" />
          Thoughts, tutorials & experiments
        </div>
      </div>

      {/* Filter info */}
      {(search || cat || tag) && (
        <div className="px-10 py-3 border-b border-[rgba(0,255,65,0.06)]
          bg-[rgba(0,255,65,0.02)]
          font-['Share_Tech_Mono'] text-[10px] text-[#2e5c38] tracking-widest
          flex items-center gap-3">
          <span>FILTER:</span>
          {search && <span className="text-[#ffd700]">"{search}"</span>}
          {cat && <span className="text-[#a8ff3e]">category:{cat}</span>}
          {tag && <span className="text-[#00ff41]">tag:{tag}</span>}
          <span className="ml-auto">{total} POSTS FOUND</span>
        </div>
      )}

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px]
        min-h-[calc(100vh-200px)]">

        {/* Posts */}
        <div className="border-r border-[rgba(0,255,65,0.06)]">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="font-['Share_Tech_Mono'] text-[#2e5c38] text-xs
                tracking-widest animate-pulse">
                LOADING POSTS...
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="font-['Share_Tech_Mono'] text-[#2e5c38] text-xs tracking-widest">
                NO POSTS FOUND
              </div>
              {(search || cat || tag) && (
                <a href="/blog"
                  className="font-['Share_Tech_Mono'] text-[10px] text-[#00ff41]
                    tracking-widest hover:underline">
                  ← Clear filter
                </a>
              )}
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && <FeaturedCard post={featured} />}

              {/* List */}
              {listPosts.map((post, i) => (
                <PostCard key={post._id} post={post}
                  index={featured ? i + 2 : i + 1} />
              ))}

              {/* Load more */}
              {hasMore && (
                <div className="flex justify-center py-8
                  border-t border-[rgba(0,255,65,0.06)]">
                  <button onClick={loadMore}
                    className="font-['Share_Tech_Mono'] text-[10px] tracking-widest uppercase
                      px-8 py-3 border border-[rgba(0,255,65,0.2)]
                      text-[#00ff41] bg-[rgba(0,255,65,0.04)]
                      hover:bg-[#00ff41] hover:text-[#020b04]
                      transition-all duration-300"
                    style={{ clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)' }}>
                    Load More →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block p-8">
          <Sidebar
            totalPosts={total}
            categories={categories}
            tags={tags}
          />
        </div>
      </div>
    </div>
  )
}