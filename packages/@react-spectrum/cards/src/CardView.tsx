/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {CardBase} from './CardBase';
import {CardViewContext, useCardViewContext} from './CardViewContext';
import cardViewStyles from './cardview.css';
import {classNames, useDOMRef, useUnwrapDOMRef, useStyleProps} from '@react-spectrum/utils';
import {DOMRef, DOMRefValue} from '@react-types/shared';
import {GridCollection, useGridState} from '@react-stately/grid';
// @ts-ignore
import intlMessages from '../intl/*.json';
import {ProgressCircle} from '@react-spectrum/progress';
import React, {ReactElement, useMemo, useRef} from 'react';
import {SpectrumCardViewProps} from '@react-types/cards';
import styles from '@adobe/spectrum-css-temp/components/card/vars.css';
import {useCollator,useLocale, useMessageFormatter} from '@react-aria/i18n';
import {useGrid, useGridCell, useGridRow} from '@react-aria/grid';
import {useListState} from '@react-stately/list';
import {Virtualizer} from '@react-aria/virtualizer';

function CardView<T extends object>(props: SpectrumCardViewProps<T>, ref: DOMRef<HTMLDivElement>) {
  let {styleProps} = useStyleProps(props);
  let domRef = useDOMRef(ref);
  let {
    cardOrientation,
    cardSize,
    isQuiet,
    renderEmptyState,
    layout,
    loadingState,
    onLoadMore
  } = props;
  let collator = useCollator({usage: 'search', sensitivity: 'base'});
  let isLoading = loadingState === 'loading' || loadingState === 'loadingMore';
  let cardViewLayout = useMemo(() => typeof layout === 'function' ? new layout({cardSize, cardOrientation, collator}) : layout, [layout, cardSize, cardOrientation]);

  let formatMessage = useMessageFormatter(intlMessages);
  let {direction} = useLocale();
  let {collection} = useListState(props);

  let gridCollection = useMemo(() => new GridCollection<T>({
    columnCount: 1,
    items: [...collection].map(item => ({
      type: 'item',
      childNodes: [{
        ...item,
        index: 0,
        type: 'cell'
      }]
    }))
  }), [collection]);

  let state = useGridState({
    ...props,
    collection: gridCollection,
    // TODO: this is a tentative change to make SelectionManager return the cell key on selection
    // If we don't want to go this way then I think we will have to write our own onAction instead of using manger.select?
    allowsCellSelection: true
  });

  // TODO: need to fix the typescript here, perhaps add a new type in Card types which is a Layout w/ these properties
  // TODO: double check that this is the correct collection being set (we wanna use the list collection for the keyboard delegate?)
  // If not, update the gridlayout code to use the gridCollection
  cardViewLayout.collection = collection;
  cardViewLayout.disabledKeys = state.disabledKeys;
  cardViewLayout.isLoading = isLoading;
  cardViewLayout.direction = direction;

  let {gridProps} = useGrid({
    ...props,
    isVirtualized: true,
    // TODO: fix the typescript here, layout definition need to show that it implements keyboard delegate
    keyboardDelegate: cardViewLayout
  }, state, domRef);

  // TODO: may need to add aria-rowcount to the virtualizer div? It exists in v2
  return (
    <CardViewContext.Provider value={{state, cardOrientation, cardSize, isQuiet, cardType: cardViewLayout.cardType}}>
      <Virtualizer
        {...gridProps}
        {...styleProps}
        ref={domRef}
        focusedKey={state.selectionManager.focusedKey}
        sizeToFit="height"
        scrollDirection="vertical"
        layout={cardViewLayout}
        collection={collection}
        isLoading={isLoading}
        onLoadMore={onLoadMore}>
        {(type, item) => {
          if (type === 'item') {
            return (
              <InternalCard item={item} />
            )
          } else if (type === 'loader') {
            return (
              <CenteredWrapper>
                <ProgressCircle
                  isIndeterminate
                  aria-label={state.collection.size > 0 ? formatMessage('loadingMore') : formatMessage('loading')} />
              </CenteredWrapper>
            )
          } else if (type === 'placeholder') {
            let emptyState = renderEmptyState ? renderEmptyState() : null;
            if (emptyState == null) {
              return null;
            }

            return (
              <CenteredWrapper>
                {emptyState}
              </CenteredWrapper>
            );
          }
        }}
      </Virtualizer>
    </CardViewContext.Provider>

  );
}

// TODO filler centerwrapper from ListView, check if is valid
function CenteredWrapper({children}) {
  let {state} = useCardViewContext();
  return (
    <div
      role="row"
      aria-rowindex={state.collection.size + 1}
      className={classNames(cardViewStyles, 'react-spectrum-CardView-centeredWrapper')}>
      <div role="gridcell">
        {children}
      </div>
    </div>
  );
}

function InternalCard(props) {
  let {
    item
  } = props;
  let {state, cardOrientation, cardSize, isQuiet, cardType} = useCardViewContext();

  let rowRef = useRef();
  let cellRef = useRef<DOMRefValue<HTMLDivElement>>();
  let unwrappedRef = useUnwrapDOMRef(cellRef);

  let {rowProps} = useGridRow({
    node: item,
    isVirtualized: true
  }, state, rowRef);

  let {gridCellProps} = useGridCell({
    node: item,
    focusMode: 'cell'
  }, state, unwrappedRef);

  return (
    // TODO: added padding here to make the focus ring not get cut off. Replace with a real fix
    <div {...rowProps} ref={rowRef} style={{padding: '2px', height: '100%'}}>
      <CardBase
        ref={cellRef}
        articleProps={gridCellProps}
        isQuiet={isQuiet || cardType === 'quiet'}
        orientation={cardOrientation}
        size={cardSize}
        item={item}
        UNSAFE_className={
          classNames(
            styles,
            'spectrum-Card--inGrid'
          )
        }>
        {item.rendered}
      </CardBase>
    </div>
  )
}

/**
 * TODO: Add description of component here.
 */
 const _CardView = React.forwardRef(CardView) as <T>(props: SpectrumCardViewProps<T> & {ref?: DOMRef<HTMLDivElement>}) => ReactElement;
export {_CardView as CardView};
