export const events = [
  {
    id: "wedding",
    name: "Wedding",
    description: "Make your special day unforgettable.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=900",
  },
  {
    id: "engagement",
    name: "Engagement",
    description: "Celebrate the beginning of your journey.",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900",
  },
  {
    id: "birthday",
    name: "Birthday",
    description: "Create beautiful birthday memories.",
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900",
  },
  {
    id: "corporate",
    name: "Corporate Event",
    description: "Professional events made memorable.",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900",
  },
  {
    id: "private-party",
    name: "Private Party",
    description: "Celebrate your moments with style.",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900",
  },
];

export const packages = {
  wedding: [
    {
      tier: "CLASSIC",
      price: 75000,
      description: "Beautiful and affordable wedding arrangements.",
      services: ["Catering", "Decoration", "Photography", "Sound"],
    },
    {
      tier: "ROYAL",
      price: 150000,
      description: "Grand luxury wedding arrangements.",
      services: [
        "Premium Catering",
        "Luxury Decoration",
        "Cinematic Photography",
        "Premium Sound",
      ],
    },
  ],

  engagement: [
    {
      tier: "CLASSIC",
      price: 25000,
      description: "Simple and elegant engagement celebration.",
      services: ["Decoration", "Photography", "Sound"],
    },
    {
      tier: "ROYAL",
      price: 55000,
      description: "A luxurious engagement experience.",
      services: ["Luxury Decoration", "Photography", "Premium Sound"],
    },
  ],

  birthday: [
    {
      tier: "CLASSIC",
      price: 15000,
      description: "Fun and affordable birthday celebration.",
      services: ["Decoration", "Cake", "Photography"],
    },
    {
      tier: "ROYAL",
      price: 35000,
      description: "A grand birthday celebration.",
      services: ["Premium Decoration", "Cake", "Photography", "Sound"],
    },
  ],

  corporate: [
    {
      tier: "CLASSIC",
      price: 40000,
      description: "Professional corporate event setup.",
      services: ["Venue Decoration", "Catering", "Sound"],
    },
    {
      tier: "ROYAL",
      price: 90000,
      description: "Premium corporate event experience.",
      services: ["Luxury Decoration", "Premium Catering", "AV Setup"],
    },
  ],

  "private-party": [
    {
      tier: "CLASSIC",
      price: 20000,
      description: "A simple private celebration.",
      services: ["Decoration", "Catering", "Sound"],
    },
    {
      tier: "ROYAL",
      price: 45000,
      description: "An exclusive luxury celebration.",
      services: ["Luxury Decoration", "Premium Catering", "DJ"],
    },
  ],
};