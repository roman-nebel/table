import { IconFunnel } from '@consta/icons/IconFunnel';
import { IconKebab } from '@consta/icons/IconKebab';
import { IconUnsort } from '@consta/icons/IconUnsort';
import { useBoolean, useSelect } from '@consta/stand';
import { Avatar } from '@consta/uikit/Avatar';
import { Button } from '@consta/uikit/Button';
import React, { useMemo } from 'react';

import { DataCell } from '##/components/DataCell';
import { HeaderDataCell } from '##/components/HeaderDataCell';

import { Table, TableColumn } from '..';
import data from '../__mocks__/olympic-winners.json';

const AthleteHeaderCell = (props: { title?: string; size: 'm' | 's' }) => {
  const { title, size } = props;

  const bottonSize = size === 'm' ? 's' : 'xs';

  return (
    <HeaderDataCell
      size={size}
      control={[
        <Button
          size={bottonSize}
          view="clear"
          iconLeft={IconUnsort}
          onlyIcon
        />,
        <Button
          size={bottonSize}
          view="clear"
          iconLeft={IconFunnel}
          onlyIcon
        />,
        <Button size={bottonSize} view="clear" iconLeft={IconKebab} onlyIcon />,
      ]}
    >
      {title}
    </HeaderDataCell>
  );
};

const AthleteDataCell = (props: {
  row: { athlete: string };
  size: 'm' | 's';
}) => {
  const {
    row: { athlete },
    size,
  } = props;
  return (
    <DataCell size={size} control={<Avatar size={size} name={athlete} />}>
      {athlete}
    </DataCell>
  );
};

const OtherCell = (props: {
  title: string | number | null;
  size: 'm' | 's';
}) => {
  const { title, size } = props;
  return <DataCell size={size}>{title}</DataCell>;
};

const OtherHeaderCell = (props: {
  title: string | number | undefined;
  size: 'm' | 's';
}) => {
  const { title, size } = props;
  return <HeaderDataCell size={size}>{title}</HeaderDataCell>;
};

type Row = {
  athlete: string;
  age: number | null;
  country: string;
  year: number;
  date: string;
  sport: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
};

const Variants = () => {
  const size = useSelect('size', ['m', 's'], 'm') || 'm';
  const stickyHeader = useBoolean('stickyHeader');
  const virtualScroll = useBoolean('virtualScroll');
  const zebraStriped = useBoolean('zebraStriped');
  const resizable = useSelect('resizable', ['outside', 'inside']);
  const withRenderCell = useBoolean('withRenderCell');
  const withRenderHeaderCell = useBoolean('withRenderHeaderCell');

  const columns: TableColumn<Row>[] = useMemo(
    () => [
      {
        title: 'Имя',
        width: 'auto',
        accessor: 'athlete',
        minWidth: 160,
        renderCell: withRenderCell
          ? (props) => <AthleteDataCell {...props} size={size} />
          : (props) => <OtherCell title={props.row.athlete} size={size} />,
        renderHeaderCell: withRenderHeaderCell
          ? (props) => <AthleteHeaderCell {...props} size={size} />
          : (props) => <OtherHeaderCell title={props.title} size={size} />,
      },
      {
        title: 'Страна',
        accessor: 'country',
        width: 'auto',
        minWidth: 140,
        renderCell: (props) => (
          <OtherCell title={props.row.country} size={size} />
        ),
        renderHeaderCell: (props) => (
          <OtherHeaderCell title={props.title} size={size} />
        ),
      },
      {
        title: 'Возраст',
        accessor: 'age',
        minWidth: 100,
        renderCell: (props) => <OtherCell title={props.row.age} size={size} />,
        renderHeaderCell: (props) => (
          <OtherHeaderCell title={props.title} size={size} />
        ),
        hidden: true,
      },
    ],
    [withRenderCell, withRenderHeaderCell, size],
  );
  const rows: Row[] = useMemo(
    () => (virtualScroll ? data : data.slice(0, 100)),
    [virtualScroll],
  );

  return (
    <div style={{ position: 'absolute', height: '100%', width: '100%' }}>
      <Table
        rows={rows}
        resizable={resizable}
        zebraStriped={zebraStriped}
        columns={columns}
        stickyHeader={stickyHeader}
        virtualScroll={virtualScroll}
        style={{ maxHeight: '100%' }}
      />
    </div>
  );
};

export default Variants;
