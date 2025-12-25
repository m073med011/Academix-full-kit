export function PlaceholderTab({ message }: { message: string }) {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}
