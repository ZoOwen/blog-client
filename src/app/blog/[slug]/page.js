import { notFound } from 'next/navigation'
import PostDetail from './PostDetail'
import api from '@/lib/api'

export async function generateMetadata({ params }) {
  try {
    const { slug } = await params
    const res = await api.get(`/posts/${slug}`)
    const post = res.data.data.post
    return {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: post.seo?.ogImage ? [post.seo.ogImage] : [],
      },
    }
  } catch {
    return { title: 'Post Not Found' }
  }
}

export default async function PostPage({ params }) {
  try {
    const { slug } = await params
    const res  = await api.get(`/posts/${slug}`)
    const post = res.data.data.post
    return <PostDetail post={post} />
  } catch {
    notFound()
  }
}