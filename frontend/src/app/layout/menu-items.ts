export interface MenuItem {
  label: string;
  route: string;
  roles?: string[]; 
}

export const MENU_ITEMS: MenuItem[] = [
  { label: 'Inicio', route: 'public/view-business', roles: ['client'] },
  { label: 'Inicio', route: 'business/appointments', roles: ['business'] },
  { label: 'Ver Citas Cliente', route: 'client/appointment-control', roles: ['client'] },
  { label: 'Agregar Servicio', route: 'business/add-service', roles: ['business'] },
  { label: 'Agregar Empleados', route: 'business/add-employee', roles: ['business'] },
  { label: 'Servicios', route: 'business/services', roles: ['business'] },
  { label: 'Empleados', route: 'business/employees', roles: ['business'] },
];