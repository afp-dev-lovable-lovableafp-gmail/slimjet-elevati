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

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="mb-8 flex flex-col items-center">
            <img
              src="/images/logo.png"
              alt="ElevaTI Logo"
              className="h-40 w-auto mb-4 mx-auto"
            />
            <p className="text-gray-400 text-lg mx-auto">
              Elevando e levando tecnologia para seu negócio
            </p>
          </div>
          
          <div className="w-full max-w-md mb-8 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4 mx-auto">Newsletter</h3>
            <p className="text-gray-400 mb-4 mx-auto">
              Receba novidades e atualizações sobre tecnologia
            </p>
            <form className="flex flex-col gap-2 w-full items-center">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="w-full max-w-xs px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="w-32 px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary hover:text-[rgb(15,23,42)] transition-colors"
              >
                Assinar
              </button>
            </form>
          </div>
        
          <div className="border-t border-gray-800 w-full pt-8 text-center text-gray-400">
            <p>&copy; {currentYear} ElevaTI. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
