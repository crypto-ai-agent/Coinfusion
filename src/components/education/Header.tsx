interface HeaderProps {
  isAuthenticated: boolean;
}

export const Header = ({ isAuthenticated }: HeaderProps) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-primary mb-4">Educational Hub</h1>
      <p className="text-xl text-gray-600">
        {isAuthenticated
          ? "Continue your learning journey"
          : "Expand your cryptocurrency knowledge"}
      </p>
    </div>
  );
};