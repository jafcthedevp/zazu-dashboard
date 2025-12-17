"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { CheckCircle, Shield, Zap, BarChart3 } from "lucide-react"

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <span className="text-lg font-bold text-primary-foreground">V</span>
            </div>
            <span className="text-xl font-semibold">VoucherFlow</span>
          </div>
          <nav className="flex items-center gap-6">
            <Button variant="ghost" onClick={() => router.push("/login")}>
              Iniciar Sesión
            </Button>
            <Button onClick={() => router.push("/register")}>Registrarse</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-2 text-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            Sistema de gestión en tiempo real
          </div>
          <h1 className="mb-6 text-balance text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            Gestiona tus vouchers y notificaciones en un solo lugar
          </h1>
          <p className="mb-8 text-balance text-xl leading-relaxed text-muted-foreground">
            Plataforma completa para monitorear, validar y gestionar vouchers con seguimiento en tiempo real. Control
            total de tus transacciones desde cualquier dispositivo.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" onClick={() => router.push("/login")} className="px-8">
              Comenzar ahora
            </Button>
            <Button size="lg" variant="outline" className="px-8 bg-transparent">
              Ver demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold">99.9%</div>
            <div className="text-sm text-muted-foreground">Uptime garantizado</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold">&lt;100ms</div>
            <div className="text-sm text-muted-foreground">Tiempo de respuesta</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold">10k+</div>
            <div className="text-sm text-muted-foreground">Transacciones/día</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold">24/7</div>
            <div className="text-sm text-muted-foreground">Soporte disponible</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold">Todo lo que necesitas para gestionar vouchers</h2>
          <p className="text-lg text-muted-foreground">Herramientas poderosas diseñadas para equipos modernos</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-3 text-xl font-semibold">Validación instantánea</h3>
            <p className="leading-relaxed text-muted-foreground">
              Procesa y valida vouchers en tiempo real con nuestro sistema de alta velocidad. Respuesta inmediata para
              tus operaciones.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-3 text-xl font-semibold">Seguridad avanzada</h3>
            <p className="leading-relaxed text-muted-foreground">
              Protección de datos de nivel empresarial con encriptación end-to-end y auditoría completa de todas las
              transacciones.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-3 text-xl font-semibold">Análisis detallado</h3>
            <p className="leading-relaxed text-muted-foreground">
              Dashboard con métricas en tiempo real, filtros avanzados y reportes personalizables para tomar mejores
              decisiones.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-3 text-xl font-semibold">Seguimiento completo</h3>
            <p className="leading-relaxed text-muted-foreground">
              Rastrea cada voucher desde su creación hasta su validación con historial completo de estados y cambios.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="mb-3 text-xl font-semibold">Multi-dispositivo</h3>
            <p className="leading-relaxed text-muted-foreground">
              Gestiona tus vouchers desde cualquier dispositivo. Interfaz responsive optimizada para móvil, tablet y
              desktop.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="mb-3 text-xl font-semibold">Búsqueda potente</h3>
            <p className="leading-relaxed text-muted-foreground">
              Encuentra cualquier voucher al instante con filtros por código, dispositivo, monto o estado. Búsqueda
              inteligente incluida.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h2 className="mb-4 text-4xl font-bold">Comienza a gestionar tus vouchers hoy</h2>
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
            Únete a cientos de empresas que confían en VoucherFlow para gestionar sus transacciones de forma segura y
            eficiente.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" onClick={() => router.push("/register")} className="px-8">
              Crear cuenta gratis
            </Button>
            <Button size="lg" variant="outline" className="px-8 bg-transparent">
              Contactar ventas
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                  <span className="text-lg font-bold text-primary-foreground">V</span>
                </div>
                <span className="text-xl font-semibold">VoucherFlow</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Sistema de gestión de vouchers y notificaciones en tiempo real.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Producto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Características
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Precios
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Seguridad
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Acerca de
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Términos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Licencia
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            © 2025 VoucherFlow. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
