import { format } from "date-fns";
import { Link } from "wouter";
import { Calendar, Clock, MapPin, Building2, User, Phone, CheckCircle2, XCircle, Clock3 } from "lucide-react";
import { useListVisits, useCancelVisit, getListVisitsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/format-currency";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function VisitsPage() {
  const { data: visits, isLoading } = useListVisits();
  const cancelVisit = useCancelVisit();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleCancel = (id: number) => {
    cancelVisit.mutate(
      { id },
      {
        onSuccess: () => {
          toast({
            title: "Visit Cancelled",
            description: "Your property visit has been successfully cancelled.",
          });
          queryClient.invalidateQueries({ queryKey: getListVisitsQueryKey() });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to cancel the visit. Please try again.",
            variant: "destructive"
          });
        }
      }
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 shadow-none"><Clock3 className="w-3 h-3 mr-1" /> Scheduled</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 shadow-none"><CheckCircle2 className="w-3 h-3 mr-1" /> Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive" className="shadow-none"><XCircle className="w-3 h-3 mr-1" /> Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-primary">My Visits</h1>
        <p className="text-muted-foreground mt-2">Manage your scheduled property tours.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-card animate-pulse rounded-xl border border-border"></div>
          ))}
        </div>
      ) : visits && visits.length > 0 ? (
        <div className="space-y-6">
          {visits.map((visit) => {
            const property = visit.property;
            const visitDate = new Date(visit.visitDate);
            const isUpcoming = visit.status.toLowerCase() === "scheduled" && visitDate >= new Date(new Date().setHours(0,0,0,0));
            
            return (
              <Card key={visit.id} className="overflow-hidden border-border bg-card hover-elevate transition-all duration-300">
                <div className="flex flex-col md:flex-row">
                  {/* Property Image Side */}
                  <div className="md:w-1/3 relative min-h-[200px] bg-muted">
                    {property ? (
                      <Link href={`/properties/${property.id}`}>
                        <div className="w-full h-full cursor-pointer block">
                          <img 
                            src={property.imageUrl} 
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className="absolute bottom-4 left-4 text-white">
                            <div className="font-bold">{property.priceFormatted || formatCurrency(property.price)}</div>
                            <div className="text-sm opacity-90 truncate">{property.phase ? `${property.phase}, ` : ""}{property.area}</div>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-accent/50 text-muted-foreground">
                        <Building2 className="w-10 h-10 opacity-20" />
                      </div>
                    )}
                  </div>
                  
                  {/* Details Side */}
                  <div className="flex-1 flex flex-col p-5 md:p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusBadge(visit.status)}
                        </div>
                        <h3 className="font-semibold text-xl text-foreground">
                          {property ? property.title : "Property Not Found"}
                        </h3>
                        {property && (
                          <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" /> {property.city}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-auto">
                      <div className="space-y-3 bg-accent/30 p-3 rounded-lg border border-border">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="font-medium">{format(visitDate, "MMMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="font-medium">{visit.visitTime}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3 bg-accent/30 p-3 rounded-lg border border-border">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>{visit.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <span>{visit.phone}</span>
                        </div>
                      </div>
                    </div>
                    
                    {visit.notes && (
                      <div className="mt-4 text-sm text-muted-foreground bg-accent/20 p-3 rounded-lg italic">
                        "{visit.notes}"
                      </div>
                    )}

                    {isUpcoming && (
                      <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                              Cancel Visit
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancel Property Visit?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to cancel your visit to {property?.title}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Keep Visit</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleCancel(visit.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Yes, Cancel Visit
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-xl border border-dashed border-border">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-20" />
          <h3 className="text-lg font-medium text-foreground">No visits scheduled</h3>
          <p className="text-muted-foreground mt-1">You haven't scheduled any property tours yet.</p>
          <Link href="/properties">
            <Button className="mt-6">Browse Properties</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
