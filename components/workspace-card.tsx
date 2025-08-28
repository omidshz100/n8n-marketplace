import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Download, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { CheckoutButton } from "@/components/checkout-button"

interface Workspace {
  id: string
  title: string
  description: string
  price: number
  category: string
  tags: string[]
  downloads: number
  rating: number
  image: string
  featured?: boolean
}

interface WorkspaceCardProps {
  workspace: Workspace
  featured?: boolean
}

export function WorkspaceCard({ workspace, featured = false }: WorkspaceCardProps) {
  if (featured) {
    return (
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative h-64 md:h-full">
            <Image src={workspace.image || "/placeholder.svg"} alt={workspace.title} fill className="object-cover" />
          </div>
          <div className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary">{workspace.category}</Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{workspace.rating}</span>
                  <span>({workspace.downloads} downloads)</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3">{workspace.title}</h3>
              <p className="text-muted-foreground mb-4">{workspace.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {workspace.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">${workspace.price}</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/workspace/${workspace.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Link>
                </Button>
                <CheckoutButton workspaceId={workspace.id} price={workspace.price} title={workspace.title} size="sm" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative h-48">
          <Image src={workspace.image || "/placeholder.svg"} alt={workspace.title} fill className="object-cover" />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            {workspace.category}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{workspace.rating}</span>
          </div>
        </div>
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{workspace.title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{workspace.description}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {workspace.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {workspace.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{workspace.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">${workspace.price}</span>
          <span className="text-xs text-muted-foreground">
            <Download className="h-3 w-3 inline mr-1" />
            {workspace.downloads}
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/workspace/${workspace.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <CheckoutButton workspaceId={workspace.id} price={workspace.price} title={workspace.title} size="sm" />
        </div>
      </CardFooter>
    </Card>
  )
}
