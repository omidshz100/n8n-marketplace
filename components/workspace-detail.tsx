import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckoutButton } from "@/components/checkout-button"
import {
  Star,
  Download,
  Eye,
  Calendar,
  User,
  Package,
  CheckCircle,
  Shield,
  ArrowLeft,
  Share2,
  Heart,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Workspace {
  id: string
  title: string
  description: string
  longDescription: string
  price: number
  category: string
  tags: string[]
  downloads: number
  rating: number
  reviews: number
  image: string
  author: string
  lastUpdated: string
  version: string
  requirements: string[]
  includes: string[]
}

interface WorkspaceDetailProps {
  workspace: Workspace
}

export function WorkspaceDetail({ workspace }: WorkspaceDetailProps) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Workspaces
        </Link>
        <span>/</span>
        <span>{workspace.category}</span>
        <span>/</span>
        <span className="text-foreground">{workspace.title}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary">{workspace.category}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{workspace.rating}</span>
                <span>({workspace.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Download className="h-4 w-4" />
                <span>{workspace.downloads} downloads</span>
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">{workspace.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{workspace.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {workspace.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <CheckoutButton workspaceId={workspace.id} price={workspace.price} title={workspace.title} size="lg" />
              <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                <Eye className="h-4 w-4" />
                Preview Workflow
              </Button>
              <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                <Heart className="h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Main Image */}
          <div className="relative h-64 lg:h-96 rounded-lg overflow-hidden">
            <Image src={workspace.image || "/placeholder.svg"} alt={workspace.title} fill className="object-cover" />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>About This Workspace</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {workspace.longDescription.split("\n\n").map((paragraph, index) => (
                      <p key={index} className="mb-4 text-muted-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {workspace.includes.map((item, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {workspace.requirements.map((req, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Sample reviews */}
                    <div className="border-b border-border pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="font-medium">John D.</span>
                        <span className="text-sm text-muted-foreground">2 weeks ago</span>
                      </div>
                      <p className="text-muted-foreground">
                        "Excellent workflow! Saved me hours of manual work. The documentation is clear and setup was
                        straightforward."
                      </p>
                    </div>
                    <div className="border-b border-border pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          <Star className="h-4 w-4 text-gray-300" />
                        </div>
                        <span className="font-medium">Sarah M.</span>
                        <span className="text-sm text-muted-foreground">1 month ago</span>
                      </div>
                      <p className="text-muted-foreground">
                        "Great automation, works as described. Would love to see more customization options in future
                        updates."
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Purchase Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Purchase</span>
                <span className="text-2xl font-bold">${workspace.price}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CheckoutButton
                workspaceId={workspace.id}
                price={workspace.price}
                title={workspace.title}
                className="w-full"
                size="lg"
              />
              <Button variant="outline" className="w-full gap-2 bg-transparent">
                <Eye className="h-4 w-4" />
                Preview First
              </Button>
              <Separator />
              <div className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Instant download</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>30-day money back guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Free updates for 1 year</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workspace Info */}
          <Card>
            <CardHeader>
              <CardTitle>Workspace Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Author:</span>
                <span className="font-medium">{workspace.author}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Version:</span>
                <span className="font-medium">{workspace.version}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Updated:</span>
                <span className="font-medium">{workspace.lastUpdated}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Download className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Downloads:</span>
                <span className="font-medium">{workspace.downloads}</span>
              </div>
            </CardContent>
          </Card>

          {/* Related Workspaces */}
          <Card>
            <CardHeader>
              <CardTitle>Related Workspaces</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <div className="relative h-12 w-12 rounded overflow-hidden flex-shrink-0">
                  <Image src="/social-media-automation.png" alt="Related" fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm line-clamp-1">Social Media Pipeline</p>
                  <p className="text-xs text-muted-foreground">$39</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="relative h-12 w-12 rounded overflow-hidden flex-shrink-0">
                  <Image src="/crm-lead-generation-automation.png" alt="Related" fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm line-clamp-1">CRM Lead Generation</p>
                  <p className="text-xs text-muted-foreground">$59</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
