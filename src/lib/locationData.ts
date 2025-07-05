export interface District {
  name: string;
  discoms: string[];
}

export interface State {
  name: string;
  districts: District[];
}

export const locationData: State[] = [
  {
    name: "Bihar",
    districts: [
      { name: "Araria", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Arwal", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Aurangabad", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Banka", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Begusarai", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Bhagalpur", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Bhojpur", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Buxar", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Darbhanga", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "East Champaran", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Gaya", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Gopalganj", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Jamui", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Jehanabad", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Kaimur", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Katihar", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Khagaria", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Kishanganj", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Lakhisarai", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Madhepura", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Madhubani", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Munger", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Muzaffarpur", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Nalanda", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Nawada", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Patna", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Purnia", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Rohtas", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Saharsa", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Samastipur", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Saran", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Sheikhpura", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Sheohar", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Sitamarhi", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Siwan", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Supaul", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "Vaishali", discoms: ["NBPDCL", "SBPDCL"] },
      { name: "West Champaran", discoms: ["NBPDCL", "SBPDCL"] }
    ]
  },
  {
    name: "Jharkhand",
    districts: [
      { name: "Bokaro", discoms: ["JBVNL", "JUSCO", "SAIL Bokaro Steel City Utility", "DVC"] },
      { name: "Chatra", discoms: ["JBVNL"] },
      { name: "Deoghar", discoms: ["JBVNL"] },
      { name: "Dhanbad", discoms: ["JBVNL", "DVC"] },
      { name: "Dumka", discoms: ["JBVNL"] },
      { name: "East Singhbhum", discoms: ["JBVNL", "JUSCO", "DVC"] },
      { name: "Garhwa", discoms: ["JBVNL"] },
      { name: "Giridih", discoms: ["JBVNL"] },
      { name: "Godda", discoms: ["JBVNL"] },
      { name: "Gumla", discoms: ["JBVNL"] },
      { name: "Hazaribagh", discoms: ["JBVNL"] },
      { name: "Jamtara", discoms: ["JBVNL"] },
      { name: "Khunti", discoms: ["JBVNL"] },
      { name: "Koderma", discoms: ["JBVNL"] },
      { name: "Latehar", discoms: ["JBVNL"] },
      { name: "Lohardaga", discoms: ["JBVNL"] },
      { name: "Pakur", discoms: ["JBVNL"] },
      { name: "Palamu", discoms: ["JBVNL"] },
      { name: "Ramgarh", discoms: ["JBVNL"] },
      { name: "Ranchi", discoms: ["JBVNL"] },
      { name: "Sahibganj", discoms: ["JBVNL"] },
      { name: "Saraikela-Kharsawan", discoms: ["JBVNL"] },
      { name: "Simdega", discoms: ["JBVNL"] },
      { name: "West Singhbhum", discoms: ["JBVNL", "DVC"] }
    ]
  },
  {
    name: "Odisha",
    districts: [
      { name: "Angul", discoms: ["TPCODL", "TPNODL", "TPWODL"] },
      { name: "Balangir", discoms: ["TPWODL"] },
      { name: "Baleshwar", discoms: ["TPSODL"] },
      { name: "Bargarh", discoms: ["TPWODL"] },
      { name: "Bhadrak", discoms: ["TPSODL"] },
      { name: "Boudh", discoms: ["TPWODL"] },
      { name: "Cuttack", discoms: ["TPCODL"] },
      { name: "Debagarh", discoms: ["TPWODL"] },
      { name: "Dhenkanal", discoms: ["TPCODL"] },
      { name: "Gajapati", discoms: ["TPSODL"] },
      { name: "Ganjam", discoms: ["TPSODL"] },
      { name: "Jagatsinghpur", discoms: ["TPCODL"] },
      { name: "Jajpur", discoms: ["TPCODL"] },
      { name: "Jharsuguda", discoms: ["TPWODL"] },
      { name: "Kalahandi", discoms: ["TPWODL"] },
      { name: "Kandhamal", discoms: ["TPSODL"] },
      { name: "Kendrapara", discoms: ["TPCODL"] },
      { name: "Keonjhar", discoms: ["TPNODL"] },
      { name: "Khordha", discoms: ["TPCODL"] },
      { name: "Koraput", discoms: ["TPSODL"] },
      { name: "Malkangiri", discoms: ["TPSODL"] },
      { name: "Mayurbhanj", discoms: ["TPNODL"] },
      { name: "Nabarangpur", discoms: ["TPSODL"] },
      { name: "Nayagarh", discoms: ["TPCODL"] },
      { name: "Nuapada", discoms: ["TPWODL"] },
      { name: "Puri", discoms: ["TPCODL"] },
      { name: "Rayagada", discoms: ["TPSODL"] },
      { name: "Sambalpur", discoms: ["TPWODL"] },
      { name: "Subarnapur", discoms: ["TPWODL"] },
      { name: "Sundargarh", discoms: ["TPWODL"] }
    ]
  },
  {
    name: "West Bengal",
    districts: [
      { name: "Alipurduar", discoms: ["WBSEDCL"] },
      { name: "Bankura", discoms: ["WBSEDCL"] },
      { name: "Birbhum", discoms: ["WBSEDCL"] },
      { name: "Cooch Behar", discoms: ["WBSEDCL"] },
      { name: "Dakshin Dinajpur", discoms: ["WBSEDCL"] },
      { name: "Darjeeling", discoms: ["WBSEDCL"] },
      { name: "Hooghly", discoms: ["WBSEDCL"] },
      { name: "Howrah", discoms: ["WBSEDCL"] },
      { name: "Jalpaiguri", discoms: ["WBSEDCL"] },
      { name: "Jhargram", discoms: ["WBSEDCL"] },
      { name: "Kalimpong", discoms: ["WBSEDCL"] },
      { name: "Kolkata", discoms: ["CESC", "WBSEDCL"] },
      { name: "Malda", discoms: ["WBSEDCL"] },
      { name: "Murshidabad", discoms: ["WBSEDCL"] },
      { name: "Nadia", discoms: ["WBSEDCL"] },
      { name: "North 24 Parganas", discoms: ["WBSEDCL"] },
      { name: "Paschim Bardhaman", discoms: ["WBSEDCL", "DPL", "DVC"] },
      { name: "Paschim Medinipur", discoms: ["WBSEDCL"] },
      { name: "Purba Bardhaman", discoms: ["WBSEDCL", "DPL", "DVC"] },
      { name: "Purba Medinipur", discoms: ["WBSEDCL"] },
      { name: "Purulia", discoms: ["WBSEDCL"] },
      { name: "South 24 Parganas", discoms: ["WBSEDCL"] },
      { name: "Uttar Dinajpur", discoms: ["WBSEDCL"] }
    ]
  }
];

export const getDistrictsByState = (stateName: string): string[] => {
  const state = locationData.find(s => s.name === stateName);
  return state ? state.districts.map(d => d.name) : [];
};

export const getDiscomsByState = (stateName: string): string[] => {
  const state = locationData.find(s => s.name === stateName);
  if (!state) return [];
  
  const allDiscoms = new Set<string>();
  state.districts.forEach(district => {
    district.discoms.forEach(discom => allDiscoms.add(discom));
  });
  
  return Array.from(allDiscoms);
};

export const getDiscomsByDistrict = (stateName: string, districtName: string): string[] => {
  const state = locationData.find(s => s.name === stateName);
  if (!state) return [];
  
  const district = state.districts.find(d => d.name === districtName);
  return district ? district.discoms : [];
}; 