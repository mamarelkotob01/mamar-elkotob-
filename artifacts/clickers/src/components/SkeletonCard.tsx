export function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-card border border-border animate-pulse">
      <div className="aspect-[2/3] bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded-lg w-3/4" />
        <div className="h-3 bg-muted rounded-lg w-1/2" />
        <div className="h-3 bg-muted/50 rounded-lg w-1/3" />
        <div className="h-5 bg-muted rounded-lg w-1/4 mt-2" />
      </div>
    </div>
  );
}

export function SkeletonWorldCard() {
  return (
    <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-muted animate-pulse" />
  );
}

export function SkeletonAuthorCard() {
  return (
    <div className="rounded-2xl bg-card border border-border p-6 animate-pulse space-y-4">
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded" />
        <div className="h-3 bg-muted rounded w-5/6" />
      </div>
    </div>
  );
}
