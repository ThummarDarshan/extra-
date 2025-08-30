import React from 'react';
import { SensorCard } from '@/components/dashboard/SensorCard';
import { AlertPanel } from '@/components/dashboard/AlertPanel';
import { RealTimeDataTest } from '@/components/dashboard/RealTimeDataTest';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Waves, 
  Thermometer, 
  Wind, 
  Droplets, 
  Activity,
  MapPin,
  AlertTriangle,
  TrendingUp,
  Shield
} from 'lucide-react';
import heroImage from '@/assets/hero-coastal-monitoring.jpg';
import { useSensors, useAlerts, usePredictions, useRiskAssessment, useRealTimeUpdates } from '@/hooks/use-coastal-data';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  // Initialize real-time updates
  useRealTimeUpdates();
  
  // Fetch data from API
  const { data: sensors, isLoading: sensorsLoading } = useSensors();
  const { data: alerts, isLoading: alertsLoading } = useAlerts();
  const { data: predictions, isLoading: predictionsLoading } = usePredictions();
  const { data: riskAssessment, isLoading: riskLoading } = useRiskAssessment();

  // Transform sensor data for display
  const sensorData = React.useMemo(() => {
    if (!sensors) return [];
    
    return sensors.slice(0, 4).map(sensor => {
      const latestReading = sensor.readings[sensor.readings.length - 1];
      const previousReading = sensor.readings[sensor.readings.length - 2];
      
      if (!latestReading) return null;
      
      const change = previousReading ? 
        ((latestReading.value - previousReading.value) / previousReading.value) * 100 : 0;
      
      const getIcon = (type: string) => {
        switch (type) {
          case 'tide_gauge': return Waves;
          case 'weather_station': return Thermometer;
          case 'water_quality': return Droplets;
          case 'wave_buoy': return TrendingUp;
          default: return Activity;
        }
      };
      
      const getTrend = (change: number) => {
        if (Math.abs(change) < 5) return 'stable' as const;
        return change > 0 ? 'up' as const : 'down' as const;
      };
      
      return {
        title: sensor.name.split(' ').slice(-2).join(' '), // Get last two words
        value: latestReading.value,
        unit: latestReading.unit,
        change: Math.abs(change),
        icon: getIcon(sensor.type),
        trend: getTrend(change),
        status: latestReading.status
      };
    }).filter(Boolean);
  }, [sensors]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="relative h-80 bg-gradient-ocean overflow-hidden">
        <img 
          src={heroImage} 
          alt="Coastal monitoring stations" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-primary-foreground">
            <h1 className="text-4xl font-bold mb-4">Coastal Early Warning System</h1>
            <p className="text-xl opacity-90">Real-time monitoring and AI-powered predictions for coastal safety</p>
            {(sensorsLoading || alertsLoading || predictionsLoading || riskLoading) && (
              <div className="mt-4 flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-sm opacity-75 ml-2">Loading real-time data...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sensor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {sensorsLoading ? (
            // Loading skeleton for sensor cards
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="shadow-card border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                  <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-300 rounded w-16 animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-32 animate-pulse"></div>
                </CardContent>
              </Card>
            ))
          ) : sensorData.length > 0 ? (
            sensorData.map((sensor, index) => (
              <SensorCard key={index} {...sensor} />
            ))
          ) : (
            // No data state
            <div className="col-span-full text-center py-8">
              <div className="text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No sensor data available</p>
                <p className="text-sm">Check sensor connections and API status</p>
              </div>
            </div>
          )}
        </div>

        {/* Risk Assessment Banner */}
        {riskLoading ? (
          <Card className="mb-6 border-gray-200 bg-gray-50 shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-48 animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-64 animate-pulse"></div>
                </div>
                <div className="w-20 h-6 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ) : riskAssessment && riskAssessment.riskLevel !== 'low' ? (
          <Card className="mb-6 border-red-200 bg-red-50 shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-800">
                    Coastal Threat Alert - Risk Level: {riskAssessment.riskLevel.toUpperCase()}
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    {riskAssessment.riskFactors.join(', ')}
                  </p>
                </div>
                <Badge variant={riskAssessment.riskLevel === 'critical' ? 'destructive' : 'secondary'}>
                  Risk Score: {riskAssessment.riskLevel === 'critical' ? riskAssessment.riskScore : riskAssessment.riskScore}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Area */}
          <Card className="lg:col-span-2 shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-primary" />
                <span>Real-time Sensor Data</span>
                {sensorsLoading && <Badge variant="outline">Loading...</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sensorsLoading ? (
                // Loading skeleton for sensor data
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse"></div>
                        <div>
                          <div className="h-4 bg-gray-300 rounded w-32 animate-pulse mb-1"></div>
                          <div className="h-3 bg-gray-300 rounded w-24 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="h-6 bg-gray-300 rounded w-16 animate-pulse mb-1"></div>
                        <div className="h-3 bg-gray-300 rounded w-20 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : sensors && sensors.length > 0 ? (
                <div className="space-y-4">
                  {sensors.slice(0, 3).map((sensor) => {
                    const latestReading = sensor.readings[sensor.readings.length - 1];
                    if (!latestReading) return null;
                    
                    return (
                      <div key={sensor.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <div>
                            <p className="font-medium">{sensor.name}</p>
                            <p className="text-sm text-muted-foreground">{sensor.location.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">
                            {latestReading.value} {latestReading.unit}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(latestReading.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-80 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Activity className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No sensor data available</p>
                    <p className="text-sm">Check sensor connections and API status</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Alerts Panel */}
            <AlertPanel />
            
            {/* Predictions Panel */}
            {predictionsLoading ? (
              <Card className="shadow-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>AI Predictions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from({ length: 2 }).map((_, index) => (
                      <div key={index} className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                          <div className="w-16 h-5 bg-gray-300 rounded animate-pulse"></div>
                        </div>
                        <div className="h-3 bg-gray-300 rounded w-32 animate-pulse mb-1"></div>
                        <div className="h-3 bg-gray-300 rounded w-28 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : predictions && predictions.length > 0 ? (
              <Card className="shadow-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>AI Predictions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {predictions.slice(0, 2).map((prediction) => (
                      <div key={prediction.id} className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium capitalize">
                            {prediction.type.replace('_', ' ')}
                          </span>
                          <Badge variant="outline">
                            {prediction.forecast[0]?.risk_level}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {prediction.location.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Model: {prediction.model}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>

        {/* Real-Time Data Test Section */}
        <RealTimeDataTest />

        {/* Coastal Map Section */}
        <Card className="mt-6 shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>Coastal Monitoring Map</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Interactive coastal map will be displayed here</p>
                <p className="text-sm">Sensor locations, danger zones, and safe areas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;