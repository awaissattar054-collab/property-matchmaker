import { useGetPropertyStats } from "@workspace/api-client-react";
import { BarChart3, TrendingUp, Building2, MapPin, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Cell as PieCell, Legend } from "recharts";

export default function StatsPage() {
  const { data: stats, isLoading } = useGetPropertyStats();

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-primary">Market Insights</h1>
        <p className="text-muted-foreground mt-2">Real-time data on premium Pakistani real estate.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
          <p>Loading market data...</p>
        </div>
      ) : stats ? (
        <>
          {/* Top level stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-primary text-primary-foreground border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-primary-foreground/80 font-normal text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Total Active Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{stats.totalListings.toLocaleString()}</div>
                <p className="text-primary-foreground/70 text-xs mt-2">+12% from last month</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-muted-foreground font-normal text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-secondary" />
                  Average Property Price
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {formatCurrency(stats.avgPrice)}
                </div>
                <p className="text-muted-foreground text-xs mt-2">Across all categories</p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-muted-foreground font-normal text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-chart-3" />
                  Top Performing City
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {stats.cityBreakdown && stats.cityBreakdown.length > 0 
                    ? [...stats.cityBreakdown].sort((a,b) => b.count - a.count)[0].city 
                    : "N/A"}
                </div>
                <p className="text-muted-foreground text-xs mt-2">Highest listing volume</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* City Breakdown Chart */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Listings by City</CardTitle>
                <CardDescription>Distribution of properties across major cities</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.cityBreakdown}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="city" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <Tooltip 
                      cursor={{ fill: 'hsl(var(--accent))' }}
                      contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {stats.cityBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Type Breakdown Chart */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Property Types</CardTitle>
                <CardDescription>Composition of inventory by property type</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.typeBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="count"
                      nameKey="type"
                    >
                      {stats.typeBreakdown.map((entry, index) => (
                        <PieCell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
