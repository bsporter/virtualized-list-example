import { useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { sportData } from '../data';
import styles from './Header.module.css';

const getLeagues = () => {
    return sportData.flatMap((sport) => sport.leagues.map((league) => league.name));
};

const useCenterLeagueItem = (currLeague: string) => {
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!headerRef.current) return;

        const currLeagueNode = headerRef.current.querySelector(
            `[data-league="${currLeague}"]`
        ) as HTMLDivElement | null;
        if (!currLeagueNode) return;

        const leagueOffset = currLeagueNode.offsetLeft;
        const leagueWidth = currLeagueNode.clientWidth;
        const headerWidth = headerRef.current.clientWidth;

        // Keep focused league in center
        headerRef.current.scrollTo({
            left: leagueOffset + leagueWidth / 2 - headerWidth / 2,
            behavior: 'smooth',
        });
    }, [currLeague]);

    return headerRef;
};

interface Props {
    onLeagueClick(league: string): void;
    currLeague: string;
}

export const Header = ({ onLeagueClick, currLeague }: Props) => {
    const headerRef = useCenterLeagueItem(currLeague);
    const leagues = useMemo(getLeagues, []);

    return (
        <div ref={headerRef} className={styles.header}>
            {leagues.map((league) => (
                <div
                    key={league}
                    data-league={league}
                    className={classNames(styles.headerItem, { [styles.active]: league === currLeague })}
                    onClick={() => onLeagueClick(league)}
                >
                    {league}
                </div>
            ))}
        </div>
    );
};
