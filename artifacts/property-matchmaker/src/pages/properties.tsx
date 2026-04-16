import { useState } from "react";
import { Search, SlidersHorizontal, Loader2, Star } from "lucide-react";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useListProperties, useGetFeaturedProperties } from "@workspace/api-client-react";

export default function PropertiesPage() {
  const [city, setCity] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [bedrooms, setBedrooms] = useState<string>("all");
  
  const { data: properties, isLoading } = useListProperties({
    ...(city !== "all" && { city }),
    ...(type !== "all" && { type }),
    ...(bedrooms !== "all" && { bedrooms: parseInt(bedrooms) }),
  });

  const { data: featuredProperties } = useGetFeaturedProperties();

  const isFiltering = city !== "all" || type !== "all" || bedrooms !== "all";

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold font-serif text-primary">Browse Properties</h1>
        <p className="text-muted-foreground mt-2">Find your perfect home across premium locations.</p>
      </div>

      <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col md:flex-row gap-4 items-end md:items-center">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto md:flex-1">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground px-1">City</label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger>
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                <SelectItem value="Lahore">Lahore</SelectItem>
                <SelectItem value="Karachi">Karachi</SelectItem>
                <SelectItem value="Islamabad">Islamabad</SelectItem>
                <SelectItem value="Rawalpindi">Rawalpindi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground px-1">Property Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="House">House</SelectItem>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="Plot">Plot</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground px-1">Bedrooms</label>
            <Select value={bedrooms} onValueChange={setBedrooms}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="1">1+ Beds</SelectItem>
                <SelectItem value="2">2+ Beds</SelectItem>
                <SelectItem value="3">3+ Beds</SelectItem>
                <SelectItem value="4">4+ Beds</SelectItem>
                <SelectItem value="5">5+ Beds</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button variant="secondary" className="w-full md:w-auto h-10 mt-6 md:mt-0">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>

      {!isFiltering && featuredProperties && featuredProperties.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xl font-serif font-bold text-foreground">
            <Star className="w-5 h-5 text-secondary fill-secondary" />
            <h2>Featured Listings</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
              />
            ))}
          </div>
          <div className="h-px w-full bg-border my-8" />
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-serif font-bold text-foreground">
          {isFiltering ? "Search Results" : "All Properties"}
        </h2>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
            <p>Loading premium properties...</p>
          </div>
        ) : properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-accent/20 rounded-xl border border-dashed border-border">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-20" />
            <h3 className="text-lg font-medium text-foreground">No properties found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your filters to see more results.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => { setCity("all"); setType("all"); setBedrooms("all"); }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

    </div>
  );
}
