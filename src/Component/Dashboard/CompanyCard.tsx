const CompanyCard = ({
  quantity,
  title,
  className,
}: {
  quantity: string | number;
  title?: string;
  className?: string;
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-5 ${className}`}
    >
      <h2
        className={`text-3xl font-semibold ${
          title === "Total" ? "text-red-500" : ""
        }`}
      >
        {quantity ?? 0}
      </h2>

      <h4 className="text-base">{title}</h4>
    </div>
  );
};

export default CompanyCard;
