import { useParams, Link } from "wouter";
import { ArrowLeft, MapPin, BedDouble, Bath, Square, Check, Calendar, MessageCircle } from "lucide-react";
import { useGetProperty } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/format-currency";

const WHATSAPP_NUMBER = "923427163349";

function buildWhatsAppUrl(title: string, location: string, price: string): string {
  const message = `Hi, I am interested in this property:\n\n*${title}*\nLocation: ${location}\nPrice: ${price}\n\nI would like to schedule a visit.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function PropertyDetailsPage() {
  const params = useParams();
  const propertyId = params.id ? parseInt(params.id) : 0;
  
  const { data: property, isLoading } = useGetProperty(propertyId, {
    query: { enabled: !!propertyId }
  });

  if (isLoading) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-24 bg-muted rounded"></div>
        <div className="h-96 w-full bg-muted rounded-xl"></div>
        <div className="h-10 w-3/4 bg-muted rounded"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-24 bg-muted rounded-lg"></div>
          <div className="h-24 bg-muted rounded-lg"></div>
          <div className="h-24 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold">Property not found</h2>
        <p className="text-muted-foreground mt-2">The property you are looking for does not exist or has been removed.</p>
        <Link href="/properties">
          <Button className="mt-6">Back to Properties</Button>
        </Link>
      </div>
    );
  }

  const location = [property.phase, property.area, property.city].filter(Boolean).join(", ");
  const price = property.priceFormatted || formatCurrency(property.price);
  const whatsAppUrl = buildWhatsAppUrl(property.title, location, price);

  return (
    <div className="pb-20">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-4 px-6 md:px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/properties">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div className="font-bold text-lg hidden md:block">{price}</div>
          <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer">
            <Button className="gap-2 bg-[#25D366] hover:bg-[#20b858] text-white border-0">
              <MessageCircle className="h-4 w-4" />
              Schedule Visit
            </Button>
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        <div className="space-y-6">
          <div className="relative aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden bg-muted">
            <img 
              src={property.imageUrl} 
              alt={property.title} 
              className="w-full h-full object-cover"
            />
            {property.isFeatured && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-secondary text-secondary-foreground text-sm px-3 py-1 shadow-lg">
                  Featured Listing
                </Badge>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 md:p-8 pt-20">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="text-white space-y-2">
                  <div className="flex items-center gap-2 text-white/90">
                    <Badge variant="outline" className="border-white/30 text-white backdrop-blur-sm bg-black/20">
                      {property.type}
                    </Badge>
                    <span className="flex items-center gap-1 text-sm font-medium">
                      <MapPin className="w-4 h-4" />
                      {location}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-serif font-bold leading-tight">
                    {property.title}
                  </h1>
                </div>
                <div className="text-white">
                  <div className="text-sm opacity-80 mb-1">Asking Price</div>
                  <div className="text-3xl md:text-4xl font-bold text-secondary">{price}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 shadow-sm">
              <BedDouble className="w-6 h-6 text-primary" />
              <div>
                <div className="text-2xl font-bold">{property.bedrooms}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Bedrooms</div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 shadow-sm">
              <Bath className="w-6 h-6 text-primary" />
              <div>
                <div className="text-2xl font-bold">{property.bathrooms}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Bathrooms</div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 shadow-sm">
              <Square className="w-6 h-6 text-primary" />
              <div>
                <div className="text-2xl font-bold">{property.sizeSqFt.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Sq Ft Area</div>
              </div>
            </div>
            <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer">
              <div className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3 shadow-sm cursor-pointer hover-elevate transition-all h-full">
                <Calendar className="w-6 h-6 text-[#25D366]" />
                <div>
                  <div className="text-sm font-bold text-[#25D366]">Book a Tour</div>
                  <div className="text-xs text-muted-foreground mt-1">Via WhatsApp</div>
                </div>
              </div>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-foreground border-b border-border pb-2">Description</h2>
              <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {property.description}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-foreground border-b border-border pb-2">Features & Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                {property.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="mt-0.5 rounded-full bg-secondary/20 p-1">
                      <Check className="w-3 h-3 text-secondary-foreground" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="font-serif font-bold text-xl">Interested in this property?</h3>
                <p className="text-sm text-muted-foreground mt-1">Message us on WhatsApp to arrange a visit.</p>
              </div>
              
              <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full text-base py-6 gap-2 bg-[#25D366] hover:bg-[#20b858] text-white border-0">
                  <MessageCircle className="h-5 w-5" />
                  Schedule a Visit on WhatsApp
                </Button>
              </a>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-primary font-serif font-bold text-xl border border-border">
                    EA
                  </div>
                  <div>
                    <div className="font-medium">Estate AI Agent</div>
                    <div className="text-xs text-muted-foreground">Premium Property Specialist</div>
                  </div>
                </div>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="block">
                  <Button variant="outline" className="w-full gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Chat on WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
