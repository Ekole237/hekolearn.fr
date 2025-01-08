import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface CourseCardProps {
  title: string
  description: string
  progress: number
  image?: string
  author: string
  duration: string
  onContinue?: () => void
}

export function CourseCard({
  title,
  description,
  progress,
  image,
  author,
  duration,
  onContinue
}: CourseCardProps) {
  return (
    <Card className="w-full max-w-sm transition-all hover:shadow-lg">
      {image && (
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="line-clamp-2">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Par {author}</span>
            <span className="text-muted-foreground">{duration}</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progression</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={onContinue}
          className="w-full"
          variant={progress === 100 ? "secondary" : "default"}
        >
          {progress === 100 ? "Revoir" : "Continuer"}
        </Button>
      </CardFooter>
    </Card>
  )
}
