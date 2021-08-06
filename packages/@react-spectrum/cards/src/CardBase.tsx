import {classNames, SlotProvider, useDOMRef, useHasChild, useStyleProps} from '@react-spectrum/utils';
import {Divider} from '@react-spectrum/divider';
import {DOMRef} from '@react-types/shared';
import {filterDOMProps} from '@react-aria/utils';
import React, {useMemo, useRef} from 'react';
import {SpectrumCardProps} from '@react-types/cards';
import styles from '@adobe/spectrum-css-temp/components/card/vars.css';
import {useCard} from '@react-aria/cards';
import {useProviderProps} from '@react-spectrum/provider';
import {FocusRing} from '@react-aria/focus';


function CardBase(props: SpectrumCardProps, ref: DOMRef<HTMLDivElement>) {
  props = useProviderProps(props);
  let {isQuiet, orientation = 'vertical', articleProps} = props;
  let {styleProps} = useStyleProps(props);
  let {cardProps, titleProps, contentProps} = useCard(props);
  // let domRef = useDOMRef(ref);
  let gridRef = useRef();

  let hasFooter = useHasChild(`.${styles['spectrum-Card-footer']}`, gridRef);

  let slots = useMemo(() => ({
    image: {UNSAFE_className: classNames(styles, 'spectrum-Card-image'), objectFit: isQuiet ? 'contain' : 'cover', alt: ''},
    illustration: {UNSAFE_className: classNames(styles, 'spectrum-Card-illustration')},
    avatar: {UNSAFE_className: classNames(styles, 'spectrum-Card-avatar'), size: 'avatar-size-100'},
    heading: {UNSAFE_className: classNames(styles, 'spectrum-Card-heading'), ...titleProps},
    content: {UNSAFE_className: classNames(styles, 'spectrum-Card-content'), ...contentProps},
    detail: {UNSAFE_className: classNames(styles, 'spectrum-Card-detail')},
    actionmenu: {UNSAFE_className: classNames(styles, 'spectrum-Card-actions'), align: 'end', isQuiet: true},
    footer: {UNSAFE_className: classNames(styles, 'spectrum-Card-footer')},
    divider: {UNSAFE_className: classNames(styles, 'spectrum-Card-divider'), size: 'S'}
  }), [titleProps, contentProps]);

  return (
    <FocusRing
      focusClass={classNames(styles, 'is-focused')}
      focusRingClass={classNames(styles, 'focus-ring')}>
      <article
        {...filterDOMProps(props)}
        {...cardProps}
        {...styleProps}
        {...articleProps}
        ref={ref}
        // ref={domRef}
        className={classNames(styles, 'spectrum-Card', {
          'spectrum-Card--default': !isQuiet && orientation !== 'horizontal',
          'spectrum-Card--isQuiet': isQuiet && orientation !== 'horizontal',
          'spectrum-Card--horizontal': orientation === 'horizontal',
        }, styleProps.className)}>
        <div ref={gridRef} className={styles['spectrum-Card-grid']}>
          <SlotProvider slots={slots}>
            {props.children}
            {hasFooter && <Divider />}
          </SlotProvider>
        </div>
      </article>
    </FocusRing>
  );
}

/**
 * TODO: Add description of component here.
 */
 const _CardBase = React.forwardRef(CardBase);
 export {_CardBase as CardBase};
