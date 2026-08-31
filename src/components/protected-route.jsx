import { Navigate } from "react-router";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />;

  try {
    // Decodifica a parte do payload do JWT (segundo segmento do base64)
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (!payload || !payload.exp) return <Navigate to="/login" replace />;

    // Converte 'exp' (em segundos) para milissegundos e compara com o tempo atual
    const currentTime = Date.now() / 1000;

    // Se o tempo atual for maior que o tempo de expiração, o token expirou
    if (payload.exp < currentTime) {
      localStorage.removeItem("token"); // Limpa o token expirado
      return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
  } catch (error) {
    // Se o token for inválido/corrompido
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
}
