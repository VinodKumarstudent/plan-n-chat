import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { destination, budget, duration, travelers, preferences } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert travel planner. Create detailed, realistic day-by-day itineraries with specific places, activities, and timing. Include:
- Specific attractions, restaurants, and landmarks with realistic names
- Morning, afternoon, and evening activities for each day
- Estimated time spent at each location
- Transportation suggestions between locations
- Budget breakdown for activities and meals
- Local tips and recommendations

Format the response as a JSON object with this structure:
{
  "title": "Trip Title",
  "overview": "Brief overview of the trip",
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "activities": [
        {
          "time": "9:00 AM",
          "activity": "Activity name",
          "location": "Specific place name",
          "description": "Detailed description",
          "duration": "2 hours",
          "cost": 25
        }
      ]
    }
  ],
  "budgetBreakdown": {
    "accommodation": 500,
    "food": 300,
    "activities": 400,
    "transportation": 200,
    "total": 1400
  },
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}`;

    const userPrompt = `Create a ${duration}-day travel itinerary for ${destination} for ${travelers} traveler(s) with a budget of $${budget || 'moderate'}. Preferences: ${preferences || 'balanced mix of culture, food, and sightseeing'}. Provide specific real places, restaurants, and attractions.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Extract JSON from the response (handle markdown code blocks)
    let itineraryData;
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/```\n?([\s\S]*?)\n?```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      itineraryData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // If parsing fails, try to parse the entire content
      itineraryData = JSON.parse(content);
    }

    return new Response(
      JSON.stringify({ itinerary: itineraryData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-itinerary:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
