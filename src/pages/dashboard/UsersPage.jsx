import { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Shield,
  Code2,
  User as UserIcon,
  Eye,
  EyeOff,
  Filter,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import Header from "../../components/dashboard/Header";
import { apiFetch } from "@/api/apiFetch";
import { PaginationControl } from "@/components/ui/pagination-control";

const roleStyles = {
  developer: {
    badge:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-800",
    label: "Desenvolvedor",
    icon: Code2,
  },
  admin: {
    badge:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-800",
    label: "Administrador",
    icon: Shield,
  },
  user: {
    badge:
      "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-800",
    label: "Usuário",
    icon: UserIcon,
  },
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Paginação
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalUsers: 0,
    totalPages: 1,
  });

  // Estados de Modal Form (Criar/Editar)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Estados de Modal Delete
  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Carregar Usuários com paginação padronizada
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await apiFetch(`/users?page=${page}&limit=10`);
      if (response && response.ok) {
        const data = await response.json();

        setUsers(data.users || []);
        setPagination({
          totalUsers: data.total_users || 0,
          totalPages: data.total_pages || 1,
        });
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", password: "", role: "user" });
    setFormError("");
    setShowPassword(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setFormError("");
    setShowPassword(false);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setFormError("");

    const body = new FormData();
    if (formData.name) body.append("name", formData.name);
    if (formData.email) body.append("email", formData.email);
    if (formData.password) body.append("password", formData.password);
    if (formData.role) body.append("role", formData.role);

    try {
      const endpoint = editingUser ? `/users/${editingUser.id}` : "/users";
      const method = editingUser ? "PUT" : "POST";

      const response = await apiFetch(endpoint, { method, body });

      if (response && response.ok) {
        setIsFormOpen(false);
        fetchUsers();
      } else {
        const data = await response.json();
        setFormError(data.detail || "Ocorreu um erro ao salvar o usuário.");
      }
    } catch (err) {
      setFormError("Erro de conexão com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingUser || isDeleting) return;

    setIsDeleting(true);
    try {
      const response = await apiFetch(`/users/${deletingUser.id}`, {
        method: "DELETE",
      });

      if (response && (response.ok || response.status === 204)) {
        setDeletingUser(null);
        if (page !== 1) {
          setPage(1);
        } else {
          fetchUsers();
        }
      }
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtragem local dos itens carregados na página
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex flex-col">
      <Header
        title="Gerenciamento de Usuários"
        subtitle="Gerencie contas, permissões e perfis de acesso da plataforma"
      />

      <div className="flex-1 space-y-6 p-4 lg:p-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Todos os Usuários</CardTitle>
                <CardDescription>
                  Exibindo {filteredUsers.length} de {pagination.totalUsers}{" "}
                  usuários cadastrados
                </CardDescription>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar por nome ou e-mail..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 sm:w-64"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Função
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filtrar por Função</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setRoleFilter("all")}>
                      Todos os Perfis
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRoleFilter("admin")}>
                      Administrador
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setRoleFilter("developer")}
                    >
                      Desenvolvedor
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRoleFilter("user")}>
                      Usuário
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button onClick={handleOpenCreate} className="gap-2 shrink-0">
                  <UserPlus className="h-4 w-4" />
                  Novo Usuário
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Função / Perfil</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Criado em
                    </TableHead>
                    <TableHead className="w-[70px] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center">
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <Spinner className="h-5 w-5 text-primary" />
                          <span>Carregando usuários...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-24 text-center text-muted-foreground"
                      >
                        Nenhum usuário encontrado nesta página.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => {
                      const roleConfig =
                        roleStyles[user.role] || roleStyles.user;
                      const RoleIcon = roleConfig.icon;

                      return (
                        <TableRow key={user.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs ring-1 ring-primary/20">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-foreground">
                                {user.name}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="text-muted-foreground">
                            {user.email}
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`gap-1.5 font-normal text-xs ${roleConfig.badge}`}
                            >
                              <RoleIcon className="h-3 w-3 shrink-0" />
                              {roleConfig.label}
                            </Badge>
                          </TableCell>

                          <TableCell className="hidden text-muted-foreground md:table-cell text-xs font-mono">
                            {new Date(user.created_at).toLocaleDateString(
                              "pt-BR",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              },
                            )}
                          </TableCell>

                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleOpenEdit(user)}
                                  className="gap-2"
                                >
                                  <Pencil className="h-4 w-4 text-muted-foreground" />
                                  Editar
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() => setDeletingUser(user)}
                                  className="gap-2 text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Paginação padronizada */}
            <div className="pt-4">
              <PaginationControl
                currentPage={page}
                totalPages={pagination.totalPages}
                onPageChange={(newPage) => setPage(newPage)}
                isLoading={isLoading}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog para Criar/Editar Usuário */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Editar Usuário" : "Novo Usuário"}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Altere os dados necessários do usuário."
                : "Preencha as informações para criar um novo usuário no sistema."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                placeholder="Ex: João Silva"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@empresa.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Senha {editingUser && "(Deixe em branco para não alterar)"}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    editingUser ? "••••••••" : "Digite a senha do novo usuário"
                  }
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required={!editingUser}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Função / Perfil</Label>
              <Select
                value={formData.role}
                onValueChange={(val) => setFormData({ ...formData, role: val })}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Selecione o perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="developer">Desenvolvedor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formError && (
              <Alert variant="destructive">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Salvando...
                  </>
                ) : (
                  "Salvar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={!!deletingUser} onOpenChange={() => setDeletingUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir Usuário</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o usuário{" "}
              <strong className="text-foreground">{deletingUser?.name}</strong>?
              Esta ação não poderá ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingUser(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Excluindo...
                </>
              ) : (
                "Excluir Usuário"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
