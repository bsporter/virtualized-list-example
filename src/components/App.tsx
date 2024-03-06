import { useCallback, useMemo, useRef, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VirtualizedList, VirtualizedListRef } from './VirtualizedList';
import { ListItem } from './ListItem';
import { Header } from './Header';
import { eventHeight, getListItems, leagueHeaderHeight, sportData } from '../data';
import styles from './App.module.css';

function App() {
    const listRef = useRef<VirtualizedListRef>(null);
    const [animating, setAnimating] = useState(false);

    const itemData = useMemo(() => ({ items: getListItems() }), []);
    const [currLeague, setCurrLeague] = useState('');

    const getItemSize = useCallback(
        (index: number) => {
            switch (itemData.items[index].type) {
                case 'league-header':
                    return leagueHeaderHeight;
                case 'event':
                    return eventHeight;
            }
        },
        [itemData.items]
    );

    const onLeagueClicked = (leagueName: string) => {
        if (animating) return;
        let scrollOffset = 0;
        for (const sport of sportData) {
            for (const league of sport.leagues) {
                if (league.name === leagueName) {
                    setCurrLeague(league.name);
                    if (listRef.current?.scrollToOffset(scrollOffset)) {
                        setAnimating(true);
                    }
                    return;
                }

                scrollOffset += leagueHeaderHeight;
                scrollOffset += league.eventCount * eventHeight;
            }
        }
    };

    return (
        <div className={styles.app}>
            <Header onLeagueClick={onLeagueClicked} currLeague={currLeague} />
            <div className={styles.list}>
                <AutoSizer disableWidth>
                    {({ height }: { height: number }) => (
                        <VirtualizedList
                            ref={listRef}
                            duration={1500}
                            overscanCount={5}
                            width='100%'
                            height={height}
                            itemCount={itemData.items.length}
                            itemSize={getItemSize}
                            itemData={itemData}
                            onAnimationComplete={() => setAnimating(false)}
                            onItemsRendered={(props) => {
                                if (animating) return;
                                const item =
                                    itemData.items[Math.floor((props.visibleStartIndex + props.visibleStopIndex) / 2)];
                                setCurrLeague(item.type === 'event' ? item.event.league : item.name);
                            }}
                        >
                            {ListItem}
                        </VirtualizedList>
                    )}
                </AutoSizer>
            </div>
        </div>
    );
}

export default App;
