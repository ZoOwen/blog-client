import { Suspense } from 'react'
import BlogContent from './BlogContent'

export const metadata = {
  title: 'Blog',
  description: 'Thoughts, tutorials & experiments',
}

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-['Share_Tech_Mono'] text-[#2e5c38] text-xs
          tracking-widest animate-pulse">
          LOADING...
        </div>
      </div>
    }>
      <BlogContent />
    </Suspense>
  )
}