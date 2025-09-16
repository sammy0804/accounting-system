interface CardProps {
    title: string;
    value: string;
    addClass?: string
}

export function Card({ title, value, addClass }: CardProps) {
  return (
    <div className={`p-4 border text-white rounded-lg ${addClass ?? ""}`}>
      <div className="text-sm opacity-80">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}