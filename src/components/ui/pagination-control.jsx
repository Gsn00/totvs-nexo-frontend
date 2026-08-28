import { Button } from "@/components/ui/button";

export function PaginationControl({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  className = "",
}) {
  // Garante que totalPages nunca seja menor que 1 para evitar "Página 1 de 0"
  const safeTotalPages = Math.max(1, totalPages || 1);

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="text-sm text-muted-foreground">
        Página <strong className="text-foreground">{currentPage}</strong> de{" "}
        <strong className="text-foreground">{safeTotalPages}</strong>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1 || isLoading}
          className="h-8 text-xs"
        >
          Anterior
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= safeTotalPages || isLoading}
          className="h-8 text-xs"
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}
