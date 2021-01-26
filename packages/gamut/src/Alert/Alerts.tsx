import { positioning } from '@codecademy/gamut-styles';
import { HandlerProps } from '@codecademy/gamut-system';
import styled from '@emotion/styled';
import React, { useMemo, useState } from 'react';

import { Alert, AlertProps, VARIANT_META } from './Alert';

type AlertItemProps = HandlerProps<typeof positioning>;

export const AlertItem = styled.div<AlertItemProps>`
  ${positioning}
  width: 100%;
  position: absolute;
  opacity: 1;
  transition: opacity 0.1s ease-out, top 0.4s cubic-bezier(0.23, 1, 0.32, 1),
    left 0.4s cubic-bezier(0.23, 1, 0.32, 1);

  &[aria-hidden='true'] {
    opacity: 0;
    pointer-events: none;
  }
`;

const ItemArea = styled.div`
  position: relative;
  width: 820px;
`;

export const AlertsWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  left: 0;
  right: 0;
  top: 0;
  height: 100%;
  width: 100%;
  max-width: 1200px;
`;

export const Alerts: React.FC<{
  alerts?: AlertProps[];
  onClose: (id: string) => void;
}> = ({ alerts = [], onClose }) => {
  const [closed] = useState<string[]>([]);

  const alertsToRender = useMemo(() => {
    return alerts.sort(
      ({ variant: vA = 'general' }, { variant: vB = 'general' }) =>
        VARIANT_META[vA].order < VARIANT_META[vB].order ? -1 : 1
    );
  }, [alerts]);

  return (
    <AlertsWrapper>
      <ItemArea>
        {alertsToRender.map((alert, i) => {
          const normalIndex = i - closed.length;
          const offset = normalIndex > 2 ? 8 : normalIndex * 4;
          const isClosed = closed.includes(alert.message);

          return (
            <AlertItem
              zIndex={alertsToRender.length - i}
              aria-hidden={isClosed}
              left={`${-offset}px`}
              top={`${isClosed ? -100 : offset}px`}
              key={alert.message}
            >
              <Alert
                {...alert}
                onClose={() => {
                  onClose(alert.message);
                }}
              />
            </AlertItem>
          );
        })}
      </ItemArea>
    </AlertsWrapper>
  );
};