export const dropdownItems = [
    {
        name: "15 Menit",
        value: 900,
    },
    {
        name: "30 Menit",
        value: 1800,
    },
    {
        name: "45 Menit",
        value: 2700,
    },
    {
        name: "1 Jam",
        value: 3600,
    },
    {
        name: "2 Jam",
        value: 7200,
    },
    {
        name: "3 Jam",
        value: 10800,
    },
    {
        name: "6 Jam",
        value: 21600,
    },
    {
        name: "9 Jam",
        value: 32400,
    },
    {
        name: "12 Jam",
        value: 43200,
    },
    {
        name: "1 Hari",
        value: 86400,
    },
] as const;

export interface DropdownItems {
    name: typeof dropdownItems[number]['name'];
    value: typeof dropdownItems[number]['value'];
}

