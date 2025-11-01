import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-travel.jpg";
import { Plane, MapPin, Calendar, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            AI Smart Travel Planner
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-md">
            Create personalized travel itineraries in minutes
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white shadow-large"
              onClick={() => navigate("/login")}
            >
              Get Started
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
              onClick={() => navigate("/register")}
            >
              Sign Up Free
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Why Choose Us?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg bg-card shadow-soft hover:shadow-medium transition-all">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">AI-Powered</h3>
              <p className="text-muted-foreground">Smart recommendations tailored to your preferences</p>
            </div>

            <div className="text-center p-6 rounded-lg bg-card shadow-soft hover:shadow-medium transition-all">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary/10 rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">Personalized Routes</h3>
              <p className="text-muted-foreground">Optimized itineraries for every destination</p>
            </div>

            <div className="text-center p-6 rounded-lg bg-card shadow-soft hover:shadow-medium transition-all">
              <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">Budget Friendly</h3>
              <p className="text-muted-foreground">Plan within your budget with smart suggestions</p>
            </div>

            <div className="text-center p-6 rounded-lg bg-card shadow-soft hover:shadow-medium transition-all">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Plane className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">Save Time</h3>
              <p className="text-muted-foreground">Generate complete itineraries in seconds</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of travelers planning their perfect trips with AI
          </p>
          <Button 
            size="lg"
            className="bg-white text-primary hover:bg-white/90 shadow-large"
            onClick={() => navigate("/register")}
          >
            Create Your Free Account
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
