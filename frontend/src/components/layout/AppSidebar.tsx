import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Home,
  Inbox,
  Calendar,
  Search,
  Settings,
  User,
  FileText,
  BarChart,
  MessageSquare,
  ChevronDown,
} from 'lucide-react';

export default function SidebarExample() {
  const [activeItem, setActiveItem] = React.useState('home');

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar collapsible='none'>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navegación Principal</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeItem === 'home'}
                      onClick={() => setActiveItem('home')}
                    >
                      <Home className="h-4 w-4" />
                      <span>Inicio</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeItem === 'inbox'}
                      onClick={() => setActiveItem('inbox')}
                    >
                      <Inbox className="h-4 w-4" />
                      <span>Bandeja de entrada</span>
                      <span className="ml-auto text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        3
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeItem === 'calendar'}
                      onClick={() => setActiveItem('calendar')}
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Calendario</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeItem === 'search'}
                      onClick={() => setActiveItem('search')}
                    >
                      <Search className="h-4 w-4" />
                      <span>Buscar</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Contenido</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeItem === 'documents'}
                      onClick={() => setActiveItem('documents')}
                    >
                      <FileText className="h-4 w-4" />
                      <span>Documentos</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeItem === 'analytics'}
                      onClick={() => setActiveItem('analytics')}
                    >
                      <BarChart className="h-4 w-4" />
                      <span>Analíticas</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeItem === 'messages'}
                      onClick={() => setActiveItem('messages')}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Mensajes</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeItem === 'settings'}
                  onClick={() => setActiveItem('settings')}
                >
                  <Settings className="h-4 w-4" />
                  <span>Configuración</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton className="group">
                  <User className="h-4 w-4" />
                  <div className="flex flex-col items-start flex-1">
                    <span className="text-sm font-medium">Usuario Demo</span>
                    <span className="text-xs text-muted-foreground">demo@ejemplo.com</span>
                  </div>
                  <ChevronDown className="h-4 w-4 ml-auto" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 p-6">
          <div className="mb-4">
            <SidebarTrigger />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
