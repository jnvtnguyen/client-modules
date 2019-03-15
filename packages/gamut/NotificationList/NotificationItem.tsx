import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import moment from 'moment';
import Truncate from 'react-truncate';
import { Notification } from './typings';
import NotificationIcon from './NotificationIcon';
import s from './styles/Notification.scss';

const propTypes = {
  date: PropTypes.string,
  iconSettings: PropTypes.object,
  iconSlug: PropTypes.string,
  imageUrl: PropTypes.string,
  link: PropTypes.string,
  onClick: PropTypes.func,
  text: PropTypes.string,
  unread: PropTypes.bool,
};

export type NotificationProps = {
  onClick?: (event: object) => void;
};

const formatTime = (notificationDate: string): string => {
  return moment(notificationDate).fromNow();
}

const NotificationItem = (props: NotificationProps & Notification) => {
  const { date, iconSettings, iconSlug, imageUrl, link, onClick, text, unread } = props;

  const notificationClasses = cx(
    s.notification,
    {
      [s.unread]: unread
    }
  );

  return (
    <a href={link} target='_blank' rel='noopener noreferrer' className={notificationClasses} onClick={onClick}>
      <NotificationIcon iconSettings={iconSettings} iconSlug={iconSlug} imageUrl={imageUrl} />
      <div className={s.body}>
        <div className={s.text}>
          <Truncate
            lines={3}
            ellipsis='...'
          > 
            {text}
          </Truncate>
        </div>
        <div className={s.time}>{formatTime(date)}</div>
      </div>
    </a>
  );
};

NotificationItem.propTypes = propTypes;

export default NotificationItem;
