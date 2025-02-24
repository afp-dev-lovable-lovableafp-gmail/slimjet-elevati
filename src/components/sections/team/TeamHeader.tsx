
interface TeamHeaderProps {
  title: string;
  description: string;
}

export const TeamHeader = ({ title, description }: TeamHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <p className="text-gray-600 max-w-3xl mx-auto">
        {description}
      </p>
    </div>
  );
};
