/**
 * Loading skeleton component for the crypto details view
 * @component
 */
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const CryptoDetailsSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8" data-testid="crypto-details-skeleton">
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="ml-auto text-right">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-24 mt-2" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};