import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, MapPin, DollarSign, Lightbulb } from "lucide-react";

interface Activity {
  time: string;
  activity: string;
  location: string;
  description: string;
  duration: string;
  cost?: number;
}

interface Day {
  day: number;
  title: string;
  activities: Activity[];
}

interface BudgetBreakdown {
  accommodation?: number;
  food?: number;
  activities?: number;
  transportation?: number;
  total: number;
}

interface ItineraryData {
  title: string;
  overview: string;
  days: Day[];
  budgetBreakdown?: BudgetBreakdown;
  tips?: string[];
}

interface ItineraryDisplayProps {
  itinerary: ItineraryData;
}

const ItineraryDisplay = ({ itinerary }: ItineraryDisplayProps) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold text-foreground">{itinerary.title}</h2>
        <p className="text-lg text-muted-foreground">{itinerary.overview}</p>
      </div>

      {/* Day by Day Schedule */}
      <div className="space-y-6">
        {itinerary.days.map((day) => (
          <Card key={day.day} className="shadow-medium">
            <CardHeader className="bg-primary/5">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground">Day {day.day}</Badge>
                <CardTitle className="text-2xl">{day.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {day.activities.map((activity, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-lg bg-card hover:bg-accent/5 transition-colors">
                    <div className="flex-shrink-0 w-20 text-sm font-semibold text-primary">
                      {activity.time}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-semibold text-lg text-foreground">{activity.activity}</h4>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                            <MapPin className="w-4 h-4" />
                            <span>{activity.location}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {activity.cost && (
                            <div className="flex items-center gap-1 text-sm text-accent">
                              <DollarSign className="w-4 h-4" />
                              <span className="font-semibold">{activity.cost}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{activity.duration}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Budget Breakdown */}
      {itinerary.budgetBreakdown && (
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Budget Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {itinerary.budgetBreakdown.accommodation && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Accommodation</span>
                  <span className="font-semibold">${itinerary.budgetBreakdown.accommodation}</span>
                </div>
              )}
              {itinerary.budgetBreakdown.food && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Food & Dining</span>
                  <span className="font-semibold">${itinerary.budgetBreakdown.food}</span>
                </div>
              )}
              {itinerary.budgetBreakdown.activities && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Activities</span>
                  <span className="font-semibold">${itinerary.budgetBreakdown.activities}</span>
                </div>
              )}
              {itinerary.budgetBreakdown.transportation && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Transportation</span>
                  <span className="font-semibold">${itinerary.budgetBreakdown.transportation}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold">Total Estimated Cost</span>
                <span className="font-bold text-primary">${itinerary.budgetBreakdown.total}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Travel Tips */}
      {itinerary.tips && itinerary.tips.length > 0 && (
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Local Tips & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {itinerary.tips.map((tip, idx) => (
                <li key={idx} className="flex gap-2 text-muted-foreground">
                  <span className="text-primary font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ItineraryDisplay;
