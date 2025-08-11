
import React from 'react';
import Layout from '@/components/layout/Layout';
import TariffManagerBase from '@/components/admin/tariff/TariffManagerBase';

const CESCTariffManager = () => {
  return (
    <Layout>
      <TariffManagerBase
        providerCode="CESC"
        title="CESC Tariff Management"
        description="Manage CESC (Calcutta Electric Supply Corporation) tariffs, slabs, and provider configurations."
      />
    </Layout>
  );
};

export default CESCTariffManager;
