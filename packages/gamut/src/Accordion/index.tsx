import React, { useState } from 'react';

import { AccordionArea } from '../AccordionArea';
import { AccordionButton, AccordionButtonTheme } from '../AccordionButton';

export type ChildrenOrExpandedRender =
  | React.ReactNode
  | ((expanded: boolean) => React.ReactNode);

export type AccordionProps = {
  children: ChildrenOrExpandedRender;

  /**
   * CSS class name added to the root area container.
   */
  className?: string;

  /**
   * Whether the accordion should start off with expanded state.
   */
  initiallyExpanded?: boolean;

  /**
   * Called when the top button is clicked.
   *
   * @param expanding - New expanded state the accordion will transition to.
   */
  onClick?: (expanding: boolean) => void;

  /**
   * Visual theme of the top button.
   */
  colorVariant?: AccordionButtonTheme;

  /**
   * Contents to place within the top button.
   */
  top: ChildrenOrExpandedRender;
};

export const Accordion: React.FC<AccordionProps> = ({
  children,
  className,
  initiallyExpanded,
  onClick,
  colorVariant,
  top,
}) => {
  const [expanded, setExpanded] = useState(!!initiallyExpanded);
  const expandRenderer = (renderer: ChildrenOrExpandedRender) =>
    renderer instanceof Function ? renderer(expanded) : renderer;

  return (
    <AccordionArea
      className={className}
      expanded={expanded}
      top={
        <AccordionButton
          expanded={expanded}
          onClick={() => {
            setExpanded(!expanded);
            onClick?.(!expanded);
          }}
          colorVariant={colorVariant}
        >
          {expandRenderer(top)}
        </AccordionButton>
      }
    >
      {expandRenderer(children)}
    </AccordionArea>
  );
};
