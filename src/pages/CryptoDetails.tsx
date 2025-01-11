import { useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { CryptoDetailsView } from "@/components/CryptoDetailsView";

const CryptoDetails = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <CryptoDetailsView cryptoId={id!} />
      </div>
    </div>
  );
};

export default CryptoDetails;