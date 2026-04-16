import { Building2, BedDouble, Bath, Square, MapPin } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Property } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/format-currency";

interface PropertyCardProps {
  property: Property;
  onScheduleVisit?: (property: Property) => void;
  isCompact?: boolean;
}

export function PropertyCard({ property, onScheduleVisit, isCompact = false }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden group hover-elevate transition-all duration-300 flex flex-col h-full bg-card border-border">
      <Link href={`/properties/${property.id}`}>
        <div className="cursor-pointer relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={property.imageUrl}
            alt={property.title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {property.isFeatured && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-secondary text-secondary-foreground font-semibold shadow-md">
                Featured
              </Badge>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
            <div className="text-white font-bold text-xl tracking-tight">
              {property.priceFormatted || formatCurrency(property.price)}
            </div>
            <div className="text-white/90 text-sm flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{property.phase ? `${property.phase}, ` : ""}{property.area}, {property.city}</span>
            </div>
          </div>
        </div>
      </Link>
      
      <CardContent className="p-4 flex-grow flex flex-col gap-3">
        <Link href={`/properties/${property.id}`}>
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors cursor-pointer">
            {property.title}
          </h3>
        </Link>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-auto pt-2 border-t border-border">
          <div className="flex items-center gap-1.5" title="Bedrooms">
            <BedDouble className="h-4 w-4" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1.5" title="Bathrooms">
            <Bath className="h-4 w-4" />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1.5" title="Area">
            <Square className="h-4 w-4" />
            <span>{property.sizeSqFt} sqft</span>
          </div>
        </div>
        
        {!isCompact && property.features && property.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {property.features.slice(0, 3).map((feature, i) => (
              <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0 bg-accent text-accent-foreground font-normal">
                {feature}
              </Badge>
            ))}
            {property.features.length > 3 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-muted text-muted-foreground font-normal">
                +{property.features.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      
      {onScheduleVisit && (
        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full font-medium" 
            onClick={(e) => {
              e.preventDefault();
              onScheduleVisit(property);
            }}
          >
            Schedule Visit
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
