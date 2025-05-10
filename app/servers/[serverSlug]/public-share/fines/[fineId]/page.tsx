import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PiggyBank, DollarSignIcon, AlertTriangle, User, MapPin, Calendar, ClipboardList, Car } from "lucide-react";
import formatCurrency from "@/lib/format/currency";
import { processFineAction } from "./action";

type PageProps = {
  params: { 
    serverSlug: string;
    fineId: string; 
  };
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function SingleFinePage({ params, searchParams }: PageProps) {
  const { fineId } = params;
  const t = await getTranslations("Fines");
  const success = await searchParams.success as string | undefined;
  
  // Récupérer les données de l'amende
  const fine = await prisma.fine.findUnique({
    where: { id: fineId },
    include: {
      citizen: true,
      penalCode: true,
      vehicle: true
    },
  });
  
  if (!fine) {
    notFound();
  }
  
  // Si l'amende a déjà été payée ou contestée, on le montre
  const isPending = fine.status === "PENDING";
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    });
  };
  
  const renderStatus = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-amber-500/15 text-amber-600 border-amber-200 hover:bg-amber-500/20">{t("status.pending")}</Badge>;
      case "PAID":
        return <Badge className="bg-green-500/15 text-green-600 border-green-200 hover:bg-green-500/20">{t("status.paid")}</Badge>;
      case "CONTESTED":
        return <Badge className="bg-red-500/15 text-red-600 border-red-200 hover:bg-red-500/20">{t("status.contested")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="flex items-center gap-2 text-xl">
            <PiggyBank className="h-6 w-6 text-primary" />
            {t("singleFineTitle")}
          </CardTitle>
          <CardDescription className="mt-1">
            {t("singleFineDescription")}
          </CardDescription>
          {success && (
            <div className={`mt-4 p-3 rounded-md ${
              success === "pay" 
                ? "bg-green-100 border border-green-200 text-green-800 dark:bg-green-950/30 dark:border-green-900 dark:text-green-400"
                : "bg-amber-100 border border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-400"
            }`}>
              {success === "pay" 
                ? t("paymentSuccessful")
                : t("contestSuccessful")
              }
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {/* Montant et statut en évidence */}
          <div className="flex justify-between items-center p-6 bg-primary/5 border-b">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t("amount")}</p>
              <p className="text-3xl font-bold">{formatCurrency(fine.amount)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-muted-foreground mb-1">{t("statusLabel")}</p>
              <div>
                {renderStatus(fine.status)}
                {fine.status === "PAID" && fine.paidAt && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {t("paidOn")} {formatDate(fine.paidAt)}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Détails de l'amende */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                {/* Infraction */}
                <div className="flex gap-4 items-start">
                  <div className="shrink-0 h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <ClipboardList className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{t("offense")}</h3>
                    <p className="font-medium">{fine.reason}</p>
                    {fine.penalCode?.description && (
                      <p className="text-sm text-muted-foreground mt-1">{fine.penalCode.description}</p>
                    )}
                  </div>
                </div>
                
                {/* Véhicule impliqué */}
                {fine.vehicle && (
                  <div className="flex gap-4 items-start">
                    <div className="shrink-0 h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <Car className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">{t("involvedVehicle")}</h3>
                      <p className="font-medium">{fine.vehicle.make} {fine.vehicle.model}</p>
                      <p className="text-sm text-muted-foreground">
                        {fine.vehicle.licensePlate} - {fine.vehicle.color}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Date */}
                <div className="flex gap-4 items-start">
                  <div className="shrink-0 h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{t("date")}</h3>
                    <p className="font-medium">{formatDate(fine.createdAt)}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Lieu */}
                {fine.location && (
                  <div className="flex gap-4 items-start">
                    <div className="shrink-0 h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">{t("location")}</h3>
                      <p className="font-medium">{fine.location}</p>
                    </div>
                  </div>
                )}
                
                {/* Agent */}
                <div className="flex gap-4 items-start">
                  <div className="shrink-0 h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{t("issuedBy")}</h3>
                    <p className="font-medium">{fine.issuedByName}</p>
                  </div>
                </div>
                
                {/* Points de permis et temps de prison si applicable */}
                <div className="space-y-3">
                  {fine.licensePoints && fine.licensePoints > 0 && (
                    <div className="p-3 bg-muted/30 rounded-md">
                      <h3 className="text-sm font-medium text-muted-foreground">{t("licensePoints")}</h3>
                      <p className="font-medium">-{fine.licensePoints} points</p>
                    </div>
                  )}
                  
                  {typeof fine.jailTime === 'number' && fine.jailTime > 0 && (
                    <div className="p-3 bg-muted/30 rounded-md">
                      <h3 className="text-sm font-medium text-muted-foreground">{t("jailTime")}</h3>
                      <p className="font-medium">{fine.jailTime} {t("minutes")}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Notes */}
            {fine.notes && (
              <div className="border-t pt-4 mt-6">
                <h3 className="font-medium mb-2">{t("notes")}</h3>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap p-3 bg-muted/30 rounded-md">
                  {fine.notes}
                </div>
              </div>
            )}
          </div>
          
          {/* Boutons d'action */}
          {isPending && (
            <div className="border-t bg-muted/10 p-4">
              <div className="flex justify-end items-center gap-3">
                <form action={processFineAction} className="w-[120px]">
                  <input type="hidden" name="fineId" value={fine.id} />
                  <input type="hidden" name="action" value="contest" />
                  <Button type="submit" variant="outline" className="w-full font-medium bg-white hover:bg-red-50 text-red-600 border-red-200 hover:text-red-700 hover:border-red-300">
                    <AlertTriangle className="h-4 w-4" />
                    {t("contest")}
                  </Button>
                </form>
                <form action={processFineAction} className="w-[120px]">
                  <input type="hidden" name="fineId" value={fine.id} />
                  <input type="hidden" name="action" value="pay" />
                  <Button type="submit" className="w-full font-medium bg-green-600 hover:bg-green-700 text-white">
                    <DollarSignIcon className="h-4 w-4" />
                    {t("pay")}
                  </Button>
                </form>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t py-4 text-xs text-muted-foreground bg-muted/10">
          {t("privacyNotice")}
        </CardFooter>
      </Card>
    </div>
  );
}
