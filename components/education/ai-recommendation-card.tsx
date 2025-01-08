import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, CheckCircle, XCircle } from "lucide-react";

interface AIRecommendationProps {
  title: string;
  description: string;
  type: "exercise" | "revision" | "next_topic" | "reinforcement";
  status: "pending" | "accepted" | "completed" | "rejected";
  onAccept?: () => void;
  onReject?: () => void;
  onStart?: () => void;
}

export function AIRecommendationCard({
  title,
  description,
  type,
  status,
  onAccept,
  onReject,
  onStart,
}: AIRecommendationProps) {
  const getTypeColor = () => {
    switch (type) {
      case "exercise":
        return "text-blue-500";
      case "revision":
        return "text-yellow-500";
      case "next_topic":
        return "text-green-500";
      case "reinforcement":
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusActions = () => {
    switch (status) {
      case "pending":
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReject}
              className="text-destructive"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Ignorer
            </Button>
            <Button size="sm" onClick={onAccept}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Accepter
            </Button>
          </div>
        );
      case "accepted":
        return (
          <Button size="sm" onClick={onStart}>
            Commencer
          </Button>
        );
      case "completed":
        return (
          <div className="flex items-center text-sm text-primary">
            <CheckCircle className="mr-2 h-4 w-4" />
            Complété
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className={`h-5 w-5 ${getTypeColor()}`} />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground capitalize">
            {type.replace("_", " ")}
          </span>
          {getStatusActions()}
        </div>
      </CardContent>
    </Card>
  );
}
