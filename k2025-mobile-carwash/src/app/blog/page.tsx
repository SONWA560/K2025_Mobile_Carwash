'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Calendar, 
  User, 
  Clock, 
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Share2
} from 'lucide-react'

// Mock blog posts data
const mockBlogPosts = [
  {
    id: '1',
    title: '10 Essential Car Care Tips for South African Weather',
    slug: 'essential-car-care-tips-south-africa',
    excerpt: 'Discover how to protect your vehicle from harsh UV rays, dust, and sudden weather changes common in South Africa.',
    content: 'Full article content would go here...',
    coverImage: '/blog/car-care-tips.jpg',
    published: true,
    createdAt: '2025-11-10',
    updatedAt: '2025-11-10',
    author: 'K2025 Team',
    category: 'Car Care',
    readTime: '5 min read',
    likes: 24,
    comments: 8
  },
  {
    id: '2',
    title: 'The Benefits of Regular Professional Car Washes',
    slug: 'benefits-regular-professional-car-washes',
    excerpt: 'Learn why investing in regular professional car washes saves you money and preserves your vehicle value.',
    content: 'Full article content would go here...',
    coverImage: '/blog/professional-wash.jpg',
    published: true,
    createdAt: '2025-11-08',
    updatedAt: '2025-11-08',
    author: ' GlossIQ Team',
    category: 'Professional Services',
    readTime: '3 min read',
    likes: 18,
    comments: 5
  },
  {
    id: '3',
    title: 'Ceramic Coating: Is It Worth the Investment?',
    slug: 'ceramic-coating-worth-investment',
    excerpt: 'Explore the pros and cons of ceramic coating and determine if it\'s the right choice for your vehicle.',
    content: 'Full article content would go here...',
    coverImage: '/blog/ceramic-coating.jpg',
    published: true,
    createdAt: '2025-11-05',
    updatedAt: '2025-11-05',
    author: ' GlossIQ Team',
    category: 'Paint Protection',
    readTime: '7 min read',
    likes: 32,
    comments: 12
  },
  {
    id: '4',
    title: 'How to Maintain Your Car Between Professional Washes',
    slug: 'maintain-car-between-washes',
    excerpt: 'Simple tips and tricks to keep your car looking great between your scheduled professional washes.',
    content: 'Full article content would go here...',
    coverImage: '/blog/car-maintenance.jpg',
    published: true,
    createdAt: '2025-11-01',
    updatedAt: '2025-11-01',
    author: ' GlossIQ Team',
    category: 'Car Care',
    readTime: '4 min read',
    likes: 15,
    comments: 3
  },
  {
    id: '5',
    title: 'Understanding Different Types of Car Wax',
    slug: 'understanding-car-wax-types',
    excerpt: 'A comprehensive guide to choosing the right wax for your vehicle\'s specific needs and finish.',
    content: 'Full article content would go here...',
    coverImage: '/blog/car-wax.jpg',
    published: true,
    createdAt: '2025-10-28',
    updatedAt: '2025-10-28',
    author: ' GlossIQ Team',
    category: 'Products',
    readTime: '6 min read',
    likes: 21,
    comments: 7
  }
]

const categories = ['All', 'Car Care', 'Professional Services', 'Paint Protection', 'Products']

export default function BlogPage() {
  const [posts, setPosts] = useState(mockBlogPosts)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 6

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Car Care Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert tips, industry insights, and professional advice to keep your vehicle looking its best
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="lg:w-48">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Featured Post */}
        {paginatedPosts.length > 0 && currentPage === 1 && (
          <Card className="mb-8 overflow-hidden">
            <div className="lg:flex">
              <div className="lg:w-1/2">
                <div className="h-64 lg:h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <div className="text-white text-center p-8">
                    <h2 className="text-3xl font-bold mb-4">Featured Article</h2>
                    <p className="text-lg mb-4">{paginatedPosts[0].title}</p>
                    <Button size="lg" className="bg-white text-glossiq-primary hover:bg-gray-100">
                      Read More
                    </Button>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 p-8">
                <div className="flex items-center space-x-2 mb-4">
                  <Badge variant="secondary">{paginatedPosts[0].category}</Badge>
                  <span className="text-sm text-gray-500">{paginatedPosts[0].readTime}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">{paginatedPosts[0].title}</h3>
                <p className="text-gray-600 mb-6">{paginatedPosts[0].excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{paginatedPosts[0].author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(paginatedPosts[0].createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Heart className="h-4 w-4" />
                      <span>{paginatedPosts[0].likes}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <MessageCircle className="h-4 w-4" />
                      <span>{paginatedPosts[0].comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {paginatedPosts.slice(currentPage === 1 ? 1 : 0).map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600"></div>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-sm text-gray-500">{post.readTime}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button className="flex-1">Read More</Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Newsletter Signup */}
        <Card className="mt-12 bg-glossiq-primary text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
            <p className="mb-6 text-blue-100">
              Get the latest car care tips and exclusive offers delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                className="bg-white text-gray-900"
              />
              <Button className="bg-white text-glossiq-primary hover:bg-gray-100">
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}