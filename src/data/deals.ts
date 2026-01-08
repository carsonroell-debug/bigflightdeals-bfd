export interface FlightDeal {
  id: string;
  from: string;
  to: string;
  price: number;
  currency: string;
  bestSeason?: string;
  notes?: string;
}

export const sampleDeals: FlightDeal[] = [
  {
    id: "yyz-lis",
    from: "Toronto (YYZ)",
    to: "Lisbon (LIS)",
    price: 550,
    currency: "CAD",
    bestSeason: "March–May, Sept–Nov",
    notes: "Shoulder season, midweek departures, one carry-on only. Perfect for a 7-day Iberian loop starting in Lisbon."
  },
  {
    id: "yyz-mad",
    from: "Toronto (YYZ)",
    to: "Madrid (MAD)",
    price: 580,
    currency: "CAD",
    bestSeason: "March–May, Oct–Nov",
    notes: "Direct flights available. Great base for exploring central Spain solo. Book 2-3 months ahead for best prices."
  },
  {
    id: "yyz-bcn",
    from: "Toronto (YYZ)",
    to: "Barcelona (BCN)",
    price: 620,
    currency: "CAD",
    bestSeason: "April–June, Sept–Oct",
    notes: "Slightly pricier but worth it for the vibe. Midweek departures save $100+. Perfect for a 5-day solo adventure."
  },
  {
    id: "yyz-opo",
    from: "Toronto (YYZ)",
    to: "Porto (OPO)",
    price: 520,
    currency: "CAD",
    bestSeason: "March–May, Sept–Nov",
    notes: "Hidden gem route. Smaller airport, fewer crowds, cheaper than Lisbon. Ideal for a relaxed solo trip."
  },
  {
    id: "yyz-lon",
    from: "Toronto (YYZ)",
    to: "London (LHR/LGW)",
    price: 650,
    currency: "CAD",
    bestSeason: "March–May, Sept–Nov",
    notes: "Classic route with lots of options. Use as a hub to hop to other European cities via budget airlines."
  },
  {
    id: "yyz-ams",
    from: "Toronto (YYZ)",
    to: "Amsterdam (AMS)",
    price: 680,
    currency: "CAD",
    bestSeason: "April–May, Sept–Oct",
    notes: "Direct flights available. Great for solo travellers who want walkable cities and easy train connections."
  },
  {
    id: "yyz-ber",
    from: "Toronto (YYZ)",
    to: "Berlin (BER)",
    price: 640,
    currency: "CAD",
    bestSeason: "May–June, Sept–Oct",
    notes: "Budget-friendly city once you arrive. Midweek flights are key. Perfect for solo travellers on a tight budget."
  },
  {
    id: "yyz-prg",
    from: "Toronto (YYZ)",
    to: "Prague (PRG)",
    price: 590,
    currency: "CAD",
    bestSeason: "April–May, Sept–Oct",
    notes: "Affordable destination with incredible value. Book early for shoulder season deals. Great for 5-7 day trips."
  },
  {
    id: "yyz-vie",
    from: "Toronto (YYZ)",
    to: "Vienna (VIE)",
    price: 660,
    currency: "CAD",
    bestSeason: "April–May, Sept–Oct",
    notes: "Central European hub. Easy connections to Budapest, Bratislava. Midweek departures save significantly."
  },
  {
    id: "yyz-ist",
    from: "Toronto (YYZ)",
    to: "Istanbul (IST)",
    price: 720,
    currency: "CAD",
    bestSeason: "March–May, Sept–Nov",
    notes: "Longer flight but incredible value on the ground. Perfect gateway to Eastern Europe and Middle East."
  }
];
