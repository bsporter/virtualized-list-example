import { ReactNode } from 'react';
import styles from './ListItem.module.css';
import { ListItem as ListItemData } from '../data';

interface Props {
    style: React.CSSProperties;
    index: number;
    data: {
        items: ListItemData[];
    };
}

export const ListItem = ({ style, index, data }: Props) => {
    const item = data.items[index];

    let content: ReactNode;
    switch (item.type) {
        case 'league-header':
            content = <span>League Header: {item.name}</span>;
            break;
        case 'event':
            content = <span>Event: {item.event.name}</span>;
            break;
    }

    return (
        <div className={styles.listItem} style={style}>
            {content}
        </div>
    );
};
