import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Plane } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import ItineraryDisplay from "@/components/ItineraryDisplay";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<any>(null);
  
  // Form state
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [travelers, setTravelers] = useState("1");
  const [preferences, setPreferences] = useState("");

  useEffect(() => {
    // Check auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        navigate("/login");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleGenerateItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedItinerary(null);

    try {
      toast({
        title: "Generating itinerary...",
        description: "AI is creating your personalized travel plan",
      });

      // Call AI to generate itinerary
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'generate-itinerary',
        {
          body: {
            destination,
            budget: parseFloat(budget) || null,
            duration: parseInt(duration),
            travelers: parseInt(travelers),
            preferences,
          }
        }
      );

      if (functionError) throw functionError;
      if (!functionData?.itinerary) throw new Error('No itinerary data received');

      // Save trip to database with generated itinerary
      const { error: dbError } = await supabase
        .from("trips")
        .insert({
          user_id: user?.id,
          destination,
          budget: parseFloat(budget) || null,
          duration: parseInt(duration),
          travelers: parseInt(travelers),
          preferences,
          start_date: new Date().toISOString().split('T')[0],
          itinerary: functionData.itinerary,
        });

      if (dbError) throw dbError;

      setGeneratedItinerary(functionData.itinerary);
      
      toast({
        title: "Success!",
        description: "Your personalized itinerary is ready",
      });
    } catch (error: any) {
      console.error('Error generating itinerary:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate itinerary",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Header */}
      <header className="bg-card border-b shadow-soft">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Plane className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">AI Travel Planner</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 py-8">
        {!generatedItinerary ? (
          <Card className="shadow-large">
            <CardHeader>
              <CardTitle className="text-3xl">Plan Your Trip</CardTitle>
              <CardDescription>
                Fill in the details and let AI create your perfect itinerary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerateItinerary} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  placeholder="e.g., Paris, France"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (USD)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="1000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="7"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="travelers">Travelers</Label>
                  <Input
                    id="travelers"
                    type="number"
                    placeholder="2"
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferences">Preferences</Label>
                <Textarea
                  id="preferences"
                  placeholder="Tell us about your interests, dietary restrictions, accessibility needs, etc."
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  rows={4}
                  disabled={loading}
                />
              </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate My Itinerary"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Itinerary</h2>
              <Button 
                variant="outline"
                onClick={() => {
                  setGeneratedItinerary(null);
                  setDestination("");
                  setBudget("");
                  setDuration("");
                  setTravelers("1");
                  setPreferences("");
                }}
              >
                Create New Trip
              </Button>
            </div>
            <ItineraryDisplay itinerary={generatedItinerary} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
