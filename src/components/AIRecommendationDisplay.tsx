import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, DollarSign, Lightbulb, Utensils, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface Activity {
  time: string;
  location: string;
  activity: string;
  estimatedCost: number;
  coordinates?: [number, number];
}

interface DayItinerary {
  day: number;
  title?: string;
  activities: Activity[];
  dayTotal?: number;
}

interface AIRecommendation {
  itinerary?: DayItinerary[];
  costBreakdown?: {
    transportation: number;
    accommodation: number;
    food: number;
    activities: number;
    total: number;
  };
  tips?: string[];
  localFood?: string[];
  uniqueActivities?: string[];
  alternatives?: Array<{
    destination: string;
    estimatedCost: number;
    reason: string;
  }>;
}

interface Props {
  recommendation: AIRecommendation;
}

const AIRecommendationDisplay = ({ recommendation }: Props) => {
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Cost Breakdown */}
      {recommendation.costBreakdown && (
        <Card className="card-travel border-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <DollarSign className="text-primary" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-xl text-primary">Estimasi Biaya Total</h3>
              <p className="text-3xl font-bold text-primary mt-1">
                {formatRupiah(recommendation.costBreakdown.total)}
              </p>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Transportasi</p>
              <p className="font-semibold text-primary">
                {formatRupiah(recommendation.costBreakdown.transportation)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Akomodasi</p>
              <p className="font-semibold text-primary">
                {formatRupiah(recommendation.costBreakdown.accommodation)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Makanan</p>
              <p className="font-semibold text-primary">
                {formatRupiah(recommendation.costBreakdown.food)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Aktivitas</p>
              <p className="font-semibold text-primary">
                {formatRupiah(recommendation.costBreakdown.activities)}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Itinerary Rundown */}
      {recommendation.itinerary && recommendation.itinerary.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold text-2xl text-primary flex items-center gap-2">
            <Calendar size={28} />
            Rundown Perjalanan
          </h3>
          {recommendation.itinerary.map((day, index) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="card-travel border-l-4 border-l-primary">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Badge className="mb-2 bg-primary">Hari {day.day}</Badge>
                    {day.title && (
                      <h4 className="font-bold text-lg text-primary">{day.title}</h4>
                    )}
                  </div>
                  {day.dayTotal && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Biaya Hari Ini</p>
                      <p className="font-bold text-primary">{formatRupiah(day.dayTotal)}</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {day.activities.map((activity, actIndex) => (
                    <div key={actIndex} className="flex gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg h-fit">
                        <MapPin size={18} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-primary">{activity.time}</p>
                        <p className="font-medium mt-1">{activity.location}</p>
                        <p className="text-sm text-muted-foreground mt-1">{activity.activity}</p>
                        <p className="text-sm font-semibold text-primary mt-2">
                          💰 {formatRupiah(activity.estimatedCost)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Local Food Recommendations */}
      {recommendation.localFood && recommendation.localFood.length > 0 && (
        <Card className="card-travel bg-primary/5">
          <div className="flex items-center gap-3 mb-3">
            <Utensils className="text-primary" size={24} />
            <h3 className="font-bold text-lg text-primary">Kuliner Lokal Wajib Coba</h3>
          </div>
          <ul className="space-y-2">
            {recommendation.localFood.map((food, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-1">🍴</span>
                <span className="text-sm">{food}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Unique Activities */}
      {recommendation.uniqueActivities && recommendation.uniqueActivities.length > 0 && (
        <Card className="card-travel bg-accent/5">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="text-accent" size={24} />
            <h3 className="font-bold text-lg text-primary">Aktivitas Unik & Menarik</h3>
          </div>
          <ul className="space-y-2">
            {recommendation.uniqueActivities.map((activity, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-accent mt-1">✨</span>
                <span className="text-sm">{activity}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Tips */}
      {recommendation.tips && recommendation.tips.length > 0 && (
        <Card className="card-travel bg-secondary/50">
          <div className="flex items-center gap-3 mb-3">
            <Lightbulb className="text-primary" size={24} />
            <h3 className="font-bold text-lg text-primary">Tips Perjalanan</h3>
          </div>
          <ul className="space-y-2">
            {recommendation.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-1">💡</span>
                <span className="text-sm">{tip}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Alternatives */}
      {recommendation.alternatives && recommendation.alternatives.length > 0 && (
        <div>
          <h3 className="font-bold text-lg text-primary mb-3">
            Alternatif Destinasi Serupa
          </h3>
          <div className="grid gap-3">
            {recommendation.alternatives.map((alt, index) => (
              <Card key={index} className="card-travel hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-bold text-primary">{alt.destination}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{alt.reason}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm text-muted-foreground">Estimasi</p>
                    <p className="font-bold text-primary">{formatRupiah(alt.estimatedCost)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AIRecommendationDisplay;
