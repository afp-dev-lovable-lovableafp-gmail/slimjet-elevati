import { MessageCircle } from "lucide-react";

const contactLinks = [
  {
    icon: MessageCircle,
    href: "https://wa.me/5534996747864",
    label: "WhatsApp"
  },
  {
    icon: MessageCircle,
    href: "https://telegram.com/@elevati",
    label: "Telegram"
  }
];

const ClientFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <img src="/images/logo.png" alt="ElevaTI Logo" className="h-8 w-auto" />
            <span className="ml-2 text-sm text-gray-600">
              &copy; {currentYear} ElevaTI
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {contactLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary transition flex items-center"
              >
                <Icon className="h-4 w-4 mr-1" />
                <span className="text-sm">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ClientFooter; 