export interface PromotionItem {
    id: number;
    title: string;
    description: string;
    dateRange: string;
    icon?: string;
}

export const promotions: PromotionItem[] = [
    // {
    //     id: 1,
    //     title: "Winter Wine Bundle",
    //     description: "Mix-and-match any 6 bottles for 10% off.",
    //     dateRange: "Feb 10 - Feb 24",
    //     icon: "🍷",
    // },
    // {
    //     id: 2,
    //     title: "Whiskey Weekend",
    //     description: "Save $5 on select local bourbons this weekend.",
    //     dateRange: "Feb 15 - Feb 16",
    //     icon: "🥃",
    // },
    // {
    //     id: 3,
    //     title: "Charcuterie Pairing",
    //     description: "Grab a board and get 15% off any featured red.",
    //     dateRange: "Ends Feb 28",
    //     icon: "🧀",
    // },
];
