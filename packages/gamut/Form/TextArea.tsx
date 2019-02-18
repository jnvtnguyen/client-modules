import React, { HTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import s from './styles/TextArea.scss';

export type TextAreaProps = HTMLAttributes<HTMLTextAreaElement> & {
  className?: string;
  error?: boolean;
  htmlFor?: string;
  name?: string;
  required?: boolean;
};

const TextArea = ({ error, htmlFor, className, ...rest }: TextAreaProps) => {
  const classNames = cx(
    s.TextArea,
    {
      [s.error]: error,
    },
    className
  );

  return <textarea {...rest} id={htmlFor} className={classNames} />;
};

TextArea.propTypes = {
  className: PropTypes.string,
  htmlFor: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.bool,
};

export default TextArea;
