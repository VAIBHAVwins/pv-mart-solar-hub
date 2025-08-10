
import Layout from '@/components/layout/Layout';
import EnhancedSolarGame from '@/components/game/EnhancedSolarGame';

const EnhancedGame = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Solar Energy Challenge
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn about solar energy while playing! Place solar panels strategically, 
            adapt to weather changes, and achieve your energy generation goals.
          </p>
        </div>
        <EnhancedSolarGame />
      </div>
    </Layout>
  );
};

export default EnhancedGame;
