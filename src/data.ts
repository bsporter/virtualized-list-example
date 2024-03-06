export const sportData = [
    {
        name: 'Football',
        leagues: [
            {
                name: 'NFL',
                eventCount: 50,
            },
            {
                name: 'NCAAF',
                eventCount: 50,
            },
        ],
    },
    {
        name: 'Basketball',
        leagues: [
            {
                name: 'NBA',
                eventCount: 50,
            },
            {
                name: 'NCAAB',
                eventCount: 50,
            },
            {
                name: 'Euroleague',
                eventCount: 50,
            },
        ],
    },
    {
        name: 'Hockey',
        leagues: [
            {
                name: 'NHL',
                eventCount: 50,
            },
            {
                name: 'Hockey League 2',
                eventCount: 50,
            },
        ],
    },
    {
        name: 'Soccer',
        leagues: [
            {
                name: 'MLS',
                eventCount: 50,
            },
            {
                name: 'UEFA Champions League',
                eventCount: 50,
            },
        ],
    },
    {
        name: 'Baseball',
        leagues: [
            {
                name: 'MLB',
                eventCount: 50,
            },
            {
                name: 'Baseball League 2',
                eventCount: 50,
            },
        ],
    },
];

export const leagueHeaderHeight = 50;
export const eventHeight = 120;

export type LeagueHeaderItem = {
    type: 'league-header';
    name: string;
};

export type EventItem = {
    type: 'event';
    event: {
        id: string;
        name: string;
        league: string;
    };
};

export type ListItem = EventItem | LeagueHeaderItem;

export const getListItems = () => {
    const listItems: ListItem[] = [];
    sportData.forEach((sport) => {
        sport.leagues.forEach((league) => {
            listItems.push({ type: 'league-header', name: league.name });
            for (let i = 0; i < league.eventCount; i++) {
                listItems.push({
                    type: 'event',
                    event: {
                        id: `${sport.name}-${league.name}-${i}`,
                        name: `${league.name} event ${i}`,
                        league: league.name,
                    },
                });
            }
        });
    });

    return listItems;
};
