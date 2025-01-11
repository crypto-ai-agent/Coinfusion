import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const News = () => {
  const news = [
    {
      title: "Bitcoin Reaches New All-Time High",
      description: "Bitcoin has surpassed its previous record, reaching unprecedented levels as institutional adoption continues to grow. Analysts attribute this surge to increased mainstream acceptance and growing institutional investment in the cryptocurrency space.",
      date: "March 15, 2024",
      category: "Market Update",
      imageUrl: "/placeholder.svg"
    },
    {
      title: "New Regulations for Crypto Trading",
      description: "Global financial regulators have announced new framework proposals for cryptocurrency exchanges, aiming to enhance investor protection and market stability. The proposed guidelines focus on transparency and security measures.",
      date: "March 14, 2024",
      category: "Regulation",
      imageUrl: "/placeholder.svg"
    },
    {
      title: "DeFi Protocol Launches New Feature",
      description: "A leading DeFi platform has introduced an innovative staking mechanism, allowing users to earn higher yields while maintaining liquidity. This development marks a significant advancement in DeFi technology.",
      date: "March 13, 2024",
      category: "DeFi",
      imageUrl: "/placeholder.svg"
    },
    {
      title: "Major Bank Adopts Blockchain Technology",
      description: "One of the world's largest banks has announced the integration of blockchain technology into its payment systems, signaling growing institutional acceptance of crypto technologies.",
      date: "March 12, 2024",
      category: "Adoption",
      imageUrl: "/placeholder.svg"
    },
    {
      title: "New Crypto Security Standards Proposed",
      description: "Industry leaders have proposed new security standards for cryptocurrency exchanges and wallets, aiming to prevent hacks and protect user assets through enhanced security measures.",
      date: "March 11, 2024",
      category: "Security",
      imageUrl: "/placeholder.svg"
    },
    {
      title: "Environmental Impact of Mining Decreases",
      description: "Recent studies show a significant reduction in the environmental impact of cryptocurrency mining, as more operations switch to renewable energy sources and implement energy-efficient technologies.",
      date: "March 10, 2024",
      category: "Environment",
      imageUrl: "/placeholder.svg"
    }
  ];

  return (
    <section id="news" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Latest Cryptocurrency News
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest cryptocurrency news, market trends, and industry developments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <Card key={item.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="mb-2">{item.title}</CardTitle>
                    <CardDescription>{item.date}</CardDescription>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {item.category}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <a
                  href="#"
                  className="text-primary hover:text-primary/80 font-medium inline-flex items-center group"
                >
                  Read more
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};