import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  Waves, 
  Wind, 
  Droplets,
  AlertTriangle,
  Activity
} from 'lucide-react';

interface PredictionCard {
  title: string;
  prediction: string;
  confidence: number;
  timeframe: string;
  riskLevel: 'low' | 'medium' | 'high';
  icon: React.ComponentType<any>;
  details: string;
}

const predictionData: PredictionCard[] = [
  {
    title: 'Sea Level Rise',
    prediction: '+0.3m above normal',
    confidence: 92,
    timeframe: 'Next 6 hours',
    riskLevel: 'medium',
    icon: Waves,
    details: 'Tidal surge combined with seasonal patterns indicates elevated sea levels.'
  },
  {
    title: 'Cyclone Formation',
    prediction: 'Low probability',
    confidence: 78,
    timeframe: 'Next 72 hours',
    riskLevel: 'low',
    icon: Wind,
    details: 'Current atmospheric conditions show minimal cyclone development risk.'
  },
  {
    title: 'Water Quality',
    prediction: 'Algal bloom risk',
    confidence: 85,
    timeframe: 'Next 48 hours',
    riskLevel: 'high',
    icon: Droplets,
    details: 'Temperature and nutrient levels indicate potential harmful algal bloom.'
  },
  {
    title: 'Coastal Erosion',
    prediction: 'Increased rate',
    confidence: 89,
    timeframe: 'Next 30 days',
    riskLevel: 'medium',
    icon: TrendingUp,
    details: 'Wave energy patterns suggest accelerated coastal erosion in vulnerable areas.'
  }
];

const getRiskColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'low': return 'text-safe';
    case 'medium': return 'text-advisory';
    case 'high': return 'text-warning';
    default: return 'text-muted-foreground';
  }
};

const getRiskBadgeVariant = (riskLevel: string) => {
  switch (riskLevel) {
    case 'low': return 'bg-safe text-safe-foreground';
    case 'medium': return 'bg-advisory text-advisory-foreground';
    case 'high': return 'bg-warning text-warning-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

const Predictions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Predictions</h1>
          <p className="text-muted-foreground">Machine learning powered coastal predictions and risk analysis</p>
        </div>

        {/* Prediction Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {predictionData.map((prediction, index) => {
            const Icon = prediction.icon;
            return (
              <Card key={index} className="shadow-card border-border/50 hover:shadow-ocean transition-smooth">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <span>{prediction.title}</span>
                    </div>
                    <Badge className={getRiskBadgeVariant(prediction.riskLevel)}>
                      {prediction.riskLevel.toUpperCase()}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Prediction</span>
                      <span className="text-sm text-muted-foreground">{prediction.timeframe}</span>
                    </div>
                    <p className={`text-lg font-semibold ${getRiskColor(prediction.riskLevel)}`}>
                      {prediction.prediction}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Confidence</span>
                      <span className="text-sm font-medium text-foreground">{prediction.confidence}%</span>
                    </div>
                    <Progress value={prediction.confidence} className="h-2" />
                  </div>

                  <p className="text-sm text-muted-foreground">{prediction.details}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Prediction Timeline */}
        <Card className="shadow-card border-border/50 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Prediction Timeline</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Activity className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Interactive prediction timeline will be displayed here</p>
                <p className="text-sm">7-day forecast with confidence intervals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Model Information */}
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-primary" />
              <span>AI Model Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">94.7%</div>
                <div className="text-sm text-muted-foreground">Overall Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary mb-2">1,247</div>
                <div className="text-sm text-muted-foreground">Predictions Made</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-safe mb-2">87.3%</div>
                <div className="text-sm text-muted-foreground">Early Warning Success</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Predictions;