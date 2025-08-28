import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path);
  };

  const adminNavItems = [
    { name: 'Dashboard', href: '/admin', current: isActive('/admin') },
    { name: 'Products', href: '/admin/products', current: isActive('/admin/products') },
    { name: 'Users', href: '/admin/users', current: isActive('/admin/users') },
    { name: 'Quarantine', href: '/admin/quarantine', current: isActive('/admin/quarantine') },
    { name: 'Licenses', href: '/admin/licenses', current: isActive('/admin/licenses') },
    { name: 'Webhooks', href: '/admin/webhooks', current: isActive('/admin/webhooks') },
    { name: 'GDPR Requests', href: '/admin/gdpr/requests', current: isActive('/admin/gdpr') },
    { name: 'Email Templates', href: '/admin/email-templates', current: isActive('/admin/email-templates') },
  ];

  const isAdminPath = pathname?.startsWith('/admin');

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between">
          <div className="text-xl font-bold">Marketplace</div>
          <div className="space-x-4">
            <Link href="/" className={`hover:text-blue-600 ${isActive('/') ? 'text-blue-600 font-medium' : ''}`}>Home</Link>
            <Link href="/products" className={`hover:text-blue-600 ${isActive('/products') ? 'text-blue-600 font-medium' : ''}`}>Products</Link>
            
            {isAdminPath ? (
              <div className="flex space-x-4">
                {adminNavItems.map((item) => (
                  <Link 
                    key={item.name}
                    href={item.href}
                    className={`hover:text-blue-600 ${item.current ? 'text-blue-600 font-medium' : ''}`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            ) : (
              <Link href="/login" className={`hover:text-blue-600 ${isActive('/login') ? 'text-blue-600 font-medium' : ''}`}>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
